<script setup lang="ts">
import type { SectionData, SectionEducation, LevelKey } from '@/data/assessment'
import WizardProgress from './WizardProgress.vue'
import SectionEducationBlock from './SectionEducation.vue'
import QuestionCard from './QuestionCard.vue'
import SectionReadout from './SectionReadout.vue'
import type { MissingSection } from '@/composables/useAssessmentState'
import MissingSections from './MissingSections.vue'
import WizardNav from './WizardNav.vue'
import OverallProgress from './OverallProgress.vue'

defineProps<{
  section: SectionData
  education?: SectionEducation
  activeStep: number
  totalSteps: number
  stepProgress: number
  dir: 'fwd' | 'back'
  answers: Record<number, number>
  sectionAnswered: number
  sectionLevel: { key: LevelKey; label: string } | null
  sectionLoad: number
  answeredCount: number
  totalQuestions: number
  overallProgress: number
  isComplete: boolean
  isLastStep: boolean
  submitLoading: boolean
  showMissing: boolean
  missingSections: MissingSection[]
}>()

const emit = defineEmits<{
  answer: [questionId: number, value: number]
  prev: []
  next: []
  goTo: [index: number]
}>()
</script>

<template>
  <WizardProgress
    :active-step="activeStep"
    :total-steps="totalSteps"
    :step-progress="stepProgress"
    :section-title="section.title"
    :answered-count="answeredCount"
    :total-questions="totalQuestions"
    :overall-progress="overallProgress"
  />

  <Transition :name="dir" mode="out-in">
    <div class="fp__card fp__card--step" :key="activeStep">
      <div class="fp__section-header">
        <span class="fp__section-num">{{ section.id }}</span>
        <div>
          <h2 class="fp__section-title">{{ section.title }}</h2>
          <p v-if="education" class="fp__section-headline">{{ education.headline }}</p>
        </div>
      </div>

      <SectionEducationBlock v-if="education" :education="education" />

      <div class="fp__questions-head">
        <span>{{ sectionAnswered }}/{{ section.questions.length }} en esta sección</span>
        <span>0 = nunca · 3 = persistente</span>
      </div>

      <QuestionCard
        v-for="q in section.questions"
        :key="q.id"
        :question="q"
        :value="answers[q.id]"
        @select="emit('answer', q.id, $event)"
      />

      <SectionReadout
        v-if="sectionLevel"
        :level="sectionLevel"
        :load="sectionLoad"
        :section-title="section.title"
      />

      <MissingSections
        v-if="showMissing && missingSections.length"
        :sections="missingSections"
        @go-to="emit('goTo', $event)"
      />

      <WizardNav
        :is-last-step="isLastStep"
        :submit-loading="submitLoading"
        @prev="emit('prev')"
        @next="emit('next')"
      />
    </div>
  </Transition>

  <OverallProgress
    :overall-progress="overallProgress"
    :is-complete="isComplete"
    :remaining="totalQuestions - answeredCount"
  />
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp__card {
  background: rgba($PHB-SURFACE, 0.62);
  border: 1px solid $PHB-BORDER;
  border-radius: 20px;
  box-shadow: $PHB-SHADOW-MD;
  backdrop-filter: blur(8px);

  &--step {
    padding: 1.7rem;
  }
}

.fp__section-header {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 1.3rem;
}

.fp__section-num {
  flex: none;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($PHB-CYAN, 0.14);
  border: 1px solid rgba($PHB-CYAN, 0.3);
  color: $PHB-CYAN;
  @include fonts.heading-font(800);
  font-size: 1rem;
}

.fp__section-title {
  @include fonts.heading-font(700);
  color: $PHB-TEXT-1;
  font-size: 1.15rem;
  margin: 0;
}

.fp__section-headline {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: $PHB-CYAN;
}

.fp__questions-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid $PHB-BORDER;
  margin-bottom: 0.4rem;
  font-size: 0.74rem;
  color: $PHB-TEXT-3;
  letter-spacing: 0.04em;
}

// ─── Transición entre secciones ──────────────────────────────────────────────
.fwd-enter-active,
.fwd-leave-active,
.back-enter-active,
.back-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.fwd-enter-from {
  opacity: 0;
  transform: translateX(26px);
}

.fwd-leave-to {
  opacity: 0;
  transform: translateX(-26px);
}

.back-enter-from {
  opacity: 0;
  transform: translateX(-26px);
}

.back-leave-to {
  opacity: 0;
  transform: translateX(26px);
}

@media (prefers-reduced-motion: reduce) {
  .fwd-enter-active,
  .fwd-leave-active,
  .back-enter-active,
  .back-leave-active {
    transition-duration: 1ms;
  }

  .fwd-enter-from,
  .fwd-leave-to,
  .back-enter-from,
  .back-leave-to {
    transform: none;
  }
}

@media (max-width: 640px) {
  .fp__card--step {
    padding: 1.2rem;
    border-radius: 16px;
  }
}
</style>
