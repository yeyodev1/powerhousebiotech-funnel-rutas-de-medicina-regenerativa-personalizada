<script setup lang="ts">
defineProps<{
  totalQuestions: number
  /** Link público del reporte; puede no estar si el backend no respondió */
  reportUrl: string
}>()
</script>

<template>
  <div class="fp__done">
    <div class="fp__done-icon"><i class="fa-solid fa-circle-check"></i></div>
    <span class="fp__done-badge">100% completado</span>
    <h2 class="fp__done-title">Enviaste las {{ totalQuestions }} preguntas</h2>
    <p class="fp__done-text">
      Ya tenemos el mapa completo de tus 12 sistemas. Al haberlo llenado al 100%, tu perfil pasa a
      revisión con prioridad y quedas habilitado para los dos beneficios de esta etapa.
    </p>

    <div class="fp__perks">
      <div class="fp__perk">
        <i class="fa-solid fa-calendar-check"></i>
        <div>
          <strong>Cita orientativa</strong>
          <span>Un especialista lee tu mapa contigo y te explica qué sistemas atender primero.</span>
        </div>
      </div>
      <div class="fp__perk">
        <i class="fa-solid fa-vial-circle-check"></i>
        <div>
          <strong>Primer estudio rápido</strong>
          <span>Enfocado en los biomarcadores que tus respuestas señalaron como prioritarios.</span>
        </div>
      </div>
    </div>

    <p class="fp__done-note">
      <i class="fa-solid fa-comment-sms"></i>
      Te contactamos al número que registraste para coordinar la cita. Guarda tu reporte: es el
      resumen que revisará el especialista.
    </p>

    <div class="fp__done-links">
      <a
        v-if="reportUrl"
        :href="reportUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="fp__done-btn"
      >
        VER MI REPORTE <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
      <router-link to="/" class="fp__done-link">← Volver al inicio</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp__done {
  background: rgba($PHB-SURFACE, 0.66);
  border: 1px solid rgba($PHB-CYAN, 0.28);
  border-radius: 22px;
  padding: 2.6rem 2rem;
  text-align: center;
  box-shadow: $PHB-SHADOW-MD;
  backdrop-filter: blur(8px);
}

.fp__done-icon {
  font-size: 3rem;
  color: $PHB-ACCENT;
  margin-bottom: 0.8rem;
}

.fp__done-badge {
  display: inline-block;
  @include fonts.accent-font(700);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: $PHB-NAVY-DARK;
  background: $PHB-ACCENT;
  border-radius: 999px;
  padding: 0.3rem 0.85rem;
  margin-bottom: 0.9rem;
}

.fp__done-title {
  @include fonts.heading-font(800);
  color: $PHB-TEXT-1;
  font-size: clamp(1.35rem, 4.2vw, 1.85rem);
  margin: 0 0 0.7rem;
}

.fp__done-text {
  margin: 0 auto 1.6rem;
  max-width: 30rem;
  font-size: 0.92rem;
  color: $PHB-TEXT-2;
  line-height: 1.62;
}

.fp__perks {
  display: grid;
  gap: 0.7rem;
  text-align: left;
  margin-bottom: 1.4rem;
}

.fp__perk {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  background: rgba($PHB-NAVY-DARK, 0.55);
  border: 1px solid $PHB-BORDER;
  border-radius: 13px;
  padding: 0.95rem 1.05rem;

  i {
    color: $PHB-CYAN;
    font-size: 1.05rem;
    margin-top: 0.15rem;
    flex: none;
    width: 1.3rem;
    text-align: center;
  }

  strong {
    display: block;
    color: $PHB-TEXT-1;
    @include fonts.heading-font(700);
    font-size: 0.93rem;
    margin-bottom: 0.15rem;
  }

  span {
    font-size: 0.84rem;
    color: $PHB-TEXT-3;
    line-height: 1.55;
  }
}

.fp__done-note {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  text-align: left;
  font-size: 0.83rem;
  color: $PHB-TEXT-3;
  background: rgba($PHB-ACCENT, 0.07);
  border: 1px solid rgba($PHB-ACCENT, 0.18);
  border-radius: 11px;
  padding: 0.8rem 0.95rem;
  margin: 0 0 1.6rem;

  i {
    color: $PHB-ACCENT;
    margin-top: 0.15rem;
  }
}

.fp__done-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
}

.fp__done-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  border-radius: 999px;
  padding: 1rem 1.9rem;
  background: linear-gradient(90deg, $PHB-BLUE, $PHB-CYAN);
  color: $PHB-NAVY-DARK;
  @include fonts.accent-font(700);
  font-size: 0.85rem;
  letter-spacing: 0.07em;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.07);
  }
}

.fp__done-link {
  color: $PHB-TEXT-3;
  text-decoration: none;
  font-size: 0.84rem;

  &:hover {
    color: $PHB-CYAN;
  }
}

@media (max-width: 640px) {
  .fp__done {
    padding: 2rem 1.2rem;
  }
}
</style>
