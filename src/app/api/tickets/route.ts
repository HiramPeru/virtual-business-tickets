import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole, isTicketPriority, normalizeTicketPriority } from "@/app/lib/options";

export const dynamic = "force-dynamic";

const ticketSelect =
  "*, contact:contacts(id, email, full_name, phone, company:companies(id, name, ruc)), assignee:profiles!tickets_assigned_to_fkey(id, full_name)";

export async function GET(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!isInternalRole(profile?.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  let query = supabase.from("tickets").select(ticketSelect).order("created_at", { ascending: false });

  for (const key of ["status", "priority", "category", "platform", "assigned_to"]) {
    const value = searchParams.get(key);
    if (value) query = query.eq(key, value);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tickets: data });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const priority = normalizeTicketPriority(body.priority);

  if (!isTicketPriority(priority)) {
    return NextResponse.json({ error: "Selecciona una prioridad válida" }, { status: 400 });
  }

  const payload = {
    contact_id: body.contact_id,
    category: body.category,
    subcategory: body.subcategory || null,
    platform: body.platform || "Ninguna",
    subject: body.subject,
    description: body.description || null,
    priority,
    created_by: user.id,
    updated_by: user.id
  };

  const { data, error } = await supabase.from("tickets").insert(payload).select(ticketSelect).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ticket: data }, { status: 201 });
}
