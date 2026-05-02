"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PrincipalClientForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/principal-clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        ruc: formData.get("ruc")
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo crear el cliente principal");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="panel-body form-grid">
        {error ? <div className="alert span-2">{error}</div> : null}
        <div className="field">
          <label>Cliente principal</label>
          <input className="input" name="name" placeholder="WOW Perú" required />
        </div>
        <div className="field">
          <label>RUC</label>
          <input className="input" name="ruc" />
        </div>
        <div className="span-2">
          <button className="button" disabled={loading} type="submit">
            {loading ? "Creando..." : "Crear cliente principal"}
          </button>
        </div>
      </div>
    </form>
  );
}
