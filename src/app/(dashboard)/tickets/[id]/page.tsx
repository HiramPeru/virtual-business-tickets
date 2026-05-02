import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { TicketActions } from "@/components/TicketActions";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";
import { isInternalRole, priorityClass, statusClass } from "@/app/lib/options";

type TicketDetail = {
  id: string;
  ticket_code: string;
  subject: string;
  description: string | null;
  priority: string;
  status: string;
  assigned_to: string | null;
  category: string;
  subcategory: string | null;
  platform: string | null;
  contact: {
    email: string;
    full_name: string | null;
    phone: string | null;
    company: { name: string | null; ruc: string | null; principal_client: { name: string | null } | null } | null;
  } | null;
  assignee: { id: string; full_name: string | null } | null;
};

type ProfileRow = { id: string; full_name: string | null };

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user?.id).maybeSingle();
  const canOperate = isInternalRole(currentProfile?.role);
  const { data } = await supabase
    .from("tickets")
    .select(
      "*, contact:contacts(email, full_name, phone, company:companies(name, ruc, principal_client:principal_clients(name))), assignee:profiles!tickets_assigned_to_fkey(id, full_name)"
    )
    .eq("id", id)
    .single();
  const ticket = data as unknown as TicketDetail | null;

  if (!ticket) notFound();

  const [{ data: comments }, { data: profilesData }, { data: history }] = await Promise.all([
    supabase.from("ticket_comments").select("*").eq("ticket_id", id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name").order("full_name"),
    supabase.from("ticket_events").select("*").eq("ticket_id", id).order("created_at", { ascending: false }).limit(20)
  ]);
  const profiles = (profilesData || []) as unknown as ProfileRow[];

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{ticket.ticket_code}</h1>
          <p>{ticket.subject}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className={`badge ${priorityClass(ticket.priority)}`}>{ticket.priority}</span>
          <span className={`badge ${statusClass(ticket.status)}`}>{ticket.status}</span>
        </div>
      </div>
      <div className="grid-two">
        <section style={{ display: "grid", gap: 18 }}>
          <div className="panel">
            <div className="panel-body">
              <h2 style={{ marginTop: 0 }}>Detalle</h2>
              <div className="form-grid">
                <div>
                  <strong>Cliente</strong>
                  <p className="muted">
                    {ticket.contact?.full_name || ticket.contact?.email}
                    <br />
                    {ticket.contact?.company?.principal_client?.name || "Sin cliente principal"}
                    <br />
                    {ticket.contact?.company?.name || "Sin empresa"}
                    <br />
                    {ticket.contact?.email}
                  </p>
                </div>
                <div>
                  <strong>Clasificación</strong>
                  <p className="muted">
                    {ticket.category} · {ticket.platform || "Ninguna"}
                    <br />
                    {ticket.subcategory || "Sin subcategoría"}
                    <br />
                    Asignado: {ticket.assignee?.full_name || "Sin asignar"}
                  </p>
                </div>
                <div className="span-2">
                  <strong>Descripción</strong>
                  <p style={{ whiteSpace: "pre-wrap" }}>{ticket.description || "Sin descripción"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-body">
              <h2 style={{ marginTop: 0 }}>Comentarios</h2>
              {(comments || []).map((comment) => (
                <div
                  className={`comment ${comment.visibility === "customer_visible" ? "customer" : ""}`}
                  key={comment.id}
                >
                  <strong>{comment.author_name}</strong>
                  <span className="muted"> · {new Date(comment.created_at).toLocaleString("es-PE")}</span>
                  <div className="muted">{comment.visibility === "internal" ? "Interno" : "Visible para cliente"}</div>
                  <p style={{ whiteSpace: "pre-wrap" }}>{comment.content}</p>
                </div>
              ))}
              {comments?.length === 0 ? <p className="muted">Aún no hay comentarios.</p> : null}
            </div>
          </div>
          {canOperate ? <CommentForm ticketId={id} /> : null}
          <div className="panel">
            <div className="panel-body">
              <h2 style={{ marginTop: 0 }}>Historial</h2>
              {(history || []).map((event) => (
                <div key={event.id} style={{ borderBottom: "1px solid var(--line)", padding: "10px 0" }}>
                  <strong>{event.event_type}</strong>
                  <div className="muted">
                    {event.field_name || "ticket"}: {event.old_value || "-"} → {event.new_value || "-"}
                  </div>
                  <div className="muted">{new Date(event.created_at).toLocaleString("es-PE")}</div>
                </div>
              ))}
              {history?.length === 0 ? <p className="muted">Sin eventos todavía.</p> : null}
            </div>
          </div>
        </section>
        {canOperate ? (
          <TicketActions profiles={profiles} ticket={ticket} />
        ) : (
          <div className="panel">
            <div className="panel-body">
              <h2 style={{ marginTop: 0 }}>Solo lectura</h2>
              <p className="muted" style={{ margin: 0 }}>
                Puedes consultar el histórico visible de este ticket, sin modificarlo.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
