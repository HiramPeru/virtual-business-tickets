import { TicketCreateForm } from "@/components/TicketCreateForm";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

export default async function NewTicketPage() {
  const supabase = await getSupabaseServerClient();
  const { data: principalClients } = await supabase
    .from("principal_clients")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Nuevo ticket</h1>
          <p>Registra una solicitud manual recibida por correo, llamada o WhatsApp.</p>
        </div>
      </div>
      <TicketCreateForm principalClients={principalClients || []} />
    </>
  );
}
