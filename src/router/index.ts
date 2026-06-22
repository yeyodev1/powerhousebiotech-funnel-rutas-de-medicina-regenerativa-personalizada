import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'
import VideoView from '../views/VideoView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import LegalNoticeView from '../views/LegalNoticeView.vue'
import BookingView from '../views/BookingView.vue'
import BookedView from '../views/BookedView.vue'
import NoSpaceView from '../views/NoSpaceView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    jsonLd?: object[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      alias: '/registro-vsl-tr',
      name: 'funnel',
      component: FunnelView,
      meta: {
        title: 'Quick Solutions | Arquitectos de la Cadena de Suministro',
        description:
          'Quick Solutions — Arquitectos de la cadena de suministro basados en ingeniería de datos. Eliminamos retenciones, sobrecostos e imprevistos con la metodología IFAC. Diagnóstico de auditoría logística gratuito.',
        canonical: 'https://quicksolutions.ec/',
        ogTitle: 'Quick Solutions | Arquitectos de la Cadena de Suministro',
        ogDescription:
          'Transformamos tu logística internacional con ingeniería de datos y previsibilidad absoluta. Sin retenciones, sin sobrecostos, sin sorpresas.',
        ogUrl: 'https://quicksolutions.ec/',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el video | Quick Solutions — Paso 1 de 2',
        description: 'Descubre cómo la metodología IFAC elimina retenciones, sobrecostos e imprevistos en tu cadena de suministro.',
        canonical: 'https://quicksolutions.ec/ver-video',
        ogTitle: 'Mira el video | Quick Solutions',
        ogDescription: 'Ve el video y agenda tu diagnóstico de auditoría logística gratuito con Jefferson Bazán.',
        ogUrl: 'https://quicksolutions.ec/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Diagnóstico | Quick Solutions — Paso 2 de 2',
        description: 'Selecciona el día y hora para tu Diagnóstico de Auditoría Logística gratuito con el equipo de Quick Solutions.',
        canonical: 'https://quicksolutions.ec/agendar',
        ogTitle: 'Agenda tu Diagnóstico | Quick Solutions',
        ogDescription: 'Elige tu horario y reserva tu Auditoría Logística gratuita.',
        ogUrl: 'https://quicksolutions.ec/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Diagnóstico Confirmado | Quick Solutions',
        description: 'Tu diagnóstico de auditoría logística con Quick Solutions está confirmado. Revisa tu correo.',
        canonical: 'https://quicksolutions.ec/cita-confirmada',
        ogTitle: 'Diagnóstico Confirmado | Quick Solutions',
        ogDescription: 'Tu auditoría logística está reservada. Te contactaremos pronto.',
        ogUrl: 'https://quicksolutions.ec/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Sin Cupos Disponibles | Quick Solutions',
        description: 'En este momento los cupos de auditoría logística de Quick Solutions están completos.',
        canonical: 'https://quicksolutions.ec/sin-espacio',
        ogTitle: 'Sin Cupos Disponibles | Quick Solutions',
        ogDescription: 'Los cupos de auditoría están completos. Te avisaremos cuando haya disponibilidad.',
        ogUrl: 'https://quicksolutions.ec/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Quick Solutions',
        description: 'Política de privacidad de Quick Solutions. Información sobre el tratamiento de datos personales.',
        canonical: 'https://quicksolutions.ec/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Quick Solutions',
        ogDescription: 'Política de privacidad de Quick Solutions.',
        ogUrl: 'https://quicksolutions.ec/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Quick Solutions',
        description: 'Aviso legal de Quick Solutions. Términos y condiciones de uso del sitio web.',
        canonical: 'https://quicksolutions.ec/aviso-legal',
        ogTitle: 'Aviso Legal | Quick Solutions',
        ogDescription: 'Aviso legal de Quick Solutions.',
        ogUrl: 'https://quicksolutions.ec/aviso-legal',
      } satisfies RouteMeta,
    },
  ],
})

// ── SEO dinámico por ruta ──────────────────────────────────────────────────────
const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

const setOgMeta = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.content = content
}

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'Quick Solutions'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

// ── Router Guards ──────────────────────────────────────────────────────────────
const BOOKED_TTL_MS = 3 * 24 * 60 * 60 * 1000
const DISQ_TTL_MS   = 48 * 60 * 60 * 1000

const readTimestamp = (key: string): number | null => {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

const isFresh = (key: string, ttl: number): boolean => {
  const ts = readTimestamp(key)
  if (ts === null) return false
  if (Date.now() - ts <= ttl) return true
  localStorage.removeItem(key)
  return false
}

const PUBLIC_ROUTES = ['privacy-policy', 'legal-notice']

router.beforeEach((to, from, next) => {
  const routeName = to.name as string
  if (PUBLIC_ROUTES.includes(routeName)) return next()

  const bookedFresh = isFresh('os_booked_at', BOOKED_TTL_MS)
  const disqFresh   = isFresh('os_disq_at',   DISQ_TTL_MS)

  if (routeName === 'booked') {
    if (!bookedFresh) return next({ name: 'funnel' })
    return next()
  }

  if (bookedFresh) {
    return next({ name: 'booked' })
  }

  if (disqFresh && ['booking', 'booked'].includes(routeName)) {
    return next({ name: 'no-space' })
  }

  if (routeName === 'no-space' && !disqFresh) {
    return next({ name: 'funnel' })
  }

  next()
})

export default router
