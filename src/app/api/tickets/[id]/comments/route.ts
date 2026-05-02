import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole } from "@/app/lib/options";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!isInternalRole(currentProfile?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const content = String(body.content || "").trim();

  if (!content) {
    return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("ticket_comments")
    .insert({
      ticket_id: id,
      author_id: user.id,
      author_type: "technician",
      author_name: profile?.full_name || user.email || "Tecnico",
      content,
      visibility: body.visibility === "customer_visible" ? "customer_visible" : "internal"
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
