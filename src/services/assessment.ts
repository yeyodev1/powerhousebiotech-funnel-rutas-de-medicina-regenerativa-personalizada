import { buildCatalogPayload } from '@/data/assessment'

/**
 * Cliente del backend de cuestionarios (app-powerhouse-backapp).
 *
 * Todo corre en segundo plano y falla en silencio: si el backend no responde,
 * el paciente sigue contestando sin enterarse. La verdad local vive en
 * localStorage y se vuelve a empujar en el siguiente sync.
 */

const API_URL = (
  (import.meta.env.VITE_API_URL as string) || 'https://app-powerhouse-backapp.vercel.app/api'
).replace(/\/+$/, '')

const PUBLIC_ID_KEY = 'phb_public_id'
const REPORT_URL_KEY = 'phb_report_url'
const CATALOG_SENT_KEY = 'phb_catalog_sent'

export interface AssessmentContact {
  nombre: string
  apellido: string
  fullName: string
  email: string
  telefono: string
  countryCode: string
}

export interface SyncResult {
  publicId: string
  reportUrl: string
  answeredCount: number
  totalQuestions: number
  percent: number
  status: 'in_progress' | 'completed'
  completed: boolean
  webhookFired: boolean
}

export interface SyncInput {
  contact: AssessmentContact
  answers: Record<number, number>
  currentSectionId?: number
  currentSectionTitle?: string
  lastQuestionId?: number
  lastValue?: number
  /** fuerza el envío del catálogo completo (primer sync y cierre) */
  includeCatalog?: boolean
}

export function getStoredPublicId(): string {
  try {
    return localStorage.getItem(PUBLIC_ID_KEY) || ''
  } catch {
    return ''
  }
}

export function getStoredReportUrl(): string {
  try {
    return localStorage.getItem(REPORT_URL_KEY) || ''
  } catch {
    return ''
  }
}

/**
 * Limpia la referencia al cuestionario en curso. `phb_report_url` se conserva a
 * propósito: es el link que el paciente sigue viendo en la pantalla final.
 */
export function clearAssessmentRefs() {
  try {
    localStorage.removeItem(PUBLIC_ID_KEY)
    localStorage.removeItem(CATALOG_SENT_KEY)
  } catch {
    /* noop */
  }
}

function catalogAlreadySent(): boolean {
  try {
    return localStorage.getItem(CATALOG_SENT_KEY) === '1'
  } catch {
    return false
  }
}

function buildBody(input: SyncInput) {
  const publicId = getStoredPublicId()
  // El catálogo pesa ~40 KB: se manda en el primer sync y al cerrar, no en cada respuesta.
  const withCatalog = input.includeCatalog || !catalogAlreadySent()

  return {
    publicId: publicId || undefined,
    nombre: input.contact.nombre,
    apellido: input.contact.apellido,
    fullName: input.contact.fullName,
    email: input.contact.email,
    telefono: input.contact.telefono,
    countryCode: input.contact.countryCode,
    answers: input.answers,
    catalog: withCatalog ? buildCatalogPayload() : undefined,
    currentSectionId: input.currentSectionId,
    currentSectionTitle: input.currentSectionTitle,
    lastQuestionId: input.lastQuestionId,
    lastValue: input.lastValue,
    source: 'funnel_rutas_medicina_regenerativa',
  }
}

/** Sync inmediato. Nunca lanza. */
export async function syncAssessment(input: SyncInput): Promise<SyncResult | null> {
  if (!input.contact.email) return null

  try {
    const response = await fetch(`${API_URL}/assessments/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildBody(input)),
    })

    if (!response.ok) return null

    const result = (await response.json()) as SyncResult

    try {
      if (result.publicId) localStorage.setItem(PUBLIC_ID_KEY, result.publicId)
      if (result.reportUrl) localStorage.setItem(REPORT_URL_KEY, result.reportUrl)
      localStorage.setItem(CATALOG_SENT_KEY, '1')
    } catch {
      /* noop */
    }

    return result
  } catch {
    return null
  }
}

// --- Debounce en segundo plano -------------------------------------------------

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let pending: SyncInput | null = null

/** Encola un sync: se dispara tras `delay` ms de inactividad. */
export function queueSync(input: SyncInput, delay = 900) {
  pending = input
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    const payload = pending
    pending = null
    if (payload) void syncAssessment(payload)
  }, delay)
}

/** Cancela lo encolado y sincroniza ya. Devuelve el resultado del backend. */
export async function flushSync(input: SyncInput): Promise<SyncResult | null> {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  pending = null
  return syncAssessment(input)
}

/** Último intento al cerrar la pestaña; usa keepalive para que sobreviva al unload. */
export function beaconSync(input: SyncInput) {
  if (!input.contact.email) return
  try {
    const body = JSON.stringify(buildBody(input))
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API_URL}/assessments/sync`,
        new Blob([body], { type: 'application/json' }),
      )
      return
    }
    void fetch(`${API_URL}/assessments/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    /* noop */
  }
}
