import { TicketCreateForm } from "@/components/TicketCreateForm";

export default function NewTicketPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Nuevo ticket</h1>
          <p>Registra una solicitud manual recibida por correo, llamada o WhatsApp.</p>
        </div>
      </div>
      <TicketCreateForm />
    </>
  );
}
