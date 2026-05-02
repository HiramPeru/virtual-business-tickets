import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { getSupabaseAdminClient } from "@/app/lib/supabase-admin";

export const dynamic = "force-dynamic";

const allowedRoles = new Set(["admin", "operator", "client_readonly", "pending"]);

async function requireAdmin() {
  const { supabase, user } = await requireUser();

  if (!user) return { supabase, user: null, ok: false };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { supabase, user, ok: profile?.role === "admin" };
}

export async function POST(request: NextRequest) {
  const { supabase, user, ok } = await requireAdmin();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!ok) {
    return NextResponse.json({ error: "Solo un admin puede crear usuarios" }, { status: 403 });
  }

  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const fullName = String(body.full_name || "").trim();
  const password = String(body.password || "");
  const role = allowedRoles.has(body.role) ? String(body.role) : "pending";
  const principalClientId = role === "client_readonly" ? body.principal_client_id || null : null;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Email y contraseña temporal de 8 caracteres son obligatorios" }, { status: 400 });
  }

  if (role === "client_readonly" && !principalClientId) {
    return NextResponse.json({ error: "Selecciona un cliente principal para el usuario de solo lectura" }, { status: 400 });
  }

  let admin;
  try {
    admin = getSupabaseAdminClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falta configurar administración de usuarios" },
      { status: 503 }
    );
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName
    }
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message || "No se pudo crear el usuario" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: created.user.id,
      full_name: fullName || email,
      role,
      principal_client_id: principalClientId
    })
    .select("id, full_name, role, principal_client_id")
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ profile }, { status: 201 });
}
