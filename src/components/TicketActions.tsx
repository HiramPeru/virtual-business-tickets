"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  priorityLabel,
  statusLabel,
  ticketCategories,
  ticketPlatforms,
  ticketPriorities,
  ticketStatuses
} from "@/app/lib/options";

type Profile = { id: string; full_name: string | null };

type Props = {
  ticket: {
    id: string;
    status: string;
    priority: string;
    assigned_to: string | null;
    category: string;
    subcategory: string | null;
    platform: string | null;
    subject: string;
    description: string | null;
  };
  profiles: Profile[];
};

export function TicketActions({ ticket, profiles }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "No se pudo guardar");
      return;
    }

    setMessage("Cambios guardados");
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={save}>
      <div className="panel-body" style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Acciones</h2>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="badge success">{message}</div> : null}
        <div className="field">
          <label>Estado</label>
          <select className="select" defaultValue={ticket.status} name="status">
            {ticketStatuses.map((item) => (
              <option key={item} value={item}>
                {statusLabel(item)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Prioridad</label>
          <select className="select" defaultValue={ticket.priority} name="priority">
            {ticketPriorities.map((item) => (
              <option key={item} value={item}>
                {priorityLabel(item)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Técnico asignado</label>
          <select className="select" defaultValue={ticket.assigned_to || ""} name="assigned_to">
            <option value="">Sin asignar</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name || profile.id}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Categoría</label>
          <select className="select" defaultValue={ticket.category} name="category">
            {ticketCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Plataforma</label>
          <select className="select" defaultValue={ticket.platform || "Ninguna"} name="platform">
            {ticketPlatforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Subcategoría</label>
          <input className="input" defaultValue={ticket.subcategory || ""} name="subcategory" />
        </div>
        <div className="field">
          <label>Asunto</label>
          <input className="input" defaultValue={ticket.subject} name="subject" />
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea className="textarea" defaultValue={ticket.description || ""} name="description" />
        </div>
        <button className="button" type="submit">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
