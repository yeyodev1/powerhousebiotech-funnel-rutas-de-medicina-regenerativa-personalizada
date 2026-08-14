<script setup lang="ts">
import type { LevelKey } from '@/data/assessment'

defineProps<{
  level: { key: LevelKey; label: string }
  load: number
  sectionTitle: string
}>()
</script>

<template>
  <div class="fp-readout" :class="'is-' + level.key">
    <div class="fp-readout__top">
      <span class="fp-readout__label">Carga de este sistema</span>
      <span class="fp-readout__chip">{{ level.label }}</span>
    </div>
    <div class="fp-readout__bar">
      <div class="fp-readout__fill" :style="{ width: load + '%' }"></div>
    </div>
    <p class="fp-readout__text">
      {{ load }}% de carga sintomática reportada en {{ sectionTitle }}. Este resultado se suma a tu
      mapa y define qué biomarcadores se revisan primero.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/levels.module.scss' as levels;

.fp-readout {
  --level: #{$PHB-CYAN};
  margin-top: 1.4rem;
  border: 1px solid rgba($PHB-TEXT-1, 0.1);
  border-left: 3px solid var(--level);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: rgba($PHB-NAVY-DARK, 0.5);

  &.is-optimo {
    --level: #{levels.$level-optimo};
  }
  &.is-vigilancia {
    --level: #{levels.$level-vigilancia};
  }
  &.is-alerta {
    --level: #{levels.$level-alerta};
  }
  &.is-prioritario {
    --level: #{levels.$level-prioritario};
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.6rem;
  }

  &__label {
    @include fonts.accent-font(600);
    font-size: 0.64rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: $PHB-TEXT-3;
  }

  &__chip {
    @include fonts.accent-font(700);
    font-size: 0.64rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--level);
    border: 1px solid var(--level);
    border-radius: 999px;
    padding: 0.22rem 0.6rem;
  }

  &__bar {
    height: 6px;
    border-radius: 999px;
    background: rgba($PHB-TEXT-1, 0.09);
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 999px;
    background: var(--level);
    transition: width 0.4s ease;
  }

  &__text {
    margin: 0.65rem 0 0;
    font-size: 0.82rem;
    color: $PHB-TEXT-3;
    line-height: 1.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fp-readout__fill {
    transition: none;
  }
}
</style>
