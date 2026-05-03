"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PrincipalClientRow = {
  id: string;
  name: string;
  ruc: string | null;
  status: string;
};

export function PrincipalClientEditForm({ client }: { client: PrincipalClientRow }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(client.status);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/principal-clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        ruc: formData.get("ruc"),
        status: formData.get("status")
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo actualizar");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, minWidth: 320 }}>
      {error ? <div className="alert">{error}</div> : null}
      <input className="input" defaultValue={client.name} name="name" placeholder="Nombre (WOW Perú)" required />
      <input className="input" defaultValue={client.ruc || ""} name="ruc" placeholder="RUC" />
      <select className="select" name="status" onChange={(e) => setStatus(e.target.value)} value={status}>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
      <button className="button secondary" disabled={loading} type="submit">
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
