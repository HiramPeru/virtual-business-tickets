import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const fullName = String(body.full_name || "").trim();

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", user.id)
    .select("id, full_name, role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profile: data });
}
