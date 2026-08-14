<script setup lang="ts">
defineProps<{
  overallProgress: number
  isComplete: boolean
  remaining: number
}>()
</script>

<template>
  <div class="fp__overall-progress">
    <div class="fp__overall-bar">
      <div class="fp__overall-fill" :style="{ width: overallProgress + '%' }"></div>
    </div>
    <span v-if="isComplete" class="fp__overall-done">
      <i class="fa-solid fa-circle-check"></i> Cuestionario completo — ya puedes enviarlo
    </span>
    <span v-else>
      Faltan {{ remaining }} respuestas para desbloquear tu cita orientativa
    </span>
  </div>
</template>

<style lang="scss" scoped>
.fp__overall-progress {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.79rem;
  color: $PHB-TEXT-3;
}

.fp__overall-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba($PHB-TEXT-1, 0.08);
  overflow: hidden;
  margin-bottom: 0.6rem;
}

.fp__overall-fill {
  height: 100%;
  background: linear-gradient(90deg, $PHB-BLUE, $PHB-ACCENT);
  transition: width 0.4s ease;
}

.fp__overall-done {
  color: $PHB-ACCENT;

  i {
    margin-right: 0.35rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fp__overall-fill {
    transition: none;
  }
}
</style>
