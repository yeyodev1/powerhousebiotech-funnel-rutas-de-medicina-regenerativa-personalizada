<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAssessmentState } from '@/composables/useAssessmentState'
import { useAssessmentSync } from '@/composables/useAssessmentSync'
import FormBrandHeader from '@/components/form/FormBrandHeader.vue'
import FormIntro from '@/components/form/FormIntro.vue'
import FormWizard from '@/components/form/FormWizard.vue'
import FormDone from '@/components/form/FormDone.vue'

const route = useRoute()
const state = useAssessmentState()
const sync = useAssessmentSync(state)

// Los refs se desestructuran para que el template los auto-desenvuelva;
// `state` sigue disponible para pasarlo entero a los composables.
const {
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
  sectionLevel,
  sectionLoad,
} = state

const { syncState, reportUrl } = sync

const submitLoading = ref(false)
const showMissing = ref(false)

/**
 * Si el hero ya capturó el contacto no se vuelve a pedir: solo se confirma.
 * `editingContact` deja al paciente corregirlo si algo llegó mal.
 */
const editingContact = ref(false)
const hasContact = computed(
  () =>
    nombre.value.trim().length >= 2 &&
    apellido.value.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
    phoneNum.value.trim().length >= 7,
)
const contactPrefilled = computed(() => hasContact.value && !editingContact.value)

function scrollTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearError(field: string) {
  formErrors.value[field] = ''
}

function setAnswer(questionId: number, value: number) {
  answers.value[questionId] = value
  lastAnsweredQuestionId.value = questionId
  lastAnsweredValue.value = value
  state.saveState()
  sync.notifyAnswer()
}

function startWizard() {
  if (!state.validatePersonal()) return
  mode.value = 'wizard'
  activeStep.value = 0
  dir.value = 'fwd'
  state.saveState()
  void sync.sendStepUpdate('comenzo_cuestionario')
  // Primer push con catálogo: crea el cuestionario y reserva el link del reporte
  void sync.pushBackend(true)
  scrollTop()
}

async function nextStep() {
  dir.value = 'fwd'

  if (isLastStep.value) {
    await handleSubmit()
    return
  }

  await sync.sendStepUpdate('seccion_completada', true)
  void sync.pushBackend()
  activeStep.value++
  state.saveState()
  scrollTop()
}

function prevStep() {
  dir.value = 'back'

  if (isFirstStep.value) {
    mode.value = 'intro'
    state.saveState()
    return
  }

  activeStep.value--
  state.saveState()
  void sync.sendStepUpdate('retrocedio_seccion')
  scrollTop()
}

function goToSection(index: number) {
  dir.value = index > activeStep.value ? 'fwd' : 'back'
  activeStep.value = index
  showMissing.value = false
  state.saveState()
  scrollTop()
}

async function handleSubmit() {
  // Los beneficios están atados al 100%: si falta algo se señala, no se envía
  if (!isComplete.value) {
    showMissing.value = true
    return
  }

  submitLoading.value = true
  await sync.submitFinal()
  submitLoading.value = false

  mode.value = 'done'
  showMissing.value = false
  scrollTop()
}

function onBeforeUnload() {
  if (mode.value === 'wizard' && answeredCount.value > 0) sync.beacon()
}

onMounted(() => {
  state.loadState()
  state.hydrateFromQuery(route.query)
  sync.restoreReportUrl()
  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
  sync.dispose()
})
</script>

<template>
  <div class="fp">
    <FormBrandHeader :sync-state="syncState" :show-sync="mode === 'wizard'" />

    <!-- :duration: fallback por temporizador si se pierde el transitionend -->
    <Transition name="fp-mode" mode="out-in" :duration="{ enter: 280, leave: 180 }">
      <main v-if="mode === 'done'" key="done" class="fp__main fp__main--done">
        <FormDone :total-questions="totalQuestions" :report-url="reportUrl" />
      </main>

      <main v-else-if="mode === 'intro'" key="intro" class="fp__main">
        <FormIntro
          v-model:nombre="nombre"
          v-model:apellido="apellido"
          v-model:email="email"
          v-model:phone-num="phoneNum"
          v-model:country-code="countryCode"
          :errors="formErrors"
          :answered-count="answeredCount"
          :total-questions="totalQuestions"
          :prefilled="contactPrefilled"
          @start="startWizard"
          @clear-error="clearError"
          @edit-contact="editingContact = true"
        />
      </main>

      <main v-else key="wizard" class="fp__main">
        <FormWizard
          :section="currentSection"
          :education="currentEducation"
          :active-step="activeStep"
          :total-steps="totalSteps"
          :step-progress="stepProgress"
          :dir="dir"
          :answers="answers"
          :section-answered="sectionAnswered"
          :section-level="sectionLevel"
          :section-load="sectionLoad"
          :answered-count="answeredCount"
          :total-questions="totalQuestions"
          :overall-progress="overallProgress"
          :is-complete="isComplete"
          :is-last-step="isLastStep"
          :submit-loading="submitLoading"
          :show-missing="showMissing"
          :missing-sections="missingSections"
          @answer="setAnswer"
          @prev="prevStep"
          @next="nextStep"
          @go-to="goToSection"
        />
      </main>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp {
  min-height: 100vh;
  background: $PHB-BG;
  background-image: $PHB-MESH-GRADIENT;
  background-attachment: fixed;
  color: $PHB-TEXT-2;
  font-family: fonts.$font-secondary;
  overflow-x: hidden;
}

.fp__main {
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4.5rem;

  &--done {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 60px);
  }
}

// ─── Cambio de etapa: intro → wizard → done ──────────────────────────────────
// Aquí sí es seguro animar `transform`: el header sticky vive fuera de <main>.
.fp-mode-enter-active {
  transition:
    opacity 280ms cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.fp-mode-leave-active {
  transition:
    opacity 180ms ease-in,
    transform 180ms ease-in;
}

.fp-mode-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.fp-mode-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .fp-mode-enter-active,
  .fp-mode-leave-active {
    transition-duration: 1ms;
  }

  .fp-mode-enter-from,
  .fp-mode-leave-to {
    transform: none;
  }
}

@media (max-width: 640px) {
  .fp__main {
    padding: 1.4rem 0.85rem 3.5rem;
  }
}
</style>
