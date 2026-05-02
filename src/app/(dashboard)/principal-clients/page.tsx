import { PrincipalClientForm } from "@/components/PrincipalClientForm";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

type PrincipalClientRow = {
  id: string;
  name: string;
  ruc: string | null;
  status: string;
  companies: { count: number }[];
};

export default async function PrincipalClientsPage() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("principal_clients")
    .select("id, name, ruc, status, companies(count)")
    .order("name");
  const clients = (data || []) as unknown as PrincipalClientRow[];

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Clientes principales</h1>
          <p>Organizaciones que agrupan a los clientes atendidos por Virtual Business.</p>
        </div>
      </div>
      {error ? <div className="alert">{error.message}</div> : null}
      <div style={{ display: "grid", gap: 18 }}>
        <PrincipalClientForm />
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente principal</th>
                <th>RUC</th>
                <th>Estado</th>
                <th>Clientes vinculados</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <strong>{client.name}</strong>
                  </td>
                  <td>{client.ruc || "-"}</td>
                  <td>
                    <span className={`badge ${client.status === "active" ? "success" : "warning"}`}>{client.status}</span>
                  </td>
                  <td>{client.companies?.[0]?.count || 0}</td>
                </tr>
              ))}
              {clients.length === 0 ? (
                <tr>
                  <td className="muted" colSpan={4}>
                    No hay clientes principales registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
