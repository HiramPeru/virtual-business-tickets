import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "@/app/lib/env";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Verificar autorización (Solo Admins)
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (currentProfile?.role !== "admin") {
    return NextResponse.json({ error: "Solo un administrador puede cambiar contraseñas" }, { status: 403 });
  }

  // 2. Obtener la nueva contraseña
  const body = await request.json();
  const newPassword = body.password;

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }

  // 3. Inicializar el cliente Supabase de Administrador (bypassea RLS)
  const { url } = getSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "Clave de servicio no configurada en el servidor" }, { status: 500 });
  }

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // 4. Actualizar la contraseña del usuario
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    password: newPassword
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente" });
}
