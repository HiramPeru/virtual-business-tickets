"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PrincipalClient = { id: string; name: string };
type UserProfile = {
  id: string;
  full_name: string | null;
  role: string;
  principal_client_id: string | null;
};

export function UserRoleForm({
  profile,
  principalClients
}: {
  profile: UserProfile;
  principalClients: PrincipalClient[];
}) {
  const router = useRouter();
  const [role, setRole] = useState(profile.role);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/users/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: formData.get("full_name"),
        role: formData.get("role"),
        principal_client_id: formData.get("principal_client_id")
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

  async function handleChangePassword() {
    const newPassword = prompt("Ingresa la nueva contraseña para el usuario (mínimo 6 caracteres):");
    if (!newPassword) return;

    setError("");
    setLoading(true);
    const response = await fetch(`/api/users/${profile.id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo cambiar la contraseña");
      return;
    }

    alert("Contraseña actualizada exitosamente.");
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que quieres eliminar a este usuario de manera irreversible? (Si ya tiene tickets creados, la base de datos bloqueará el borrado).")) return;

    setError("");
    setLoading(true);
    const response = await fetch(`/api/users/${profile.id}`, {
      method: "DELETE"
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "No se pudo eliminar el usuario");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, minWidth: 320 }}>
      {error ? <div className="alert">{error}</div> : null}
      <input className="input" defaultValue={profile.full_name || ""} name="full_name" placeholder="Nombre" />
      <select className="select" name="role" onChange={(event) => setRole(event.target.value)} value={role}>
        <option value="admin">Administrador</option>
        <option value="operator">Operador</option>
        <option value="client_readonly">Cliente solo lectura</option>
        <option value="pending">Pendiente</option>
      </select>
      {role === "client_readonly" ? (
        <select className="select" defaultValue={profile.principal_client_id || ""} name="principal_client_id" required>
          <option value="">Seleccionar cliente principal</option>
          {principalClients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      ) : null}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="button secondary" disabled={loading} type="submit" style={{ flex: 1 }}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button className="button" disabled={loading} type="button" onClick={handleChangePassword} style={{ flex: 1 }}>
          Cambiar Clave
        </button>
        <button className="button danger" disabled={loading} type="button" onClick={handleDelete} style={{ flex: 1 }}>
          Eliminar
        </button>
      </div>
    </form>
  );
}
