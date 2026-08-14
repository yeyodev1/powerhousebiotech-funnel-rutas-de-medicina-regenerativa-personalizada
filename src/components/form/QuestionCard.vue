<script setup lang="ts">
import { ref } from 'vue'
import { ANSWER_SCALE, type QuestionItem } from '@/data/assessment'

defineProps<{
  question: QuestionItem
  /** undefined = sin responder */
  value: number | undefined
}>()

const emit = defineEmits<{ select: [value: number] }>()

const showDetails = ref(false)
const scaleOptions = ANSWER_SCALE
</script>

<template>
  <div class="fp-question">
    <p class="fp-question__text">{{ question.id }}. {{ question.text }}</p>

    <div class="fp-question__options">
      <label
        v-for="opt in scaleOptions"
        :key="opt.value"
        class="fp-option"
        :class="{ selected: value === opt.value }"
      >
        <input
          type="radio"
          :name="'q' + question.id"
          :value="opt.value"
          :checked="value === opt.value"
          @change="emit('select', opt.value)"
        />
        <span class="fp-option__value">{{ opt.value }}</span>
        <span class="fp-option__label">{{ opt.short }}</span>
      </label>
    </div>

    <button type="button" class="fp-question__info-btn" @click="showDetails = !showDetails">
      <i class="fa-regular fa-circle-info"></i>
      {{ showDetails ? 'Ocultar' : 'Ver' }} interpretación y biomarcadores
    </button>

    <div v-if="showDetails" class="fp-question__details">
      <p><strong>Interpretación:</strong> {{ question.interpretation }}</p>
      <p><strong>Biomarcadores relacionados:</strong> {{ question.biomarkers }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp-question {
  padding: 1.15rem 0;
  border-bottom: 1px dashed rgba($PHB-TEXT-1, 0.09);

  &:last-of-type {
    border-bottom: 0;
  }

  &__text {
    margin: 0 0 0.85rem;
    font-size: 0.93rem;
    line-height: 1.55;
    color: $PHB-TEXT-1;
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  &__info-btn {
    margin-top: 0.75rem;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: $PHB-TEXT-3;
    font-size: 0.78rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;

    &:hover {
      color: $PHB-CYAN;
    }
  }

  &__details {
    margin-top: 0.6rem;
    background: rgba($PHB-NAVY-DARK, 0.5);
    border-radius: 10px;
    padding: 0.8rem 0.9rem;

    p {
      margin: 0 0 0.5rem;
      font-size: 0.82rem;
      color: $PHB-TEXT-3;
      line-height: 1.55;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        color: $PHB-TEXT-2;
      }
    }
  }
}

.fp-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.6rem 0.3rem;
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 11px;
  cursor: pointer;
  background: rgba($PHB-NAVY-DARK, 0.45);
  transition: all 0.18s ease;
  text-align: center;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__value {
    @include fonts.heading-font(800);
    font-size: 1rem;
    color: $PHB-TEXT-2;
    line-height: 1;
  }

  &__label {
    font-size: 0.6rem;
    letter-spacing: 0.03em;
    color: $PHB-TEXT-3;
  }

  &:hover {
    border-color: rgba($PHB-CYAN, 0.5);
  }

  &.selected {
    background: linear-gradient(135deg, rgba($PHB-BLUE, 0.35), rgba($PHB-CYAN, 0.25));
    border-color: $PHB-CYAN;

    .fp-option__value {
      color: $PHB-TEXT-1;
    }

    .fp-option__label {
      color: $PHB-ACCENT;
    }
  }
}

@media (max-width: 640px) {
  .fp-question__options {
    gap: 0.35rem;
  }

  .fp-option {
    padding: 0.75rem 0.2rem;

    &__label {
      display: none;
    }
  }
}
</style>
