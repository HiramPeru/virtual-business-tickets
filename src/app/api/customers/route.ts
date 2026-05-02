import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search")?.trim();
  let query = supabase
    .from("contacts")
    .select("id, email, full_name, phone, company:companies(id, name, ruc)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ customers: data });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "El email es obligatorio" }, { status: 400 });
  }

  let companyId = body.company_id || null;
  const companyName = String(body.company || "").trim();

  if (!companyId && companyName) {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .upsert({ name: companyName, ruc: body.ruc || null }, { onConflict: "name" })
      .select("id")
      .single();

    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 400 });
    }

    companyId = company.id;
  }

  const { data: existing } = await supabase
    .from("contacts")
    .select("id, email, full_name, phone, company:companies(id, name, ruc)")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ customer: existing, existing: true });
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      email,
      full_name: body.full_name || body.name || null,
      phone: body.phone || null,
      company_id: companyId
    })
    .select("id, email, full_name, phone, company:companies(id, name, ruc)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ customer: data, existing: false }, { status: 201 });
}
