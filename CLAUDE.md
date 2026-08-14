# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Landing + cuestionario de **PowerHouse Biotech** (powerhousebiotech.com) — medicina regenerativa.
Fundador: Juan Román Garza. Lead magnet: evaluación de capacidad regenerativa (12 secciones de biomarcadores).
Copy en español (voseo/neutro LATAM). Mercado principal: MX/LATAM (default país `+52`).

## Comandos

```bash
pnpm dev         # vite dev server
pnpm build       # run-p type-check + build-only
pnpm build-only  # vite build sin type-check
pnpm type-check  # vue-tsc --build
pnpm preview     # servir dist/
pnpm format      # prettier --write src/
```

No hay linter ni test runner configurados. `pnpm build` es la única verificación real.

## Stack

Vue 3 (`<script setup>` + TS) · Vite 7 · vue-router 4 · Pinia (instalado, sin stores) · SCSS (`sass`) · GSAP y libphonenumber-js (instalados, sin uso actual) · pnpm.

- Alias `@` → `src/` (vite.config.ts + tsconfig.app.json).
- `colorVariables.module.scss` se **auto-inyecta** en todo SCSS vía `css.preprocessorOptions.scss.additionalData` → nunca hacer `@use` manual de ese archivo en un `.vue`.
- Prettier: sin punto y coma, comillas simples, `printWidth: 100`.
- FontAwesome 6 por CDN en `index.html` — usar `<i class="fa-solid fa-...">`, no emojis en UI.

## Arquitectura

**Ningún archivo debe pasar de 400 líneas.** El cuestionario ya cumple; `FunnelView.vue`
(~1680) y `PrivacyPolicyView.vue` (~415) siguen pendientes de dividir.

| Ruta | View | Notas |
|---|---|---|
| `/` | `FunnelView.vue` | Landing single-page + form de captura (eager, monolítica) |
| `/formulario` | `FormView.vue` | Orquestador del cuestionario (lazy) |
| `/politicas-privacidad` | `PrivacyPolicyView.vue` | lazy |
| `/aviso-legal` | `LegalNoticeView.vue` | lazy |

### El cuestionario

`FormView.vue` es solo el orquestador: cablea estado, navegación y los tres modos
(`intro` → `wizard` → `done`). Todo lo demás está repartido:

```
composables/
  useAssessmentState.ts   ← respuestas, contacto, derivados, persistencia phb_*
  useAssessmentSync.ts    ← payload GHL, webhooks, debounce, push al backend
data/assessment.ts        ← catálogo (12 secciones / 50 preguntas) + educación + niveles
services/assessment.ts    ← cliente HTTP del backend + sendBeacon
components/form/
  FormBrandHeader.vue     ← logo + aviso de guardado
  FormIntro.vue           ← promesa, escala y captura de contacto
  ContactFields.vue       ← nombre/email/teléfono + selector de país
  FormWizard.vue          ← arma el paso: educación + preguntas + lectura + nav
  WizardProgress.vue · WizardNav.vue · OverallProgress.vue
  SectionEducation.vue · QuestionCard.vue · SectionReadout.vue · MissingSections.vue
  FormDone.vue            ← pantalla del 100%
```

Los componentes son presentacionales: reciben props y emiten eventos, no tocan
localStorage ni la red. Esa frontera es lo que mantiene los archivos cortos.

`src/App.vue` monta el `<RouterView>` con la transición global entre rutas.
No hay guards de navegación.

### Transiciones

- **Entre rutas** (`App.vue`): solo `opacity`. `FunnelView` tiene header y menú en
  `position: fixed`, y un `transform` en la raíz de la vista crea un containing block
  que los despega de la ventana. No animes `transform` ahí.
- **Entre modos del formulario** (`FormView.vue`) y **entre secciones**
  (`FormWizard.vue`): sí usan `transform`, porque el header sticky queda fuera.
- `scrollBehavior` en `src/router/index.ts` retrasa el scroll `ROUTE_LEAVE_MS` (180 ms)
  para que coincida con el fin de la animación de salida. Si cambias una duración,
  cambia la otra.
- Todo respeta `prefers-reduced-motion`.

### SEO

`RouteMeta` está tipado por module augmentation en `src/router/index.ts` (`title`, `description`, `canonical`, `ogTitle`, `ogDescription`, `ogUrl`, todos requeridos, con `satisfies RouteMeta`). Un `router.afterEach` inyecta title/description/og/twitter/canonical en el DOM. **Toda ruta nueva debe declarar los 6 campos** o falla el type-check. JSON-LD (`MedicalBusiness`) y Meta Pixel (`1886197448722189`) viven en `index.html`. SPA fallback en `public/_redirects` (Netlify).

## Flujo del funnel

