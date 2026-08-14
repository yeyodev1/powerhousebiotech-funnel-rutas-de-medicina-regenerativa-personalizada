<script setup lang="ts">
import { ANSWER_SCALE } from '@/data/assessment'
import ContactFields from './ContactFields.vue'

const nombre = defineModel<string>('nombre', { required: true })
const email = defineModel<string>('email', { required: true })
const phoneNum = defineModel<string>('phoneNum', { required: true })
const countryCode = defineModel<string>('countryCode', { required: true })

defineProps<{
  errors: Record<string, string>
  answeredCount: number
  totalQuestions: number
}>()

const emit = defineEmits<{ start: []; clearError: [field: string] }>()

const scaleOptions = ANSWER_SCALE
</script>

<template>
  <div class="fp__card">
    <span class="fp__eyebrow">Evaluación de capacidad regenerativa</span>
    <h1 class="fp__title">Cuestionario de Inteligencia Biológica PHB™</h1>
    <p class="fp__period">
      12 sistemas · {{ totalQuestions }} preguntas · periodo de referencia: últimos 90 días
    </p>

    <div class="fp-promise">
      <p class="fp-promise__lead">
        No es un test de síntomas: cada bloque te explica qué sistema estás evaluando y qué
        biomarcadores ayuda a priorizar.
      </p>
      <div class="fp-promise__row">
        <i class="fa-solid fa-graduation-cap"></i>
        <span>Aprendes sobre tu biología mientras respondes.</span>
      </div>
      <div class="fp-promise__row">
        <i class="fa-solid fa-floppy-disk"></i>
        <span>Se guarda solo: puedes cerrar y retomar donde ibas.</span>
      </div>
      <div class="fp-promise__row">
        <i class="fa-solid fa-unlock-keyhole"></i>
        <span>
          Al completarlo al <strong>100%</strong> desbloqueas tu <strong>cita orientativa</strong> y
          un <strong>primer estudio rápido</strong>.
        </span>
      </div>
    </div>

    <div class="fp-scale">
      <span class="fp-scale__label">Escala de respuesta</span>
      <div class="fp-scale__items">
        <span v-for="opt in scaleOptions" :key="opt.value" class="fp-scale__item">
          <strong>{{ opt.value }}</strong> {{ opt.label }}
        </span>
      </div>
    </div>

    <ContactFields
      v-model:nombre="nombre"
      v-model:email="email"
      v-model:phone-num="phoneNum"
      v-model:country-code="countryCode"
      :errors="errors"
      @clear-error="emit('clearError', $event)"
    />

    <button type="button" class="fp__btn fp__btn--start" @click="emit('start')">
      {{ answeredCount > 0 ? 'CONTINUAR CUESTIONARIO' : 'COMENZAR CUESTIONARIO' }} →
    </button>
    <p v-if="answeredCount > 0" class="fp__resume">
      Tienes {{ answeredCount }} de {{ totalQuestions }} respuestas guardadas.
    </p>

    <router-link to="/" class="fp__back">← Volver al inicio</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp__card {
  background: rgba($PHB-SURFACE, 0.62);
  border: 1px solid $PHB-BORDER;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: $PHB-SHADOW-MD;
  backdrop-filter: blur(8px);
}

.fp__eyebrow {
  display: inline-block;
  @include fonts.accent-font(600);
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: $PHB-CYAN;
  margin-bottom: 0.7rem;
}

.fp__title {
  @include fonts.heading-font(800);
  color: $PHB-TEXT-1;
  font-size: clamp(1.45rem, 4.4vw, 2rem);
  margin: 0 0 0.5rem;
}

.fp__period {
  font-size: 0.85rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1.6rem;
}

.fp-promise {
  background: rgba($PHB-NAVY-DARK, 0.55);
  border: 1px solid $PHB-BORDER;
  border-radius: 14px;
  padding: 1.2rem 1.3rem;
  margin-bottom: 1.5rem;

  &__lead {
    margin: 0 0 1rem;
    font-size: 0.92rem;
    color: $PHB-TEXT-2;
  }

  &__row {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    font-size: 0.87rem;
    padding: 0.4rem 0;
    color: $PHB-TEXT-2;

    i {
      color: $PHB-CYAN;
      margin-top: 0.2rem;
      flex: none;
      width: 1rem;
      text-align: center;
    }

    strong {
      color: $PHB-TEXT-1;
    }
  }
}

.fp-scale {
  background: rgba($PHB-NAVY-DARK, 0.45);
  border: 1px solid $PHB-BORDER;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  margin-bottom: 1.6rem;

  &__label {
    display: block;
    @include fonts.accent-font(600);
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $PHB-TEXT-3;
    margin-bottom: 0.7rem;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.5rem 1rem;
  }

  &__item {
    font-size: 0.82rem;
    color: $PHB-TEXT-2;

    strong {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 6px;
      margin-right: 0.45rem;
      background: rgba($PHB-CYAN, 0.14);
      color: $PHB-CYAN;
      @include fonts.heading-font(700);
      font-size: 0.78rem;
    }
  }
}

.fp__btn {
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 1.05rem 1.5rem;
  cursor: pointer;
  @include fonts.accent-font(700);
  font-size: 0.88rem;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, $PHB-BLUE, $PHB-CYAN);
  color: $PHB-NAVY-DARK;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.07);
  }
}

.fp__resume {
  text-align: center;
  font-size: 0.8rem;
  color: $PHB-CYAN;
  margin: 0.8rem 0 0;
}

.fp__back {
  display: block;
  text-align: center;
  margin-top: 1.2rem;
  color: $PHB-TEXT-3;
  text-decoration: none;
  font-size: 0.84rem;

  &:hover {
    color: $PHB-CYAN;
  }
}

@media (max-width: 640px) {
  .fp__card {
    padding: 1.3rem;
    border-radius: 16px;
  }
}
</style>
