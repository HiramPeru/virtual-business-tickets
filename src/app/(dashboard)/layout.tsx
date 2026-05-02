import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Building2, ClipboardList, Landmark, UserRound, UsersRound } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";
import { isSupabaseConfigured } from "@/app/lib/env";
import { isInternalRole, roleLabel } from "@/app/lib/options";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="content" style={{ minHeight: "100vh" }}>
        <div className="page-title">
          <div>
            <h1>Configura Supabase</h1>
            <p>Faltan las variables de entorno para conectar la base de datos.</p>
          </div>
        </div>
        <div className="panel">
          <div className="panel-body" style={{ display: "grid", gap: 12 }}>
            <p>
              Crea el archivo <span className="mono">.env.local</span> en{" "}
              <span className="mono">/Users/horus/virtual-business-tickets</span> con:
            </p>
            <pre className="panel" style={{ margin: 0, overflowX: "auto", padding: 14 }}>
              NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase{"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
            </pre>
            <p className="muted">
              Después reinicia el servidor con <span className="mono">npm run dev</span>. El SQL está en{" "}
              <span className="mono">supabase/schema.sql</span>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "operator", "technician", "client_readonly"].includes(profile.role)) {
    return (
      <main className="content" style={{ minHeight: "100vh" }}>
        <div className="page-title">
          <div>
            <h1>Cuenta pendiente</h1>
            <p>Tu cuenta existe, pero aún no está habilitada para operar en el sistema.</p>
          </div>
          <LogoutButton />
        </div>
        <div className="panel">
          <div className="panel-body">
            <p className="muted" style={{ margin: 0 }}>
              Solicita a un administrador que active tu perfil como técnico.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Image alt="Virtual Business" height={42} src="/virtual-business-logo.jpg" width={42} />
          <span>Virtual Business Tickets</span>
        </div>
        <nav>
          <Link className="nav-link" href="/tickets">
            <ClipboardList size={18} />
            Tickets
          </Link>
          {isInternalRole(profile.role) ? (
            <>
              <Link className="nav-link" href="/principal-clients">
                <Landmark size={18} />
                Clientes principales
              </Link>
              <Link className="nav-link" href="/customers">
                <Building2 size={18} />
                Clientes
              </Link>
            </>
          ) : null}
          {profile.role === "admin" ? (
            <Link className="nav-link" href="/users">
              <UsersRound size={18} />
              Usuarios
            </Link>
          ) : null}
          <Link className="nav-link" href="/profile">
            <UserRound size={18} />
            Perfil
          </Link>
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <strong>{profile?.full_name || user.email}</strong>
            <div className="muted" style={{ fontSize: 13 }}>
              {roleLabel(profile?.role || "pending")}
            </div>
          </div>
          <LogoutButton />
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
