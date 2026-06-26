import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FunnelView,
      meta: {
        title: 'PowerHouse Biotech | Medicina Regenerativa',
        description:
          'PowerHouse Biotech — Medicina regenerativa con enfoque humano. Evaluación de capacidad regenerativa, clasificación y selección de pacientes.',
        canonical: 'https://powerhousebiotech.com/',
        ogTitle: 'PowerHouse Biotech | Medicina Regenerativa',
        ogDescription:
          'Entendé tu biología. Activá tu poder de regeneración.',
        ogUrl: 'https://powerhousebiotech.com/',
      } satisfies RouteMeta,
    },
    {
      path: '/formulario',
      name: 'form',
      component: () => import('../views/FormView.vue'),
      meta: {
        title: 'Formulario | PowerHouse Biotech',
        description: 'Completa tu evaluación de capacidad regenerativa.',
        canonical: 'https://powerhousebiotech.com/formulario',
        ogTitle: 'Formulario | PowerHouse Biotech',
        ogDescription: 'Evaluación de capacidad regenerativa.',
        ogUrl: 'https://powerhousebiotech.com/formulario',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: {
        title: 'Política de Privacidad | PowerHouse Biotech',
        description:
          'Política de privacidad de PowerHouse Biotech.',
        canonical: 'https://powerhousebiotech.com/politicas-privacidad',
        ogTitle: 'Política de Privacidad | PowerHouse Biotech',
        ogDescription: 'Política de privacidad.',
        ogUrl: 'https://powerhousebiotech.com/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: () => import('../views/LegalNoticeView.vue'),
      meta: {
        title: 'Aviso Legal | PowerHouse Biotech',
        description: 'Aviso legal de PowerHouse Biotech.',
        canonical: 'https://powerhousebiotech.com/aviso-legal',
        ogTitle: 'Aviso Legal | PowerHouse Biotech',
        ogDescription: 'Aviso legal.',
        ogUrl: 'https://powerhousebiotech.com/aviso-legal',
      } satisfies RouteMeta,
    },
  ],
})

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'PowerHouse Biotech'
  const setMeta = (name: string, content: string) => {
    let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.name = name
      document.head.appendChild(el)
    }
    el.content = content
  }
  const setOg = (prop: string, content: string) => {
    let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('property', prop)
      document.head.appendChild(el)
    }
    el.content = content
  }
  const setCanonical = (href: string) => {
    let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!el) {
      el = document.createElement('link')
      el.rel = 'canonical'
      document.head.appendChild(el)
    }
    el.href = href
  }
  setMeta('description', meta.description ?? '')
  setOg('og:title', meta.ogTitle ?? meta.title ?? '')
  setOg('og:description', meta.ogDescription ?? meta.description ?? '')
  setOg('og:url', meta.ogUrl ?? '')
  setOg('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOg('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

export default router
