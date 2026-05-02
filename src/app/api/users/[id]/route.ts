import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";

const allowedRoles = new Set(["admin", "operator", "client_readonly", "pending"]);

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (currentProfile?.role !== "admin") {
    return NextResponse.json({ error: "Solo un admin puede editar usuarios" }, { status: 403 });
  }

  const body = await request.json();
  const role = allowedRoles.has(body.role) ? String(body.role) : null;

  const updates: Record<string, string | null> = {};
  if (typeof body.full_name === "string") updates.full_name = body.full_name.trim() || null;
  if (role) updates.role = role;
  if (role === "client_readonly") updates.principal_client_id = body.principal_client_id || null;
  if (role && role !== "client_readonly") updates.principal_client_id = null;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select("id, full_name, role, principal_client_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profile: data });
}
