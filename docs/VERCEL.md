# Despliegue en Vercel

## Proyecto

- Produccion: https://virtual-business-tickets.vercel.app
- Proyecto Vercel: `virtual-business-tickets`
- Cuenta/scope usado por CLI: `co7150208-6207`

## Variables de Entorno

Configurar en Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbopvzwqcgnwtwwmptxr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

En los despliegues iniciales se pasaron con `--build-env` y `--env`. Para mantenimiento normal, conviene dejarlas guardadas en Vercel Project Settings.

## Despliegue Manual

```bash
npx vercel --prod --yes
```

Si las variables no estan guardadas en Vercel, usar:

```bash
npx vercel --prod --yes \
  --build-env NEXT_PUBLIC_SUPABASE_URL=... \
  --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --env NEXT_PUBLIC_SUPABASE_URL=... \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Verificacion

```bash
curl -I https://virtual-business-tickets.vercel.app
curl -I https://virtual-business-tickets.vercel.app/login
curl -I https://virtual-business-tickets.vercel.app/setup
```

Comportamiento esperado:

- `/` responde y redirige a `/tickets`.
- `/tickets` sin sesion redirige a `/login?next=%2Ftickets`.
- `/login` responde `200`.
- `/setup` responde `200` si no hay sesion.

## Archivos Importantes

- `.vercelignore`: evita subir `.env.local`, `.next`, `node_modules` y metadata local.
- `.env.local`: solo local, no versionado.
- `.vercel/`: metadata local de Vercel, no debe revisarse ni tocarse sin necesidad.

## Logs

```bash
npx vercel logs https://virtual-business-tickets.vercel.app
```

En Vercel CLI actual, `logs` puede quedar en streaming esperando nuevos eventos.
