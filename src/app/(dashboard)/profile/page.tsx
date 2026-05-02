import { ProfileForm } from "@/components/ProfileForm";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user?.id)
    .maybeSingle();

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Perfil</h1>
          <p>Actualiza tu nombre visible para asignaciones y comentarios.</p>
        </div>
      </div>
      <ProfileForm fullName={profile?.full_name || ""} />
    </>
  );
}
