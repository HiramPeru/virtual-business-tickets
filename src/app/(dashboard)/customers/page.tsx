import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

type ContactRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: { name: string | null; ruc: string | null; principal_client: { name: string | null } | null } | null;
};

export default async function CustomersPage() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, email, full_name, phone, created_at, company:companies(name, ruc, principal_client:principal_clients(name))")
    .order("created_at", { ascending: false })
    .limit(100);
  const contacts = (data || []) as unknown as ContactRow[];

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Clientes</h1>
          <p>Contactos y empresas atendidas por Virtual Business.</p>
        </div>
        <Link className="button" href="/customers/new">
          <Plus size={16} />
          Nuevo cliente
        </Link>
      </div>
      {error ? <div className="alert">{error.message}</div> : null}
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Cliente principal</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {(contacts || []).map((contact) => (
              <tr key={contact.id}>
                <td>{contact.email}</td>
                <td>{contact.full_name || "-"}</td>
                <td>
                  {contact.company?.name || "-"}
                  <div className="muted">{contact.company?.ruc || ""}</div>
                </td>
                <td>{contact.company?.principal_client?.name || "-"}</td>
                <td>{contact.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
