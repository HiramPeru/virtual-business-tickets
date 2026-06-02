import { NextRequest } from "next/server";
import { requireUser } from "@/app/lib/supabase-server";
import { isInternalRole, priorityLabel, statusLabel } from "@/app/lib/options";

export const dynamic = "force-dynamic";

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!isInternalRole(profile?.role)) {
    return new Response("No autorizado", { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  let query = supabase
    .from("tickets")
    .select(
      "ticket_code, subject, priority, status, category, platform, created_at, contact:contacts(email, full_name, company:companies(name, principal_client:principal_clients(name))), assignee:profiles!tickets_assigned_to_fkey(full_name)"
    )
    .order("created_at", { ascending: false });

  for (const key of ["status", "priority", "category", "platform", "assigned_to"]) {
    const value = searchParams.get(key);
    if (value) query = query.eq(key, value);
  }

  const { data: tickets, error } = await query;

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  // Definir cabeceras de las columnas del CSV
  const headers = [
    "Código",
    "Asunto",
    "Prioridad",
    "Estado",
    "Categoría",
    "Plataforma",
    "Cliente / Contacto",
    "Email Contacto",
    "Empresa",
    "Cliente Principal",
    "Asignado A",
    "Fecha Creación"
  ];

  // Construir filas
  const rows = (tickets || []).map((ticket: any) => {
    const contactName = ticket.contact?.full_name || "";
    const contactEmail = ticket.contact?.email || "";
    const companyName = ticket.contact?.company?.name || "";
    const principalClientName = ticket.contact?.company?.principal_client?.name || "";
    const assigneeName = ticket.assignee?.full_name || "Sin asignar";
    const dateStr = new Date(ticket.created_at).toLocaleString("es-PE");

    return [
      ticket.ticket_code,
      ticket.subject,
      priorityLabel(ticket.priority),
      statusLabel(ticket.status),
      ticket.category,
      ticket.platform || "Ninguna",
      contactName,
      contactEmail,
      companyName,
      principalClientName,
      assigneeName,
      dateStr
    ];
  });

  // Agregar el BOM para que Excel reconozca caracteres latinos en UTF-8
  const BOM = "\uFEFF";
  const csvContent = [headers.join(","), ...rows.map((row) => row.map(escapeCSV).join(","))].join("\r\n");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  
  return new Response(BOM + csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tickets-export-${timestamp}.csv"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
