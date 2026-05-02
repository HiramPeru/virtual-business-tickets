import { SetupAdminForm } from "@/components/SetupAdminForm";
import { isSupabaseConfigured } from "@/app/lib/env";

export default function SetupPage() {
  const configured = isSupabaseConfigured();

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
          <SetupAdminForm />
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
