import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Helpers de teléfono compartidos por el hero (FunnelView) y el cuestionario
 * (useAssessmentState). El default histórico era `+52` fijo: cualquier visitante
 * que no tocaba el selector quedaba marcado como México, así que un número de
 * EE. UU. como (812) 355-4762 viajaba a GHL como +52 8123554762 y WhatsApp lo
 * rechazaba. Estos helpers infieren el país del navegador y respetan cualquier
 * prefijo internacional que la persona escriba.
 */

// Región ISO → código telefónico, solo para los países del selector.
const REGION_TO_CODE: Record<string, string> = {
  MX: '+52',
  US: '+1',
  CA: '+1',
  AR: '+54',
  BR: '+55',
  CL: '+56',
  CO: '+57',
  PE: '+51',
  EC: '+593',
  VE: '+58',
  GT: '+502',
  ES: '+34',
}

// Zona horaria → región, respaldo cuando el locale no trae país (ej. "en" sin "-US").
const TZ_TO_REGION: Record<string, string> = {
  'America/Mexico_City': 'MX',
  'America/Monterrey': 'MX',
  'America/Tijuana': 'MX',
  'America/Cancun': 'MX',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Guayaquil': 'EC',
  'America/Bogota': 'CO',
  'America/Lima': 'PE',
  'America/Santiago': 'CL',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Sao_Paulo': 'BR',
  'America/Caracas': 'VE',
  'America/Guatemala': 'GT',
  'Europe/Madrid': 'ES',
}

/** Código de país por defecto según navegador (locale y luego zona horaria). */
export function detectDefaultCountryCode(fallback = '+52'): string {
  try {
    const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean)
    for (const l of langs) {
      const region = l.split('-')[1]?.toUpperCase()
      if (region && REGION_TO_CODE[region]) return REGION_TO_CODE[region]
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const region = TZ_TO_REGION[tz]
    if (region && REGION_TO_CODE[region]) return REGION_TO_CODE[region]
  } catch {
    /* SSR o navegador sin API: usa el fallback */
  }
  return fallback
}

/**
 * Si la persona escribe/pega un número internacional (`+…` o `00…`), devuelve el
 * país detectado y la parte nacional. Null si no hay prefijo internacional
 * reconocible entre los países soportados.
 */
export function extractInternational(
  raw: string,
  codes: string[],
): { code: string; national: string } | null {
  const trimmed = raw.trim().replace(/\s+/g, '')
  let candidate = ''
  if (trimmed.startsWith('+')) candidate = trimmed
  else if (trimmed.startsWith('00')) candidate = '+' + trimmed.slice(2)
  else return null

  const parsed = parsePhoneNumberFromString(candidate)
  if (!parsed) return null
  const code = '+' + parsed.countryCallingCode
  if (!codes.includes(code)) return null
  return { code, national: parsed.nationalNumber }
}

/** Une código + número nacional, dejándolo listo para WhatsApp/GHL. */
export function buildFullPhone(countryCode: string, phoneNum: string): string {
  let national = phoneNum.replace(/\D/g, '')
  // "0995…" (nacional con 0 troncal) → "995…"; nunca debe viajar a WhatsApp con el 0.
  national = national.replace(/^0+/, '')

  // México: WhatsApp exige el "1" de móvil tras el 52. El número nacional son 10
  // dígitos; sin el 1, +52 8123554762 se entrega a un fijo inexistente y rebota.
  if (countryCode === '+52' && national.length === 10) {
    national = '1' + national
  }

  return `${countryCode}${national}`
}
