# Quick Solutions — VSL Funnel

**Brand**: Quick Solutions (arquitectos de la cadena de suministro — IFAC methodology).  
**Vocero**: Jefferson Bazán.

## Stack

- Vue 3 + Vite 7 + TypeScript + SCSS + Pinia + vue-router
- `@` → `./src` (vite alias)
- pnpm
- FontAwesome 6 via CDN (`index.html`). Usar `<i class="fa-solid fa-...">`, NO emojis
- SCSS: `colorVariables.module.scss` auto-inyectado global via `vite.config.ts` `additionalData`
- Wistia player (`wistia-player` custom element, media-id: `bivr0yu5qp`)
- GSAP activo en `ToolsView.vue` (ScrollTrigger registrado)

## Comandos

```sh
pnpm dev           # dev server (localhost)
pnpm build         # type-check → build (via npm-run-all2)
pnpm type-check    # vue-tsc --build
pnpm format        # prettier --write src/
pnpm preview       # vite preview
```

Prettier: sin semicolons, single quotes, printWidth 100.

## Rutas & flujo del funnel

```
/           → FunnelView   (landing + RegistrationModal)
/ver-video  → VideoView    (VSL + timer 2min + contact guard overlay)
/agendar    → BookingView  (GHL calendar iframe)
/cita-confirmada → BookedView
/sin-espacio → NoSpaceView (cooldown 48h)
/politicas-privacidad, /aviso-legal (públicas, sin guard)
```

Route alias: `/registro-vsl-tr` → `/`.

## Routing guards (centralizados en `src/router/index.ts:179`)

- **`os_booked_at`**: 3-day TTL. Si fresco → redirige todo a `/cita-confirmada`.
- **`os_disq_at`**: 48h TTL. Si fresco → bloquea `/agendar` y `/cita-confirmada` → `/sin-espacio`.
- `/sin-espacio` sin `os_disq_at` fresco → redirige a `/`.
- `/cita-confirmada` sin `os_booked_at` fresco → redirige a `/`.
- Rutas legales no tienen guard.

## LocalStorage

| Key | Value | Escrito por |
|---|---|---|
| `os_contact` | `{ nombre, apellido, negocio, email, telefono, timestamp }` | `RegistrationModal` + `VideoView` capture |
| `os_disq_at` | timestamp ms | `CalendarModal` al no calificar (presupuesto logístico < $3,000/mes) |
| `os_booked_at` | timestamp ms | `BookingView` al confirmar cita (`postMessage`) |

## Calificación (CalendarModal)

Descalifica si `presupuesto === 'menos3000'` (< $3,000 USD/mes en logística internacional). Guarda `os_disq_at` (solo en producción). Redirige a `/sin-espacio`.

## GHL

- Calendar booking: `https://api.leadconnectorhq.com/widget/booking/bDoTPmyIA6ng4o5iqD9i` + `?firstName=...&email=...&phone=` desde `os_contact`
- Tracking webhook: configurable via `VITE_WEBHOOK_TRACKING` env var
- Evento confirmación: `postMessage(['msgsndr-booking-complete', {...}])`
- Altura dinámica: `postMessage({ type: 'booking-app', height: N })`
- Script embed: `https://api.leadconnectorhq.com/js/form_embed.js`

## Meta Pixel

ID: `1886197448722189`. Eventos trackeados: `PageView`, `ViewContent`, `CompleteRegistration`, `Lead`.

## Reglas de estilo

- Sin Header/Footer de navegación global (existen en disco, no importados)
- `BookedView`: padding centralizado en `.booked__main`
- Countdown de urgencia en Funnel: bloques de 6h
- Social proof toast (FOMO) en Funnel: rotación con 3s delay inicial, 5s visibles, 2s gap

## Meta

- `node`: `^20.19.0 || >=22.12.0`
- Sin tests, sin CI config
- Dev server permite host: `38828430451a.ngrok-free.app`
- SEO dinámico via router `afterEach`
- Session storage: `alu_page_entry` (FunnelView), `os_complete_fired` (BookedView)
