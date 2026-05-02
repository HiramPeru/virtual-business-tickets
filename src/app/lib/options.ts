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

export function roleLabel(role: string) {
  if (role === "admin") return "Administrador";
  if (role === "operator" || role === "technician") return "Operador";
  if (role === "client_readonly") return "Cliente solo lectura";
  return "Pendiente";
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
