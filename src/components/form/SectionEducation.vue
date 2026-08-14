<script setup lang="ts">
import type { SectionEducation } from '@/data/assessment'

defineProps<{ education: SectionEducation }>()
</script>

<template>
  <section class="fp-edu">
    <div class="fp-edu__block">
      <span class="fp-edu__tag"><i class="fa-solid fa-microscope"></i> Qué estás evaluando</span>
      <p>{{ education.what }}</p>
    </div>
    <div class="fp-edu__block">
      <span class="fp-edu__tag"><i class="fa-solid fa-dna"></i> Por qué importa para regenerar</span>
      <p>{{ education.why }}</p>
    </div>
    <div class="fp-edu__markers">
      <span class="fp-edu__tag">
        <i class="fa-solid fa-flask-vial"></i> Biomarcadores que prioriza
      </span>
      <p>{{ education.markers }}</p>
    </div>
    <div class="fp-edu__insight">
      <i class="fa-solid fa-lightbulb"></i>
      <p>{{ education.insight }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp-edu {
  background: rgba($PHB-NAVY-DARK, 0.55);
  border: 1px solid $PHB-BORDER;
  border-left: 3px solid $PHB-CYAN;
  border-radius: 14px;
  padding: 1.15rem 1.25rem;
  margin-bottom: 1.6rem;
  display: grid;
  gap: 1rem;

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    @include fonts.accent-font(600);
    font-size: 0.62rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: $PHB-CYAN;
    margin-bottom: 0.35rem;

    i {
      font-size: 0.72rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.89rem;
    line-height: 1.62;
    color: $PHB-TEXT-2;
  }

  &__markers p {
    color: $PHB-TEXT-3;
    font-size: 0.83rem;
  }

  &__insight {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
    background: rgba($PHB-ACCENT, 0.07);
    border: 1px solid rgba($PHB-ACCENT, 0.18);
    border-radius: 10px;
    padding: 0.8rem 0.9rem;

    i {
      color: $PHB-ACCENT;
      margin-top: 0.15rem;
    }

    p {
      font-size: 0.84rem;
      color: $PHB-TEXT-2;
    }
  }
}

@media (max-width: 640px) {
  .fp-edu {
    padding: 1rem;
  }
}
</style>
