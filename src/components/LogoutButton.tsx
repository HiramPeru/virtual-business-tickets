"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/app/lib/supabase-browser";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="button secondary" onClick={logout} type="button">
      <LogOut size={16} />
      Salir
    </button>
  );
}
