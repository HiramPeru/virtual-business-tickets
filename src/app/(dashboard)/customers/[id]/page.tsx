import { redirect, notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/app/lib/supabase-server";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: contactId } = await params;
  const supabase = await getSupabaseServerClient();

  type EditContactRow = {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    company_id: string | null;
    company: { id: string; name: string | null; ruc: string | null; principal_client_id: string | null } | null;
  };

  // Fetch the existing contact
  const { data, error: contactError } = await supabase
    .from("contacts")
    .select("id, email, full_name, phone, company_id, company:companies(id, name, ruc, principal_client_id)")
    .eq("id", contactId)
    .single();

  const contact = data as unknown as EditContactRow | null;

  if (contactError || !contact) {
    notFound();
  }

  // Fetch principal clients for the dropdown
  const { data: principalClients } = await supabase
    .from("principal_clients")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  async function updateCustomer(formData: FormData) {
    "use server";
    const supabase = await getSupabaseServerClient();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const companyName = String(formData.get("company") || "").trim();
    const principalClientId = String(formData.get("principal_client_id") || "") || null;
    
    // Default to the current company ID
    let finalCompanyId = contact?.company_id || null;

    if (companyName) {
      if (finalCompanyId && contact?.company?.name === companyName) {
        // Just update existing company fields
        await supabase
          .from("companies")
          .update({
            ruc: String(formData.get("ruc") || "") || null,
            principal_client_id: principalClientId
          })
          .eq("id", finalCompanyId);
      } else {
        // Upsert by name if changing to a new or different company
        const { data: company } = await supabase
          .from("companies")
          .upsert(
            {
              name: companyName,
              ruc: String(formData.get("ruc") || "") || null,
              principal_client_id: principalClientId
            },
            { onConflict: "name" }
          )
          .select("id")
          .single();
        finalCompanyId = company?.id || null;
      }
    } else {
      finalCompanyId = null; // Company removed
    }

    // Update the contact row
    await supabase.from("contacts").update({
      email,
      full_name: String(formData.get("full_name") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      company_id: finalCompanyId
    }).eq("id", contactId);

    redirect("/customers");
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Editar cliente</h1>
          <p>Modificar los datos de este contacto o empresa.</p>
        </div>
      </div>
      <form action={updateCustomer} className="panel">
        <div className="panel-body form-grid">
          <div className="field">
            <label>Email</label>
            <input className="input" name="email" required type="email" defaultValue={contact.email} />
          </div>
          <div className="field">
            <label>Nombre contacto</label>
            <input className="input" name="full_name" defaultValue={contact.full_name || ""} />
          </div>
          <div className="field">
            <label>Empresa</label>
            <input className="input" name="company" defaultValue={contact.company?.name || ""} />
          </div>
          <div className="field">
            <label>Cliente principal</label>
            <select className="select" name="principal_client_id" required defaultValue={contact.company?.principal_client_id || ""}>
              <option value="">Seleccionar</option>
              {(principalClients || []).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>RUC</label>
            <input className="input" name="ruc" defaultValue={contact.company?.ruc || ""} />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input className="input" name="phone" defaultValue={contact.phone || ""} />
          </div>
          <div className="span-2">
            <button className="button" type="submit">
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
