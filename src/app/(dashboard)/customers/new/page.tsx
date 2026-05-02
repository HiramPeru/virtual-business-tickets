import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

async function createCustomer(formData: FormData) {
  "use server";
  const supabase = await getSupabaseServerClient();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const companyName = String(formData.get("company") || "").trim();
  let companyId = null;

  if (companyName) {
    const { data: company } = await supabase
      .from("companies")
      .upsert({ name: companyName, ruc: String(formData.get("ruc") || "") || null }, { onConflict: "name" })
      .select("id")
      .single();
    companyId = company?.id || null;
  }

  await supabase.from("contacts").upsert(
    {
      email,
      full_name: String(formData.get("full_name") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      company_id: companyId
    },
    { onConflict: "email" }
  );

  redirect("/customers");
}

export default function NewCustomerPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Nuevo cliente</h1>
          <p>Crea un contacto manual para asociarlo a tickets.</p>
        </div>
      </div>
      <form action={createCustomer} className="panel">
        <div className="panel-body form-grid">
          <div className="field">
            <label>Email</label>
            <input className="input" name="email" required type="email" />
          </div>
          <div className="field">
            <label>Nombre contacto</label>
            <input className="input" name="full_name" />
          </div>
          <div className="field">
            <label>Empresa</label>
            <input className="input" name="company" />
          </div>
          <div className="field">
            <label>RUC</label>
            <input className="input" name="ruc" />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input className="input" name="phone" />
          </div>
          <div className="span-2">
            <button className="button" type="submit">
              Crear cliente
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
