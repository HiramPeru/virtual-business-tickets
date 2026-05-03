-- Habilitar RLS en la tabla para resolver la advertencia de PostgREST
ALTER TABLE ticket_daily_counters ENABLE ROW LEVEL SECURITY;

-- No añadimos ninguna política a ticket_daily_counters. 
-- Esto significa que nadie puede hacer SELECT, INSERT o UPDATE directamente a través de la API REST.

-- Para que el contador siga funcionando cuando los usuarios crean tickets, 
-- cambiamos la función generadora a SECURITY DEFINER (bypassea RLS ejecutándose como superusuario).
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today TEXT := to_char(CURRENT_DATE, 'YYYYMMDD');
  new_seq INT;
BEGIN
  INSERT INTO ticket_daily_counters(day, seq)
  VALUES (today, 1)
  ON CONFLICT (day)
  DO UPDATE SET seq = ticket_daily_counters.seq + 1
  RETURNING seq INTO new_seq;

  RETURN 'T-' || today || '-' || LPAD(new_seq::TEXT, 4, '0');
END;
$$;
