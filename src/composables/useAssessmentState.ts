import { ref, computed } from 'vue'
import {
  sectionsData,
  sectionEducation,
  MAX_PER_QUESTION,
  TOTAL_QUESTIONS,
  levelFromPercent,
  LEVEL_LABELS,
} from '@/data/assessment'
import type { AssessmentContact } from '@/services/assessment'

export type FormMode = 'intro' | 'wizard' | 'done'

export interface CountryOption {
  code: string
  flag: string
  label: string
}

/** Sección con preguntas pendientes, usada para guiar al paciente hasta el 100% */
export interface MissingSection {
  index: number
  id: number
  title: string
  pending: number
}

export const COUNTRIES: CountryOption[] = [
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+1', flag: '🇨🇦', label: 'CA' },
  { code: '+54', flag: '🇦🇷', label: 'AR' },
  { code: '+55', flag: '🇧🇷', label: 'BR' },
  { code: '+56', flag: '🇨🇱', label: 'CL' },
  { code: '+57', flag: '🇨🇴', label: 'CO' },
  { code: '+51', flag: '🇵🇪', label: 'PE' },
  { code: '+593', flag: '🇪🇨', label: 'EC' },
  { code: '+58', flag: '🇻🇪', label: 'VE' },
  { code: '+502', flag: '🇬🇹', label: 'GT' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
]

/**
 * Solo se usa para hidratar desde un `nombre` heredado que venga en la query
 * con nombre y apellido juntos. La captura pide los dos campos por separado:
 * partir por espacios se equivoca con nombres compuestos ("María José Pérez").
 */
export function parseFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return { nombre: parts[0] || '', apellido: parts.slice(1).join(' ') }
}

/**
 * Estado del cuestionario: respuestas, contacto, navegación y persistencia local.
 *
 * La verdad vive en localStorage con prefijo `phb_`: el backend puede estar caído
 * y el paciente igual retoma donde iba. `saveState` se llama en cada mutación.
 */
