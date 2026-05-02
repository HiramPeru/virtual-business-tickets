"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const { error: loginError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    router.push(searchParams.get("next") || "/tickets");
    router.refresh();
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-body" style={{ display: "grid", gap: 14 }}>
        {error ? <div className="alert">{error}</div> : null}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" id="email" name="email" required type="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input className="input" id="password" name="password" required type="password" />
        </div>
        <button className="button" disabled={loading} type="submit">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </form>
  );
}
