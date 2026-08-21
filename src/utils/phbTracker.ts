import type { Router } from 'vue-router'

/**
 * Tracker first-party del ecosistema PowerHouse.
 *
 * Identifica al MISMO visitante a través de powerhousebiotech.com,
 * evaluacion.powerhousebiotech.com y juanromangarza.com:
 * - Cookie `_phb_vid` con domain=.powerhousebiotech.com cubre el dominio
 *   raíz y todos sus subdominios.
 * - Para saltos entre dominios distintos (juanromangarza.com ⇄ powerhouse),
 *   los enlaces salientes hacia sitios de la red se decoran con ?phb_vid=…
 *   y el sitio de destino lo adopta al aterrizar.
 *
 * La región/país/ciudad NO se envían desde aquí: las resuelve el backend
 * con los headers de geolocalización de Vercel.
 */

const NETWORK_HOSTS = ['powerhousebiotech.com', 'juanromangarza.com', 'drjuangarza.net']
const VID_PARAM = 'phb_vid'
const VID_COOKIE = '_phb_vid'
const VID_STORAGE = 'phb:vid'
const SID_STORAGE = 'phb:sid'
const SID_LAST_STORAGE = 'phb:sid:last'
const SESSION_TTL_MS = 30 * 60 * 1000
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400 // 400 días, tope de Chrome

const API_BASE =
  (import.meta.env.VITE_TRACKING_API as string) ||
  'https://phb-web-backapp.vercel.app/api'

const ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function isNetworkHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return NETWORK_HOSTS.some((root) => h === root || h.endsWith(`.${root}`))
}

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return decodeURIComponent(match?.[1] ?? '')
}

function writeCookie(name: string, value: string) {
  const host = location.hostname.toLowerCase()
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  // En powerhousebiotech.com la cookie se comparte con todos los subdominios.
  for (const root of NETWORK_HOSTS) {
    if (host === root || host.endsWith(`.${root}`)) {
      cookie += `; domain=.${root}`
      break
    }
  }
  if (location.protocol === 'https:') cookie += '; Secure'
  document.cookie = cookie
}

function safeStorage(get: () => string | null): string {
  try {
    return get() || ''
  } catch {
    return ''
  }
}

function resolveVisitorId(): string {
  // 1) Handoff cross-domain vía query param
  const url = new URL(location.href)
  const fromParam = url.searchParams.get(VID_PARAM) || ''
  if (fromParam && ID_PATTERN.test(fromParam)) {
    url.searchParams.delete(VID_PARAM)
    history.replaceState(history.state, '', url.toString())
    persistVisitorId(fromParam)
    return fromParam
  }
  // 2) Cookie (compartida entre subdominios) o localStorage
  const existing = readCookie(VID_COOKIE) || safeStorage(() => localStorage.getItem(VID_STORAGE))
  if (existing && ID_PATTERN.test(existing)) {
    persistVisitorId(existing)
    return existing
  }
  // 3) Nuevo visitante
  const fresh = randomId()
  persistVisitorId(fresh)
  return fresh
}

function persistVisitorId(id: string) {
  writeCookie(VID_COOKIE, id)
  try {
    localStorage.setItem(VID_STORAGE, id)
  } catch {
    /* modo privado sin storage */
  }
}

function resolveSessionId(): string {
  const now = Date.now()
  const last = Number(safeStorage(() => sessionStorage.getItem(SID_LAST_STORAGE))) || 0
  let sid = safeStorage(() => sessionStorage.getItem(SID_STORAGE))
  if (!sid || !ID_PATTERN.test(sid) || now - last > SESSION_TTL_MS) {
    sid = randomId()
  }
  try {
    sessionStorage.setItem(SID_STORAGE, sid)
    sessionStorage.setItem(SID_LAST_STORAGE, String(now))
  } catch {
    /* sin sessionStorage: la sesión dura lo que dure la variable */
  }
  return sid
}

let visitorId = ''
let sessionId = ''

function utmParams() {
  const params = new URLSearchParams(location.search)
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
  }
}

function send(eventName: string, path?: string) {
  if (!visitorId || !sessionId) return
  const payload = {
    visitorId,
    sessionId,
    site: location.hostname.toLowerCase(),
    path: path || location.pathname + location.search,
    title: document.title,
    eventName,
    referrer: document.referrer,
    ...utmParams(),
  }
  fetch(`${API_BASE}/tracking/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* el tracking jamás debe romper la página */
  })
  try {
    sessionStorage.setItem(SID_LAST_STORAGE, String(Date.now()))
  } catch {
    /* noop */
  }
}

/** Decora enlaces salientes hacia otros sitios de la red con el visitorId. */
function decorateOutboundLinks() {
  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]')
      if (!anchor || !visitorId) return
      try {
        const target = new URL((anchor as HTMLAnchorElement).href, location.href)
        const sameHost = target.hostname === location.hostname
        if (sameHost || !isNetworkHost(target.hostname)) return
        target.searchParams.set(VID_PARAM, visitorId)
        ;(anchor as HTMLAnchorElement).href = target.toString()
      } catch {
        /* href no parseable */
      }
    },
    true
  )
}

/** Evento manual (CTA, submit, etc.). */
export function trackEvent(eventName: string) {
  send(eventName)
}

/** Llamar una sola vez en main.ts después de crear el router. */
export function initPhbTracker(router?: Router) {
  if (typeof window === 'undefined') return
  visitorId = resolveVisitorId()
  sessionId = resolveSessionId()
  decorateOutboundLinks()

  if (router) {
    router.isReady().then(() => {
      send('pageview', router.currentRoute.value.fullPath)
      router.afterEach((to) => {
        // El título del documento puede cambiar después del hook; se difiere.
        setTimeout(() => send('pageview', to.fullPath), 0)
      })
    })
  } else {
    send('pageview')
  }
}
