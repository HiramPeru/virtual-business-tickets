"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CommentForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/tickets/${ticketId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: formData.get("content"),
        visibility: formData.get("customer_visible") ? "customer_visible" : "internal"
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo comentar");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="panel-body" style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Añadir comentario</h2>
        {error ? <div className="alert">{error}</div> : null}
        <textarea className="textarea" name="content" required />
        <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <input name="customer_visible" type="checkbox" />
          Visible para cliente futuro
        </label>
        <button className="button" disabled={loading} type="submit">
          {loading ? "Guardando..." : "Guardar comentario"}
        </button>
      </div>
    </form>
  );
}
