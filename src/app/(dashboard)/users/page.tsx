import { UserCreateForm } from "@/components/UserCreateForm";
import { UserRoleForm } from "@/components/UserRoleForm";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";
import { roleLabel } from "@/app/lib/options";

type PrincipalClient = { id: string; name: string };
type UserProfile = {
  id: string;
  full_name: string | null;
  role: string;
  principal_client_id: string | null;
  principal_client: { name: string | null } | null;
};

export default async function UsersPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user?.id).maybeSingle();

  if (currentProfile?.role !== "admin") {
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Usuarios</h1>
            <p>Solo administradores pueden gestionar usuarios.</p>
          </div>
        </div>
        <div className="alert">No autorizado.</div>
      </>
    );
  }

  const [{ data: profilesData }, { data: principalClientsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, principal_client_id, principal_client:principal_clients(name)")
      .order("created_at", { ascending: false }),
    supabase.from("principal_clients").select("id, name").eq("status", "active").order("name")
  ]);

  const profiles = (profilesData || []) as unknown as UserProfile[];
  const principalClients = (principalClientsData || []) as unknown as PrincipalClient[];

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Usuarios</h1>
          <p>Operadores internos y coordinadores/clientes con histórico de solo lectura.</p>
        </div>
      </div>
      <div style={{ display: "grid", gap: 18 }}>
        <UserCreateForm principalClients={principalClients} />
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Cliente visible</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    <strong>{profile.full_name || profile.id}</strong>
                    <div className="muted mono">{profile.id}</div>
                  </td>
                  <td>{roleLabel(profile.role)}</td>
                  <td>{profile.principal_client?.name || "-"}</td>
                  <td>
                    <UserRoleForm principalClients={principalClients} profile={profile} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
