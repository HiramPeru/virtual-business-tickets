"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PrincipalClient = { id: string; name: string };

export function UserCreateForm({ principalClients }: { principalClients: PrincipalClient[] }) {
  const router = useRouter();
  const [role, setRole] = useState("operator");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        principal_client_id: formData.get("principal_client_id")
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo crear el usuario");
      return;
    }

    setMessage("Usuario creado");
    event.currentTarget.reset();
    setRole("operator");
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="panel-body form-grid">
        {error ? <div className="alert span-2">{error}</div> : null}
        {message ? <div className="badge success span-2">{message}</div> : null}
        <div className="field">
          <label>Nombre</label>
          <input className="input" name="full_name" required />
        </div>
        <div className="field">
          <label>Email</label>
          <input className="input" name="email" required type="email" />
        </div>
        <div className="field">
          <label>Rol</label>
          <select className="select" name="role" onChange={(event) => setRole(event.target.value)} value={role}>
            <option value="operator">Operador</option>
            <option value="client_readonly">Cliente solo lectura</option>
            <option value="admin">Administrador</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>
        <div className="field">
          <label>Contraseña temporal</label>
          <input className="input" minLength={8} name="password" required type="password" />
        </div>
        {role === "client_readonly" ? (
          <div className="field span-2">
            <label>Cliente principal visible</label>
            <select className="select" name="principal_client_id" required>
              <option value="">Seleccionar</option>
              {principalClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="span-2">
          <button className="button" disabled={loading} type="submit">
            {loading ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </form>
  );
}
