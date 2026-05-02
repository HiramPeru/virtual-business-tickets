import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, ClipboardList, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";
import { isSupabaseConfigured } from "@/app/lib/env";

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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Virtual Business Tickets</div>
        <nav>
          <Link className="nav-link" href="/tickets">
            <ClipboardList size={18} />
            Tickets
          </Link>
          <Link className="nav-link" href="/customers">
            <Building2 size={18} />
            Clientes
          </Link>
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
              {profile?.role || "technician"}
            </div>
          </div>
          <LogoutButton />
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
