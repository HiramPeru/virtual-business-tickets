import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole } from "@/app/lib/options";

export const dynamic = "force-dynamic";

export async function GET() {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("principal_clients")
    .select("id, name, ruc, status")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ principalClients: data });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!isInternalRole(profile?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();

  if (!name) {
    return NextResponse.json({ error: "El nombre del cliente principal es obligatorio" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("principal_clients")
    .insert({
      name,
      ruc: body.ruc ? String(body.ruc).trim() : null,
      status: body.status === "inactive" ? "inactive" : "active"
    })
    .select("id, name, ruc, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ principalClient: data }, { status: 201 });
}
