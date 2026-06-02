import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";
import {
  isInternalRole,
  priorityClass,
  priorityLabel,
  statusClass,
  statusLabel,
  ticketCategories,
  ticketPlatforms,
  ticketPriorities,
  ticketStatuses
} from "@/app/lib/options";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type TicketRow = {
  id: string;
  ticket_code: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  platform: string | null;
  created_at: string;
  contact: {
    email: string;
    full_name: string | null;
    company: { name: string | null; principal_client: { name: string | null } | null } | null;
  } | null;
};

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const item = params[key];
  return Array.isArray(item) ? item[0] : item || "";
}

export default async function TicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).maybeSingle();
  const canOperate = isInternalRole(profile?.role);
  let query = supabase
    .from("tickets")
    .select(
      "id, ticket_code, subject, priority, status, category, platform, created_at, contact:contacts(email, full_name, company:companies(name, principal_client:principal_clients(name)))"
    )
    .order("created_at", { ascending: false });

  for (const key of ["status", "priority", "category", "platform"]) {
    const filter = value(params, key);
    if (filter) query = query.eq(key, filter);
  }

  const { data, error } = await query;
  const tickets = (data || []) as unknown as TicketRow[];

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Tickets</h1>
          <p>Solicitudes manuales de activación, soporte y consultas.</p>
        </div>
        {canOperate ? (
          <div style={{ display: "flex", gap: 12 }}>
            <a
              className="button secondary"
              href={`/api/tickets/export?${new URLSearchParams(
                Object.entries(params).reduce((acc, [key, val]) => {
                  if (val !== undefined && val !== "") {
                    acc[key] = Array.isArray(val) ? val[0] : String(val);
                  }
                  return acc;
                }, {} as Record<string, string>)
              ).toString()}`}
            >
              <Download size={16} />
              Exportar CSV
            </a>
            <Link className="button" href="/tickets/new">
              <Plus size={16} />
              Nuevo ticket
            </Link>
          </div>
        ) : null}
      </div>
      <form className="toolbar">
        <div className="field">
          <label>Estado</label>
          <select className="select" defaultValue={value(params, "status")} name="status">
            <option value="">Todos</option>
            {ticketStatuses.map((item) => (
              <option key={item} value={item}>
                {statusLabel(item)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Prioridad</label>
          <select className="select" defaultValue={value(params, "priority")} name="priority">
            <option value="">Todas</option>
            {ticketPriorities.map((item) => (
              <option key={item} value={item}>
                {priorityLabel(item)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Categoría</label>
          <select className="select" defaultValue={value(params, "category")} name="category">
            <option value="">Todas</option>
            {ticketCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Plataforma</label>
          <select className="select" defaultValue={value(params, "platform")} name="platform">
            <option value="">Todas</option>
            {ticketPlatforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>&nbsp;</label>
          <button className="button secondary" type="submit">
            Filtrar
          </button>
        </div>
      </form>
      {error ? <div className="alert">{error.message}</div> : null}
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Asunto</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {(tickets || []).map((ticket) => (
              <tr key={ticket.id}>
                <td className="mono">
                  <Link href={`/tickets/${ticket.id}`}>{ticket.ticket_code}</Link>
                </td>
                <td>
                  <strong>{ticket.contact?.full_name || ticket.contact?.email}</strong>
                  <div className="muted">{ticket.contact?.company?.name || ticket.contact?.email}</div>
                  <div className="muted">{ticket.contact?.company?.principal_client?.name || ""}</div>
                </td>
                <td>
                  <Link href={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
                  <div className="muted">
                    {ticket.category} · {ticket.platform}
                  </div>
                </td>
                <td>
                  <span className={`badge ${priorityClass(ticket.priority)}`}>{priorityLabel(ticket.priority)}</span>
                </td>
                <td>
                  <span className={`badge ${statusClass(ticket.status)}`}>{statusLabel(ticket.status)}</span>
                </td>
                <td>{new Date(ticket.created_at).toLocaleString("es-PE")}</td>
              </tr>
            ))}
            {tickets.length === 0 ? (
              <tr>
                <td className="muted" colSpan={6}>
                  No hay tickets con estos filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
