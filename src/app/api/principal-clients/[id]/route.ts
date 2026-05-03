import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole } from "@/app/lib/options";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!isInternalRole(profile?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  
  const updates: Record<string, string | null> = {};
  if (typeof body.name === "string" && body.name.trim() !== "") {
    updates.name = body.name.trim();
  }
  if (typeof body.ruc === "string") {
    updates.ruc = body.ruc.trim() || null;
  }
  if (body.status === "active" || body.status === "inactive") {
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("principal_clients")
    .update(updates)
    .eq("id", id)
    .select("id, name, ruc, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ principalClient: data });
}
