export const ticketStatuses = [
  "New",
  "Assigned",
  "In Progress",
  "Pending Customer",
  "Resolved",
  "Closed"
] as const;

export const ticketPriorities = ["Critical", "High", "Medium", "Low"] as const;
export const ticketCategories = ["Activacion Cloud", "Soporte", "Consulta"] as const;
export const ticketPlatforms = ["Acronis", "Microsoft", "Ambas", "Ninguna"] as const;
export const profileRoles = ["admin", "operator", "client_readonly", "pending"] as const;

const priorityLabels: Record<string, string> = {
  Critical: "Crítico",
  High: "Alto",
  Medium: "Medio",
  Low: "Bajo"
};

const statusLabels: Record<string, string> = {
  New: "Nuevo",
  Assigned: "Asignado",
  "In Progress": "En progreso",
  "Pending Customer": "Cliente pendiente",
  Resolved: "Resuelto",
  Closed: "Cerrado"
};

const translatedPriorities: Record<string, string> = {
  Critico: "Critical",
  "Crítico": "Critical",
  Alto: "High",
  Alta: "High",
  Medio: "Medium",
  Media: "Medium",
  Bajo: "Low",
  Baja: "Low"
};

const translatedStatuses: Record<string, string> = {
  Nuevo: "New",
  Asignado: "Assigned",
  "En progreso": "In Progress",
  "Cliente pendiente": "Pending Customer",
  "Pendiente cliente": "Pending Customer",
  Resuelto: "Resolved",
  Cerrado: "Closed"
};

function canonicalOption(value: string) {
  return value.trim();
}

export function roleLabel(role: string) {
  if (role === "admin") return "Administrador";
  if (role === "operator" || role === "technician") return "Operador";
  if (role === "client_readonly") return "Cliente solo lectura";
  return "Pendiente";
}

export function priorityLabel(priority: string) {
  return priorityLabels[priority] || priority;
}

export function statusLabel(status: string) {
  return statusLabels[status] || status;
}

export function normalizeTicketPriority(priority: string | null | undefined) {
  if (!priority) return "Medium";
  const value = canonicalOption(priority);
  return translatedPriorities[value] || value;
}

export function normalizeTicketStatus(status: string | null | undefined) {
  if (!status) return "New";
  const value = canonicalOption(status);
  return translatedStatuses[value] || value;
}

export function isTicketPriority(priority: string) {
  return ticketPriorities.some((item) => item === priority);
}

export function isTicketStatus(status: string) {
  return ticketStatuses.some((item) => item === status);
}

export function isInternalRole(role?: string | null) {
  return role === "admin" || role === "operator" || role === "technician";
}

export function priorityClass(priority: string) {
  if (priority === "Critical") return "danger";
  if (priority === "High") return "warning";
  if (priority === "Low") return "success";
  return "info";
}

export function statusClass(status: string) {
  if (status === "Closed" || status === "Resolved") return "success";
  if (status === "Pending Customer") return "warning";
  if (status === "New") return "info";
  return "danger";
}
