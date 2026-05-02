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
