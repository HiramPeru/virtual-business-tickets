"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({ fullName }: { fullName: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: formData.get("full_name") })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "No se pudo guardar");
      return;
    }

    setMessage("Perfil actualizado");
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="panel-body" style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="badge success">{message}</div> : null}
        <div className="field">
          <label>Nombre completo</label>
          <input className="input" defaultValue={fullName} name="full_name" />
        </div>
        <button className="button" type="submit">
          Guardar perfil
        </button>
      </div>
    </form>
  );
}
