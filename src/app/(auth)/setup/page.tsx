import { SetupAdminForm } from "@/components/SetupAdminForm";
import { isSupabaseConfigured } from "@/app/lib/env";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const configured = isSupabaseConfigured();
  let setupClosed = false;

  if (configured) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.rpc("has_any_profile");
    setupClosed = error ? true : Boolean(data);
  }

  return (
    <main
      style={{
        alignItems: "center",
        display: "grid",
        minHeight: "100vh",
        padding: 24
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 460, width: "100%" }}>
        <div className="page-title">
          <div>
            <h1>Primer admin</h1>
            <p>Úsalo solo para crear la primera cuenta del sistema.</p>
          </div>
        </div>
        {configured ? (
          <SetupAdminForm disabled={setupClosed} />
        ) : (
          <div className="panel">
            <div className="panel-body">
              <p>Primero configura Supabase en las variables de entorno.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