export function useAssessmentState() {
  const answers = ref<Record<number, number>>({})
  const lastAnsweredQuestionId = ref(1)
  const lastAnsweredValue = ref(0)

  const nombre = ref('')
  const apellido = ref('')
  const email = ref('')
  const phoneNum = ref('')
  const countryCode = ref('+52')
  const formErrors = ref<Record<string, string>>({})

  const mode = ref<FormMode>('intro')
  const activeStep = ref(0)
  const dir = ref<'fwd' | 'back'>('fwd')

  // ─── Derivados ──────────────────────────────────────────────────────────────
  const currentSection = computed(() => sectionsData[activeStep.value])
  const currentEducation = computed(() => sectionEducation[currentSection.value?.id ?? 0])
  const totalSteps = computed(() => sectionsData.length)
  const isFirstStep = computed(() => activeStep.value === 0)
  const isLastStep = computed(() => activeStep.value === totalSteps.value - 1)

  const totalQuestions = computed(() => TOTAL_QUESTIONS)
  const answeredCount = computed(() => Object.keys(answers.value).length)
  const overallProgress = computed(() =>
    totalQuestions.value > 0
      ? Math.round((answeredCount.value / totalQuestions.value) * 100)
      : 0,
  )
  const stepProgress = computed(() =>
    Math.round(((activeStep.value + 1) / totalSteps.value) * 100),
  )
  const isComplete = computed(() => answeredCount.value >= totalQuestions.value)

  /** Secciones con preguntas pendientes, para guiar al paciente hasta el 100% */
  const missingSections = computed(() =>
    sectionsData
      .map((section, index) => ({
        index,
        id: section.id,
        title: section.title,
        pending: section.questions.filter((q) => answers.value[q.id] === undefined).length,
      }))
      .filter((s) => s.pending > 0),
  )

  const sectionAnswered = computed(
    () =>
      currentSection.value?.questions.filter((q) => answers.value[q.id] !== undefined).length ?? 0,
  )
  const sectionComplete = computed(
    () => sectionAnswered.value === (currentSection.value?.questions.length ?? 0),
  )

  /** Carga sintomática de la sección actual (0-100%) */
  const sectionLoad = computed(() => {
    const questions = currentSection.value?.questions ?? []
    const max = questions.length * MAX_PER_QUESTION
    if (!max) return 0
    const score = questions.reduce((sum, q) => sum + (answers.value[q.id] ?? 0), 0)
    return Math.round((score / max) * 100)
  })

  /** Solo se muestra cuando la sección está completa: antes el dato engaña */
  const sectionLevel = computed(() => {
    if (!sectionComplete.value) return null
    const key = levelFromPercent(sectionLoad.value)
    return { key, label: LEVEL_LABELS[key] }
  })

  // ─── Contacto ───────────────────────────────────────────────────────────────
  function getFullPhone() {
    return `${countryCode.value}${phoneNum.value.replace(/\D/g, '')}`
  }

  function buildContact(): AssessmentContact {
    const first = nombre.value.trim()
    const last = apellido.value.trim()
    return {
      nombre: first,
      apellido: last,
      fullName: [first, last].filter(Boolean).join(' '),
      email: email.value.trim().toLowerCase(),
      telefono: getFullPhone(),
      countryCode: countryCode.value,
    }
  }

  function validatePersonal() {
    const e: Record<string, string> = {}
    if (nombre.value.trim().length < 2) e.nombre = 'Ingresa tu nombre'
    if (apellido.value.trim().length < 2) e.apellido = 'Ingresa tu apellido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) e.email = 'Email inválido'
    if (phoneNum.value.trim().length < 7) e.telefono = 'Teléfono inválido'
    formErrors.value = e
    return Object.keys(e).length === 0
  }

  // ─── Persistencia ───────────────────────────────────────────────────────────
  function saveState() {
    if (typeof window === 'undefined') return
    localStorage.setItem('phb_answers', JSON.stringify(answers.value))
    localStorage.setItem(
      'phb_contact',
      JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        phoneNum: phoneNum.value,
        countryCode: countryCode.value,
      }),
    )
    localStorage.setItem('phb_active_step', String(activeStep.value))
    localStorage.setItem('phb_mode', mode.value)
    localStorage.setItem('phb_last_q', String(lastAnsweredQuestionId.value))
    localStorage.setItem('phb_last_val', String(lastAnsweredValue.value))
  }

  function loadState() {
    if (typeof window === 'undefined') return
    try {
      const savedAnswers = localStorage.getItem('phb_answers')
      if (savedAnswers) answers.value = JSON.parse(savedAnswers)

      const savedContact = localStorage.getItem('phb_contact')
      if (savedContact) {
        const contact = JSON.parse(savedContact)
        if (contact.nombre) nombre.value = contact.nombre
        if (contact.apellido) apellido.value = contact.apellido
        if (contact.email) email.value = contact.email
        if (contact.phoneNum) phoneNum.value = contact.phoneNum
        if (contact.countryCode) countryCode.value = contact.countryCode
      }

      const savedStep = localStorage.getItem('phb_active_step')
      if (savedStep) activeStep.value = parseInt(savedStep, 10)

      const savedMode = localStorage.getItem('phb_mode')
      if (savedMode === 'intro' || savedMode === 'wizard' || savedMode === 'done') {
        mode.value = savedMode
      }

      const savedLastQ = localStorage.getItem('phb_last_q')
      if (savedLastQ) lastAnsweredQuestionId.value = parseInt(savedLastQ, 10)

      const savedLastVal = localStorage.getItem('phb_last_val')
      if (savedLastVal) lastAnsweredValue.value = parseInt(savedLastVal, 10)
    } catch (err) {
      console.error('Error loading state from localStorage:', err)
    }
  }

  function clearLocalState() {
    if (typeof window === 'undefined') return
    for (const key of [
      'phb_answers',
      'phb_contact',
      'phb_active_step',
      'phb_mode',
      'phb_last_q',
      'phb_last_val',
    ]) {
      localStorage.removeItem(key)
    }
  }

  /** Rellena el contacto con lo que venga por query string desde el hero del funnel */
  function hydrateFromQuery(query: Record<string, unknown>) {
    const str = (v: unknown) => (typeof v === 'string' ? v : '')
    const queryName = str(query.nombre)
    const queryLastName = str(query.apellido)
    const queryEmail = str(query.email)
    const queryPhone = str(query.telefono)

    if (queryName && !nombre.value) {
      if (queryLastName) {
        nombre.value = queryName
      } else {
        // Enlace antiguo: traia nombre y apellido juntos en un solo parametro
        const parsed = parseFullName(queryName)
        nombre.value = parsed.nombre
        if (!apellido.value) apellido.value = parsed.apellido
      }
    }
    if (queryLastName && !apellido.value) apellido.value = queryLastName
    if (queryEmail && !email.value) email.value = queryEmail

    if (queryPhone && !phoneNum.value) {
      const compact = queryPhone.replace(/\s+/g, '')
      const digits = compact.replace(/\D/g, '')
      // Prefijo de pais mas largo que coincida: sin esto, un +593 se leia como
      // "+5939" (regex greedy) y, al no existir, caia al default +52 (Mexico).
      const known = [...COUNTRIES]
        .map((c) => c.code)
        .sort((a, b) => b.length - a.length)
        .find((code) => digits.startsWith(code.slice(1)))
      if (known) {
        countryCode.value = known
        phoneNum.value = digits.slice(known.length - 1)
      } else {
        phoneNum.value = digits
      }
    }
  }

  return {
    answers,
    lastAnsweredQuestionId,
    lastAnsweredValue,
    nombre,
    apellido,
    email,
    phoneNum,
    countryCode,
    formErrors,
    mode,
    activeStep,
    dir,
    currentSection,
    currentEducation,
    totalSteps,
    isFirstStep,
    isLastStep,
    totalQuestions,
    answeredCount,
    overallProgress,
    stepProgress,
    isComplete,
    missingSections,
    sectionAnswered,
    sectionComplete,
    sectionLoad,
    sectionLevel,
    getFullPhone,
    buildContact,
    validatePersonal,
    saveState,
    loadState,
    clearLocalState,
    hydrateFromQuery,
  }
}

export type AssessmentState = ReturnType<typeof useAssessmentState>
