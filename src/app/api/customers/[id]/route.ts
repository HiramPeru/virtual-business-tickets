import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole } from "@/app/lib/options";

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

  try {
    const body = await request.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : undefined;
    const companyName = body.company !== undefined ? String(body.company).trim() : undefined;
    const principalClientId = body.principal_client_id !== undefined ? (body.principal_client_id || null) : undefined;
    
    // Get existing contact to know current company ID
    const { data: contactData } = await supabase
      .from("contacts")
      .select("id, company_id, company:companies(name)")
      .eq("id", id)
      .single();

    const contact = contactData as any;

    if (!contact) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    let finalCompanyId = contact.company_id;

    // Handle company updates
    if (companyName !== undefined) {
      if (!companyName) {
        finalCompanyId = null;
      } else {
        if (finalCompanyId && contact.company?.name === companyName) {
          // Just update existing company
          if (body.ruc !== undefined || principalClientId !== undefined) {
            const updates: any = {};
            if (body.ruc !== undefined) updates.ruc = body.ruc || null;
            if (principalClientId !== undefined) updates.principal_client_id = principalClientId;
            
            await supabase.from("companies").update(updates).eq("id", finalCompanyId);
          }
        } else {
          // Upsert by name
          const { data: company } = await supabase
            .from("companies")
            .upsert(
              {
                name: companyName,
                ruc: body.ruc || null,
                principal_client_id: principalClientId !== undefined ? principalClientId : null
              },
              { onConflict: "name" }
            )
            .select("id")
            .single();
          finalCompanyId = company?.id || null;
        }
      }
    }

    const updates: any = {};
    if (email !== undefined) updates.email = email;
    if (body.full_name !== undefined) updates.full_name = body.full_name || null;
    if (body.phone !== undefined) updates.phone = body.phone || null;
    if (companyName !== undefined) updates.company_id = finalCompanyId;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No hay datos a actualizar" });
    }

    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select("id, email, full_name, phone, company:companies(id, name, ruc)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ customer: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
