<script setup lang="ts">
defineProps<{
  isLastStep: boolean
  submitLoading: boolean
}>()

const emit = defineEmits<{ prev: []; next: [] }>()
</script>

<template>
  <div class="fp-nav">
    <button type="button" class="fp-nav__btn fp-nav__btn--prev" @click="emit('prev')">
      <i class="fa-solid fa-arrow-left"></i> Anterior
    </button>
    <div class="fp-nav__spacer"></div>
    <button
      type="button"
      class="fp-nav__btn fp-nav__btn--next"
      :class="{ 'fp-nav__btn--submit': isLastStep }"
      :disabled="submitLoading"
      @click="emit('next')"
    >
      <template v-if="isLastStep">
        {{ submitLoading ? 'Enviando…' : 'ENVIAR CUESTIONARIO' }}
      </template>
      <template v-else> Siguiente <i class="fa-solid fa-arrow-right"></i> </template>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.7rem;
  padding-top: 1.3rem;
  border-top: 1px solid $PHB-BORDER;

  &__spacer {
    flex: 1;
  }

  &__btn {
    border-radius: 999px;
    padding: 0.85rem 1.4rem;
    cursor: pointer;
    @include fonts.accent-font(600);
    font-size: 0.82rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &--prev {
      background: none;
      border: 1px solid $PHB-BORDER-MEDIUM;
      color: $PHB-TEXT-3;

      &:hover {
        color: $PHB-TEXT-1;
        border-color: $PHB-CYAN;
      }
    }

    &--next {
      border: 0;
      background: linear-gradient(90deg, $PHB-BLUE, $PHB-CYAN);
      color: $PHB-NAVY-DARK;
      @include fonts.accent-font(700);

      &:hover {
        filter: brightness(1.08);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &--submit {
      letter-spacing: 0.08em;
      padding: 0.85rem 1.7rem;
    }
  }
}

@media (max-width: 640px) {
  .fp-nav {
    flex-wrap: wrap;

    &__btn {
      flex: 1;
      justify-content: center;
    }

    &__spacer {
      display: none;
    }
  }
}
</style>
