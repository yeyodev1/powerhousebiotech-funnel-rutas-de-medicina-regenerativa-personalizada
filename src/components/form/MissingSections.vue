<script setup lang="ts">
import type { MissingSection } from '@/composables/useAssessmentState'

defineProps<{ sections: MissingSection[] }>()
const emit = defineEmits<{ goTo: [index: number] }>()
</script>

<template>
  <div class="fp-missing">
    <p class="fp-missing__title">
      <i class="fa-solid fa-triangle-exclamation"></i>
      Te faltan respuestas para llegar al 100%
    </p>
    <p class="fp-missing__text">
      La cita orientativa y el estudio rápido se habilitan con el cuestionario completo. Toca una
      sección para terminarla:
    </p>
    <div class="fp-missing__list">
      <button
        v-for="s in sections"
        :key="s.id"
        type="button"
        class="fp-missing__item"
        @click="emit('goTo', s.index)"
      >
        {{ s.title }} <span>{{ s.pending }} pendiente{{ s.pending > 1 ? 's' : '' }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/levels.module.scss' as levels;

.fp-missing {
  margin-top: 1.4rem;
  border: 1px solid rgba(levels.$level-alerta, 0.35);
  background: rgba(levels.$level-alerta, 0.08);
  border-radius: 12px;
  padding: 1rem 1.1rem;

  &__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.4rem;
    color: levels.$level-alerta;
    @include fonts.heading-font(700);
    font-size: 0.9rem;
  }

  &__text {
    margin: 0 0 0.8rem;
    font-size: 0.83rem;
    color: $PHB-TEXT-2;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  &__item {
    background: rgba($PHB-NAVY-DARK, 0.6);
    border: 1px solid $PHB-BORDER-MEDIUM;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    color: $PHB-TEXT-2;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.2s ease;

    span {
      color: levels.$level-alerta;
      margin-left: 0.35rem;
    }

    &:hover {
      border-color: $PHB-CYAN;
      color: $PHB-TEXT-1;
    }
  }
}
</style>
