import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/app/lib/env";

export default function LoginPage() {
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
      <div style={{ margin: "0 auto", maxWidth: 420, width: "100%" }}>
        <div className="page-title">
          <div>
            <h1>VB Tickets</h1>
            <p>{configured ? "Ingreso para técnicos y administradores." : "Primero configura Supabase."}</p>
          </div>
        </div>
        {configured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="panel">
            <div className="panel-body" style={{ display: "grid", gap: 12 }}>
              <p>
                Crea <span className="mono">.env.local</span> con las variables de{" "}
                <span className="mono">.env.example</span> y reinicia el servidor.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
