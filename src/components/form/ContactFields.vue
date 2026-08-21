<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { COUNTRIES, type CountryOption } from '@/composables/useAssessmentState'
import { extractInternational } from '@/utils/phone'

const nombre = defineModel<string>('nombre', { required: true })
const apellido = defineModel<string>('apellido', { required: true })
const email = defineModel<string>('email', { required: true })
const phoneNum = defineModel<string>('phoneNum', { required: true })
const countryCode = defineModel<string>('countryCode', { required: true })

const props = defineProps<{ errors: Record<string, string> }>()
const emit = defineEmits<{ clearError: [field: string] }>()

const showPicker = ref(false)
const current = computed(
  () => COUNTRIES.find((c) => c.code === countryCode.value) || COUNTRIES[0],
)

function selectCountry(c: CountryOption) {
  countryCode.value = c.code
  showPicker.value = false
}

// Ajusta el pais solo si escriben/pegan un numero internacional (+1…, 001…)
function onPhoneInput() {
  emit('clearError', 'telefono')
  const hit = extractInternational(phoneNum.value, COUNTRIES.map((c) => c.code))
  if (hit) {
    countryCode.value = hit.code
    phoneNum.value = hit.national
  }
}

// El dropdown se cierra al tocar fuera; sin esto queda abierto sobre el teclado móvil
function onDocumentClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.fp-phone-pick')) showPicker.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

const countries = COUNTRIES
const errors = computed(() => props.errors)
</script>

<template>
  <div class="fp-personal">
    <p class="fp-personal__label">Tus datos de contacto</p>

    <div class="fp-field fp-field--split">
      <div>
        <input
          v-model="nombre"
          placeholder="Nombre"
          autocomplete="given-name"
          :class="{ error: errors.nombre }"
          @input="emit('clearError', 'nombre')"
        />
        <p v-if="errors.nombre" class="fp-field__error">{{ errors.nombre }}</p>
      </div>
      <div>
        <input
          v-model="apellido"
          placeholder="Apellido"
          autocomplete="family-name"
          :class="{ error: errors.apellido }"
          @input="emit('clearError', 'apellido')"
        />
        <p v-if="errors.apellido" class="fp-field__error">{{ errors.apellido }}</p>
      </div>
    </div>

    <div class="fp-field">
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        :class="{ error: errors.email }"
        @input="emit('clearError', 'email')"
      />
    </div>
    <p v-if="errors.email" class="fp-field__error">{{ errors.email }}</p>

    <div class="fp-field fp-field--phone">
      <div class="fp-phone-pick">
        <button type="button" class="fp-phone-pick__btn" @click="showPicker = !showPicker">
          <span class="fp-phone-pick__flag">{{ current.flag }}</span>
          <span class="fp-phone-pick__code">{{ current.code }}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div v-if="showPicker" class="fp-phone-pick__drop">
          <button
            v-for="c in countries"
            :key="c.code + c.label"
            type="button"
            class="fp-phone-pick__opt"
            :class="{ active: countryCode === c.code }"
            @click="selectCountry(c)"
          >
            <span class="fp-phone-pick__flag">{{ c.flag }}</span>
            <span class="fp-phone-pick__code">{{ c.code }}</span>
            <span class="fp-phone-pick__label">{{ c.label }}</span>
          </button>
        </div>
      </div>
      <input
        v-model="phoneNum"
        type="tel"
        placeholder="Teléfono / WhatsApp"
        :class="{ error: errors.telefono }"
        @input="emit('clearError', 'telefono')"
      />
    </div>
    <p v-if="errors.telefono" class="fp-field__error">{{ errors.telefono }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/levels.module.scss' as levels;

.fp-personal {
  margin-bottom: 1.5rem;

  &__label {
    @include fonts.accent-font(600);
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $PHB-TEXT-3;
    margin: 0 0 0.8rem;
  }
}

.fp-field {
  margin-bottom: 0.7rem;

  input {
    width: 100%;
    background: rgba($PHB-NAVY-DARK, 0.6);
    border: 1px solid $PHB-BORDER-MEDIUM;
    border-radius: 11px;
    padding: 0.85rem 1rem;
    color: $PHB-TEXT-1;
    font-family: fonts.$font-secondary;
    font-size: 0.94rem;
    transition: border-color 0.2s ease;

    &::placeholder {
      color: $PHB-TEXT-3;
    }

    &:focus {
      outline: none;
      border-color: $PHB-CYAN;
    }

    &.error {
      border-color: levels.$level-prioritario;
    }
  }

  &--phone {
    display: flex;
    gap: 0.55rem;

    input {
      flex: 1;
    }
  }

  // Nombre y apellido en dos columnas; en movil se apilan
  &--split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
    align-items: start;
  }

  &__error {
    color: levels.$level-prioritario;
    font-size: 0.78rem;
    margin: 0.25rem 0 0;
  }
}

.fp-phone-pick {
  position: relative;
  flex: none;

  &__btn {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba($PHB-NAVY-DARK, 0.6);
    border: 1px solid $PHB-BORDER-MEDIUM;
    border-radius: 11px;
    padding: 0.85rem 0.75rem;
    color: $PHB-TEXT-1;
    cursor: pointer;
    font-size: 0.88rem;

    i {
      font-size: 0.65rem;
      color: $PHB-TEXT-3;
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: 30;
    width: 190px;
    max-height: 230px;
    overflow-y: auto;
    background: $PHB-SURFACE-2;
    border: 1px solid $PHB-BORDER-MEDIUM;
    border-radius: 12px;
    box-shadow: $PHB-SHADOW-MD;
    padding: 0.3rem;
  }

  &__opt {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 0;
    border-radius: 8px;
    padding: 0.55rem 0.6rem;
    color: $PHB-TEXT-2;
    cursor: pointer;
    font-size: 0.85rem;
    text-align: left;

    &:hover,
    &.active {
      background: rgba($PHB-CYAN, 0.12);
      color: $PHB-TEXT-1;
    }
  }

  &__label {
    margin-left: auto;
    color: $PHB-TEXT-3;
    font-size: 0.75rem;
  }
}

@media (max-width: 520px) {
  .fp-field--split {
    grid-template-columns: 1fr;
  }
}
</style>
