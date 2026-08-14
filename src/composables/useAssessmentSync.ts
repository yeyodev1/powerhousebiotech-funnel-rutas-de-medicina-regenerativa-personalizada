import { ref } from 'vue'
import { sectionsData, getQuestionGhlKey } from '@/data/assessment'
import {
  queueSync,
  flushSync,
  beaconSync,
  getStoredReportUrl,
  clearAssessmentRefs,
  type SyncInput,
} from '@/services/assessment'
import type { AssessmentState } from './useAssessmentState'

const WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM
const STEP_WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM_STEP
const AGENT_WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM_AGENT

const LEAD_NOTE = [
  '🧬 Cuestionario PHB completado',
  '🏁 Estado: finalizado',
  '✅ Acción: contacto actualizado con respuestas completas',
].join('\n')

async function postWebhook(url: string | undefined, payload: Record<string, unknown>) {
  if (!url) return
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

/**
 * Sincronización en segundo plano hacia GHL y hacia el backend del cuestionario.
 *
 * Todo falla en silencio a propósito: una caída de red no puede frenar a alguien
 * que está contestando 50 preguntas. Lo que no llegó se reintenta en el sync
 * siguiente, porque cada envío manda el estado acumulado completo.
 */
export function useAssessmentSync(state: AssessmentState) {
  /** Aviso visible de guardado en el header */
  const syncState = ref<'idle' | 'saving' | 'saved'>('idle')
  const reportUrl = ref('')

  let syncStateTimer: ReturnType<typeof setTimeout> | null = null
  let ghlDebounceTimer: ReturnType<typeof setTimeout> | null = null

  function flagSaving() {
    syncState.value = 'saving'
    if (syncStateTimer) clearTimeout(syncStateTimer)
    syncStateTimer = setTimeout(() => (syncState.value = 'saved'), 1100)
  }

  // ─── Payload GHL (contrato existente — no cambiar llaves) ────────────────────
  function buildProgressNote(scope: string, detail = '') {
    const parts = [
      '🧬 Progreso PHB',
      `📍 Evento: ${scope}`,
      `✅ Respondidas: ${state.answeredCount.value}/${state.totalQuestions.value}`,
    ]
    if (detail) parts.push('', '📝 Resumen de la sección', detail)
    return parts.join('\n')
  }

  function buildSectionDetail() {
    const parts = state.currentSection.value.questions
      .map((question) => {
        const answer = state.answers.value[question.id]
        if (answer === undefined) return null
        return `• Q${question.id}: ${answer}\n  ${question.text.slice(0, 70)}`
      })
      .filter(Boolean)

    if (parts.length === 0) return '• Sin respuestas registradas en esta sección'
    return ['📌 Respuestas de la sección', ...parts].join('\n')
  }

  function buildCumulativePayload(stepScope: string, noteDetail = '') {
    const contact = state.buildContact()
    const note = buildProgressNote(stepScope, noteDetail)

    // Mapa cumulativo completo: las no respondidas viajan como '' , no se omiten
    const cuestionarioMap: Record<string, number | string> = {}
    sectionsData.forEach((section) => {
      section.questions.forEach((q) => {
        const val = state.answers.value[q.id]
        cuestionarioMap[getQuestionGhlKey(q)] = val !== undefined ? val : ''
      })
    })

    // pregunta_id y respuesta nunca pueden ir null: GHL los usa como disparadores
    let preguntaId = state.lastAnsweredQuestionId.value || 1
    let respuesta = state.lastAnsweredValue.value ?? 0

    if (noteDetail) {
      const legacyMatch = noteDetail.match(/Q(\d+)=/)
      const actualMatch = noteDetail.match(/Q(\d+):\s*(\d+)/)
      if (legacyMatch) {
        preguntaId = Number(legacyMatch[1] || preguntaId)
        const parsed = Number(noteDetail.match(/=(\d+)/)?.[1] ?? NaN)
        if (!isNaN(parsed)) respuesta = parsed
      } else if (actualMatch) {
        preguntaId = Number(actualMatch[1] || preguntaId)
        const parsed = Number(actualMatch[2] ?? NaN)
        if (!isNaN(parsed)) respuesta = parsed
      }
    }

    return {
      nombre: contact.nombre,
      apellido: contact.apellido,
      email: contact.email,
      telefono: contact.telefono,
      note,
      nota: note,
      paso: stepScope,
      respondidas: state.answeredCount.value,
      total_preguntas: state.totalQuestions.value,
      porcentaje: state.overallProgress.value,
      seccion: state.currentSection.value?.title || '',
      seccion_id: state.currentSection.value?.id || 0,
      cuestionario: cuestionarioMap,
      cuestionario_raw: state.answers.value,
      pregunta_id: preguntaId,
      respuesta,
      reporte_url: reportUrl.value || '',
    }
  }

  // ─── Envíos ─────────────────────────────────────────────────────────────────
  function buildSyncInput(includeCatalog = false): SyncInput {
    return {
      contact: state.buildContact(),
      answers: state.answers.value,
      currentSectionId: state.currentSection.value?.id,
      currentSectionTitle: state.currentSection.value?.title,
      lastQuestionId: state.lastAnsweredQuestionId.value,
      lastValue: state.lastAnsweredValue.value,
      includeCatalog,
    }
  }

  async function fanOutGhl(payload: Record<string, unknown>, includeMain = false) {
    const targets = [postWebhook(STEP_WEBHOOK, payload), postWebhook(AGENT_WEBHOOK, payload)]
    if (includeMain) targets.push(postWebhook(WEBHOOK, { ...payload, paso: 'cuestionario_phb' }))
    try {
      await Promise.allSettled(targets)
    } catch {
      /* silencio intencional */
    }
  }

  function cancelGhlDebounce() {
    if (ghlDebounceTimer) {
      clearTimeout(ghlDebounceTimer)
      ghlDebounceTimer = null
    }
  }

  /** Se llama en cada respuesta: marca guardado y encola ambos destinos */
  function notifyAnswer() {
    flagSaving()
    cancelGhlDebounce()
    ghlDebounceTimer = setTimeout(() => {
      void fanOutGhl(buildCumulativePayload('llenando_cuestionario'))
    }, 600)
    queueSync(buildSyncInput())
  }

  /** Envío inmediato al cambiar de sección o al arrancar */
  async function sendStepUpdate(scope: string, withSectionDetail = false) {
    cancelGhlDebounce()
    await fanOutGhl(buildCumulativePayload(scope, withSectionDetail ? buildSectionDetail() : ''))
  }

  /** Empuja el estado al backend y guarda el link del reporte que devuelve */
  async function pushBackend(includeCatalog = false) {
    const result = await flushSync(buildSyncInput(includeCatalog))
    if (result?.reportUrl) reportUrl.value = result.reportUrl
    return result
  }

  /**
   * Cierre al 100%. El backend va primero: es quien dispara el webhook del CRM
   * y quien conoce `reporte_url`, que después viaja en el payload de GHL.
   */
  async function submitFinal() {
    cancelGhlDebounce()
    await pushBackend(true)
    await fanOutGhl(buildCumulativePayload('cuestionario_phb_finalizado', LEAD_NOTE), true)
    state.clearLocalState()
    clearAssessmentRefs()
  }

  /** Último intento al cerrar la pestaña */
  function beacon() {
    beaconSync(buildSyncInput())
  }

  function restoreReportUrl() {
    reportUrl.value = getStoredReportUrl()
  }

  function dispose() {
    if (syncStateTimer) clearTimeout(syncStateTimer)
    cancelGhlDebounce()
  }

  return {
    syncState,
    reportUrl,
    notifyAnswer,
    sendStepUpdate,
    pushBackend,
    submitFinal,
    beacon,
    restoreReportUrl,
    dispose,
  }
}
