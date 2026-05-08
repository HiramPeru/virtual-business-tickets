import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import {
  isInternalRole,
  isTicketPriority,
  isTicketStatus,
  normalizeTicketPriority,
  normalizeTicketStatus
} from "@/app/lib/options";

export const dynamic = "force-dynamic";

const allowedFields = new Set([
  "status",
  "priority",
  "assigned_to",
  "category",
  "subcategory",
  "platform",
  "description",
  "subject"
]);

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
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

  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.has(key)) {
      const normalizedValue = value === "" ? null : String(value);
      if (key === "priority") {
        const priority = normalizeTicketPriority(normalizedValue);
        if (!isTicketPriority(priority)) {
          return NextResponse.json({ error: "Selecciona una prioridad válida" }, { status: 400 });
        }
        updates[key] = priority;
      } else if (key === "status") {
        const status = normalizeTicketStatus(normalizedValue);
        if (!isTicketStatus(status)) {
          return NextResponse.json({ error: "Selecciona un estado válido" }, { status: 400 });
        }
        updates[key] = status;
      } else {
        updates[key] = normalizedValue;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No hay campos válidos para actualizar" }, { status: 400 });
  }

  updates.updated_by = user.id;

  const { data, error } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ticket: data });
}