```
/ (FunnelView)
  form hero: nombre / email / teléfono
  → POST paralelo a VITE_WEBHOOK_FORM + VITE_WEBHOOK_FORM_AGENT  (paso: 'registro_inicial')
  → router.push('/formulario?nombre=&email=&telefono=')

/formulario (FormView)  — mode: 'intro' → 'wizard' → 'done'
  hydrateContactFromQuery() lee los query params
  cada sección abre con un bloque educativo (qué evalúas / por qué importa /
    biomarcadores / dato clave) y cierra con la lectura de carga del sistema
  cada respuesta dispara DOS syncs en paralelo, ambos silenciosos:
    · GHL      → VITE_WEBHOOK_FORM_STEP + AGENT (debounce 600 ms)
    · backend  → POST /api/assessments/sync   (debounce 900 ms, acumulativo)
  el botón final EXIGE 100%: si falta algo muestra las secciones pendientes
  submit al 100% → backend marca completado y dispara el webhook del CRM con
    `reporte_url`; luego los webhooks históricos de GHL; luego clearState()
```

### Backend del cuestionario

El funnel ya no es la única fuente de verdad de las respuestas: `app-powerhouse-backapp`
(`tools/app-powerhouse-backapp`, desplegado en `app-powerhouse-backapp.vercel.app`) guarda
cada respuesta en Mongo (colección `Assessment`, upsert por email) y genera un reporte
público en `/r/:publicId`. Ese link es la variable `reporte_url` que viaja al CRM para las
plantillas. Ver `tools/app-powerhouse-backapp/AGENTS.md` para el contrato completo.

`VITE_API_URL` apunta a ese backend (default `https://app-powerhouse-backapp.vercel.app/api`).
Si no responde, el wizard sigue funcionando: la verdad local vive en localStorage y se
reintenta en el siguiente sync.

### Webhooks (GHL)

Tres endpoints, todos por env (`.env`, no versionado):

| Var | Uso |
|---|---|
| `VITE_WEBHOOK_FORM` | contacto/lead principal |
| `VITE_WEBHOOK_FORM_STEP` | progreso incremental del cuestionario |
| `VITE_WEBHOOK_FORM_AGENT` | webhook del agente IA |
| `VITE_API_URL` | backend del cuestionario (Assessment + reporte público) |

Reglas del contrato de payload — romperlas rompe la automatización en GHL:

- `postWebhook()` es no-op si la URL es `undefined`; los envíos van en `Promise.allSettled` y los errores se tragan a propósito (el usuario nunca se bloquea por red).
- `buildCumulativePayload()` manda **siempre el mapa completo** de respuestas (preguntas sin contestar van como `''`), no un delta.
- Las claves de custom field se generan con `getQuestionGhlKey()` = `${q.id}_${cleanStringForGhl(q.text)}` (lowercase, `_` como separador, y los acentos se **borran**, no se normalizan: "después" → `despus`). **Cambiar el texto de una pregunta cambia la clave en GHL** y desconecta el campo existente. Esta función está duplicada a propósito en `src/data/assessment.ts` (funnel) y en `assessment.service.ts` (backend): si tocas una, tocas la otra.
- `pregunta_id` / `respuesta` nunca deben ir null ni 0: se sostienen con `lastAnsweredQuestionId` / `lastAnsweredValue`.
- El nombre se parte con `parseFullName()` → `nombre` (primer token) + `apellido` (resto). El teléfono se manda concatenado `countryCode + dígitos` vía `getFullPhone()`.

### LocalStorage (FormView)

`saveState()` / `loadState()` / `clearState()` manejan 6 claves, todas prefijo `phb_`:
`phb_answers`, `phb_contact`, `phb_active_step`, `phb_mode`, `phb_last_q`, `phb_last_val`.
Permiten reanudar el cuestionario tras refresh; se limpian solo al enviar el formulario final. Al agregar estado persistente hay que tocar las tres funciones.

## Estilos

- Paleta dark-mode `$PHB-*` en `src/styles/colorVariables.module.scss` (regla 60-30-10: `#171846` navy / `#1278f3` blue / `#21bcfb` cyan, acento `#18e7f0`). Hay aliases legacy (`$PHB-GOLD` → cyan, `$PHB-CREAM` → bg-alt) — usar los nombres semánticos nuevos.
- Tipografía en `src/styles/fonts.modules.scss` con mixins: `serif-heading` (Playfair Display), `heading-font` (Outfit), `body-font` (Plus Jakarta Sans), `accent-font` (Space Grotesk), `interface-font` (Manrope). Usar los mixins, no `font-family` suelto.
- `src/styles/global.scss` es lo único importado en `main.ts`.

## Notas

- `AGENTS.md` describe este mismo repo pero está desactualizado (dice que FormView es un placeholder). Si se actualiza uno, actualizar el otro.
- `vite.config.ts` tiene un host ngrok hardcodeado en `server.allowedHosts` — cambiarlo al túnel activo cuando se pruebe con webhooks reales.
- `dist/` está versionado en el árbol de trabajo; no editarlo a mano.
- Las reglas de context-mode se heredan de los CLAUDE.md de nivel superior — no duplicarlas aquí.
