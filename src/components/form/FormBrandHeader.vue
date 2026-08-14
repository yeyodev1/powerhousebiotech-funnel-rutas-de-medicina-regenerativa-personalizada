<script setup lang="ts">
import logoSrc from '@/assets/logos/logo.png'

defineProps<{
  /** Estado del guardado en segundo plano; solo se muestra durante el wizard */
  syncState?: 'idle' | 'saving' | 'saved'
  showSync?: boolean
}>()
</script>

<template>
  <header class="fp__header">
    <router-link to="/" class="fp__logo" aria-label="PowerHouse Biotech">
      <img :src="logoSrc" alt="PowerHouse Biotech" class="fp__logo-img" />
    </router-link>
    <div class="fp__header-right">
      <span v-if="showSync" class="fp__save" :class="'is-' + syncState">
        <i
          :class="
            syncState === 'saving' ? 'fa-solid fa-cloud-arrow-up' : 'fa-solid fa-cloud-check'
          "
        ></i>
        {{ syncState === 'saving' ? 'Guardando…' : 'Progreso guardado' }}
      </span>
      <a
        href="https://powerhousebiotech.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="fp__top-link"
      >
        VER POWERHOUSE BIOTECH
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;

.fp__header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba($PHB-NAVY-DARK, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid $PHB-BORDER;
  padding: 0 1.25rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.fp__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex: none;

  &-img {
    height: 34px;
    width: auto;
    object-fit: contain;
    display: block;
  }
}

.fp__header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.fp__save {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $PHB-TEXT-3;
  transition: color 0.25s ease;

  i {
    color: $PHB-CYAN;
  }

  &.is-saving {
    color: $PHB-CYAN;
  }

  &.is-saved i {
    color: $PHB-ACCENT;
  }
}

.fp__top-link {
  text-decoration: none;
  color: $PHB-TEXT-3;
  @include fonts.accent-font(600);
  font-size: 0.68rem;
  letter-spacing: 0.11em;
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  transition: all 0.25s ease;

  &:hover {
    color: $PHB-TEXT-1;
    border-color: $PHB-CYAN;
  }
}

@media (max-width: 640px) {
  .fp__header {
    padding: 0 0.9rem;
  }

  .fp__top-link {
    display: none;
  }
}
</style>
