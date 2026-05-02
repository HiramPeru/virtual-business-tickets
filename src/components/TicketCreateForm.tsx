"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { ticketCategories, ticketPlatforms, ticketPriorities } from "@/app/lib/options";

type Contact = {
  id: string;
  email: string;
  full_name: string | null;
  company?: { name: string | null } | null;
};

export function TicketCreateForm() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (!search.trim()) {
        setContacts([]);
        return;
      }
      const response = await fetch(`/api/customers?search=${encodeURIComponent(search)}`, {
        signal: controller.signal
      });
      const data = await response.json();
      setContacts(data.customers || []);
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  async function createCustomer(formData: FormData) {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("customer_email"),
        full_name: formData.get("customer_name"),
        company: formData.get("company")
      })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "No se pudo crear el cliente");

    setSelected(data.customer);
    setShowNewCustomer(false);
    setSearch(data.customer.email);
    return data.customer as Contact;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const createdContact = !selected && formData.get("customer_email") ? await createCustomer(formData) : null;
      const contactId = selected?.id || createdContact?.id;
      if (!contactId) throw new Error("Selecciona o crea un cliente antes de registrar el ticket");

      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: contactId,
          category: formData.get("category"),
          subcategory: formData.get("subcategory"),
          platform: formData.get("platform"),
          subject: formData.get("subject"),
          description: formData.get("description"),
          priority: formData.get("priority")
        })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "No se pudo crear el ticket");

      router.push(`/tickets/${data.ticket.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-body form-grid">
        {error ? <div className="alert span-2">{error}</div> : null}
        <div className="field span-2">
          <label>Cliente</label>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ left: 11, position: "absolute", top: 12 }} />
              <input
                className="input"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelected(null);
                }}
                placeholder="Buscar por email o nombre"
                style={{ paddingLeft: 34 }}
                value={search}
              />
            </div>
            <button className="button secondary" onClick={() => setShowNewCustomer((v) => !v)} type="button">
              <Plus size={16} />
              Nuevo cliente
            </button>
          </div>
          {contacts.length > 0 && !selected ? (
            <div className="panel" style={{ marginTop: 8 }}>
              {contacts.map((contact) => (
                <button
                  className="button secondary"
                  key={contact.id}
                  onClick={() => {
                    setSelected(contact);
                    setSearch(contact.email);
                  }}
                  style={{ border: 0, borderRadius: 0, justifyContent: "flex-start", width: "100%" }}
                  type="button"
                >
                  {contact.full_name || contact.email}
                  <span className="muted">{contact.company?.name || contact.email}</span>
                </button>
              ))}
            </div>
          ) : null}
          {selected ? (
            <div className="muted" style={{ marginTop: 8 }}>
              Seleccionado: <strong>{selected.full_name || selected.email}</strong>
            </div>
          ) : null}
        </div>

        {showNewCustomer ? (
          <>
            <div className="field">
              <label>Email nuevo cliente</label>
              <input className="input" name="customer_email" type="email" />
            </div>
            <div className="field">
              <label>Nombre contacto</label>
              <input className="input" name="customer_name" />
            </div>
            <div className="field span-2">
              <label>Empresa</label>
              <input className="input" name="company" />
            </div>
          </>
        ) : null}

        <div className="field">
          <label>Categoría</label>
          <select className="select" name="category" required>
            {ticketCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Plataforma</label>
          <select className="select" name="platform" required>
            {ticketPlatforms.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Subcategoría</label>
          <input className="input" name="subcategory" placeholder="Licencia, correo, backup, tenant..." />
        </div>
        <div className="field">
          <label>Prioridad</label>
          <select className="select" defaultValue="Medium" name="priority" required>
            {ticketPriorities.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="field span-2">
          <label>Asunto</label>
          <input className="input" name="subject" required />
        </div>
        <div className="field span-2">
          <label>Descripción</label>
          <textarea className="textarea" name="description" placeholder="Pega aquí el correo, pedido o contexto recibido." />
        </div>
        <div className="span-2">
          <button className="button" disabled={loading} type="submit">
            {loading ? "Creando..." : "Crear ticket"}
          </button>
        </div>
      </div>
    </form>
  );
}
