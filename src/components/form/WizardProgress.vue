<script setup lang="ts">
defineProps<{
  activeStep: number
  totalSteps: number
  stepProgress: number
  sectionTitle: string
  answeredCount: number
  totalQuestions: number
  overallProgress: number
}>()
</script>

<template>
  <div class="fp__progress-wrap">
    <div class="fp__step-indicator">
      <span class="fp__step-badge">Sección {{ activeStep + 1 }} de {{ totalSteps }}</span>
      <span class="fp__step-name">{{ sectionTitle }}</span>
    </div>
    <div class="fp__progress-bar">
      <div class="fp__progress-fill" :style="{ width: stepProgress + '%' }"></div>
    </div>
    <div class="fp__progress-meta">
      <span>{{ answeredCount }}/{{ totalQuestions }} respondidas</span>
      <span class="fp__progress-pct">{{ overallProgress }}% del cuestionario</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp__progress-wrap {
  margin-bottom: 1.4rem;
}

.fp__step-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.6rem;
}

.fp__step-badge {
  @include fonts.accent-font(700);
  font-size: 0.64rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: $PHB-NAVY-DARK;
  background: $PHB-CYAN;
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
}

.fp__step-name {
  @include fonts.heading-font(600);
  color: $PHB-TEXT-1;
  font-size: 0.92rem;
}

.fp__progress-bar {
  height: 6px;
  border-radius: 999px;
  background: rgba($PHB-TEXT-1, 0.09);
  overflow: hidden;
}

.fp__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, $PHB-BLUE, $PHB-CYAN, $PHB-ACCENT);
  transition: width 0.4s ease;
}

.fp__progress-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: $PHB-TEXT-3;
}

.fp__progress-pct {
  color: $PHB-CYAN;
}

@media (prefers-reduced-motion: reduce) {
  .fp__progress-fill {
    transition: none;
  }
}
</style>
