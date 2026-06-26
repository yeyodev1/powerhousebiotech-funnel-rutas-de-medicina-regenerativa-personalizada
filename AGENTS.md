# PowerHouse Biotech — Landing Page

**Brand**: PowerHouse Biotech (medicina regenerativa).
**Founder**: Juan Román Garza ([juanromangarza.com](https://juanromangarza.com/)).
**Sitio principal**: [powerhousebiotech.com](https://powerhousebiotech.com/).

## Stack

- **Vue 3** + **Vite 7** + **TypeScript** + **SCSS** + **vue-router**
- `@` → `./src` (vite alias, `tsconfig.app.json` paths)
- **pnpm** (monorepo-adjacent `pnpm-workspace.yaml` — solo `allowBuilds`, sin workspace packages)
- **FontAwesome 6.4** via CDN (`index.html`). Usar `<i class="fa-solid fa-...">` o `fa-regular`, NO emojis
- **SCSS**: `colorVariables.module.scss` auto-inyectado global via `vite.config.ts` `additionalData` (`@use "@/styles/colorVariables.module.scss" as *;`)
- **Outfit** (headings), **Plus Jakarta Sans** (body), **Space Grotesk** (CTAs), **Manrope** (UI)
- Pinia y GSAP en `package.json` — sin usar actualmente

## Comandos

```sh
pnpm dev           # dev server (localhost:38828430451a.ngrok-free.app allowed)
pnpm build         # type-check → build (via npm-run-all2: run-p type-check build-only)
pnpm type-check    # vue-tsc --build
pnpm format        # prettier --write src/
pnpm preview       # vite preview
```

Prettier: sin semicolons, single quotes, printWidth 100 (`.prettierrc.json`).
Node: `^20.19.0 || >=22.12.0`. Sin tests, sin CI.

## Rutas

| Path | View | Notes |
|---|---|---|
| `/` | `FunnelView` | Single-page landing con todas las secciones |
| `/formulario` | `FormView` | Placeholder (formulario pendiente de implementar) |
| `/politicas-privacidad` | `PrivacyPolicyView` | Pública |
| `/aviso-legal` | `LegalNoticeView` | Pública |

No hay routing guards, localStorage keys, ni lógica de booking/calificación.

## SEO

- Dinámico vía `router.afterEach` (title, meta description, og, twitter, canonical desde `RouteMeta`)
- Structured data (JSON-LD) en `index.html` (`MedicalBusiness` schema)

## Estructura (src/)

```
views/
  FunnelView.vue         ← Landing page principal (~1050 líneas, SCSS scoped)
  FormView.vue           ← Placeholder formulario (lazy-loaded)
  PrivacyPolicyView.vue  ← Política de privacidad
  LegalNoticeView.vue    ← Aviso legal
styles/
  colorVariables.module.scss  ← Variables PHB (auto-inyectadas globalmente)
  fonts.modules.scss          ← Google Fonts + mixins
  global.scss                 ← Reset global
  index.scss                  ← Re-export
assets/
  logos/logo.png  ← Logo PowerHouse Biotech (copiado de powerhousebiotech-web)
```

No hay stores, composables, utils ni componentes reutilizables (todo está en `FunnelView.vue`).

## SCSS variables (prefijo `$PHB-*`)

```scss
$PHB-BG          #283645  // fondo principal dark gray-blue
$PHB-NAVY-DARK   #171846  // dark navy
$PHB-BG-ALT      #1a1d52  // fondo alternativo
$PHB-SURFACE     #1e2260  // cards / modales
$PHB-SURFACE-2   #232770  // inner surfaces
$PHB-BLUE        #1278f3  // secondary / icons
$PHB-CYAN        #21bcfb  // CTAs, acentos
$PHB-ACCENT      #18e7f0  // light cyan
$PHB-TEXT-1      #FFFFFF  // headings
$PHB-TEXT-2      rgba(255,255,255,0.75)  // body
$PHB-TEXT-3      rgba(255,255,255,0.50)  // muted
$PHB-BORDER      rgba(33,188,251,0.12)  // borders
```

- Mesh gradient: `$PHB-MESH-GRADIENT` (4-layer radial for dark backgrounds)
- Usar `color.adjust()` en vez de `darken()`/`lighten()` (Dart Sass 3 compat)

## Landing page sections (FunnelView)

1. **Header** — nav fijo con logo `logo.png` + scroll suave a secciones + CTA "SOLICITAR REVISIÓN" → powerhousebiotech.com
2. **Hero** — mesh gradient bg, body copy con checklist, form card (nombre/email/tel → `/formulario`)
3. **Diferenciador PHB** — 5 tarjetas: Clasificar, Seleccionar, Evaluar, Preparar, Personalizar
4. **Fundador** — stats (+15 años, 100k+ casos, Global Speaker) + bio Juan Román Garza + link juanromangarza.com
5. **Ruta 5 Pasos** — fondo alt, timeline horizontal numerada
6. **CTA Final** — 3 call-outs + botón gradient cyan/blue + trust badges
7. **Footer** — logo + "By Juan Román Garza" + disclaimer legal + links a powerhousebiotech.com

## Notas

- El formulario del hero redirige a `/formulario` (placeholder). Webhook/backend pendiente.
- Los assets de `src/assets/` (stock/, team/, testimonios/) son del proyecto anterior — reemplazar cuando se tengan los de PHB.
- No hay Meta Pixel tracking activo más allá del `PageView` en `index.html`.
- Logo importado como módulo en FunnelView: `import logoSrc from '@/assets/logos/logo.png'` (Vite lo maneja como asset hash).
