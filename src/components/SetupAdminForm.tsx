"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-browser";

export function SetupAdminForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const supabase = getSupabaseBrowserClient();

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (!data.session) {
      setMessage("Usuario creado. Revisa el correo para confirmar la cuenta y luego ingresa desde Login.");
      return;
    }

    window.location.assign("/tickets");
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-body" style={{ display: "grid", gap: 14 }}>
        {error ? <div className="alert">{error}</div> : null}
        {message ? <div className="badge success">{message}</div> : null}
        <div className="field">
          <label htmlFor="full_name">Nombre</label>
          <input className="input" id="full_name" name="full_name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email admin</label>
          <input className="input" id="email" name="email" required type="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input className="input" id="password" minLength={8} name="password" required type="password" />
        </div>
        <button className="button" disabled={loading} type="submit">
          {loading ? "Creando..." : "Crear primer admin"}
        </button>
      </div>
    </form>
  );
}
