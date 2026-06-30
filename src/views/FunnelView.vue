<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navOpen = ref(false)
const nombre = ref('')
const email = ref('')
const phoneNum = ref('')
const countryCode = ref('+52')
const showCountryPicker = ref(false)
const formErrors = ref<Record<string, string>>({})
const submitLoading = ref(false)

import logoSrc from '@/assets/logos/logo.png'
import juanPhoto from '@/assets/team/juan.png'
import heroBg from '@/assets/stock/ancianos.jpg'

const WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM
const LEAD_NOTE = 'Lead inicial capturado desde homepage'
const countries = [
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+1', flag: '🇨🇦', label: 'CA' },
  { code: '+54', flag: '🇦🇷', label: 'AR' },
  { code: '+55', flag: '🇧🇷', label: 'BR' },
  { code: '+56', flag: '🇨🇱', label: 'CL' },
  { code: '+57', flag: '🇨🇴', label: 'CO' },
  { code: '+51', flag: '🇵🇪', label: 'PE' },
  { code: '+593', flag: '🇪🇨', label: 'EC' },
  { code: '+58', flag: '🇻🇪', label: 'VE' },
  { code: '+502', flag: '🇬🇹', label: 'GT' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
]

const currentCountry = computed(() => countries.find(c => c.code === countryCode.value) || countries[0])

function parseFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    nombre: parts[0] || '',
    apellido: parts.slice(1).join(' '),
  }
}

function selectCountry(c: typeof countries[0]) {
  countryCode.value = c.code
  showCountryPicker.value = false
}

function getFullPhone() {
  return `${countryCode.value}${phoneNum.value.replace(/\D/g, '')}`
}

function validatePersonal() {
  const e: Record<string, string> = {}
  if (nombre.value.trim().length < 2) e.nombre = 'Ingresa tu nombre'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) e.email = 'Email inválido'
  if (phoneNum.value.trim().length < 7) e.telefono = 'Teléfono inválido'
  formErrors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validatePersonal()) return
  const fullPhone = getFullPhone()
  const { nombre: firstName, apellido } = parseFullName(nombre.value)
  submitLoading.value = true
  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: firstName,
        apellido,
        email: email.value.trim(),
        telefono: fullPhone,
        note: LEAD_NOTE,
        nota: LEAD_NOTE,
        paso: 'registro_inicial',
      }),
    })
  } catch { }
  await new Promise((r) => setTimeout(r, 400))
  submitLoading.value = false
  const q = new URLSearchParams({ nombre: nombre.value, email: email.value, telefono: fullPhone })
  router.push('/formulario?' + q.toString())
}

function onDocumentClick(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (!t.closest('.phb-phone-pick')) showCountryPicker.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

const steps = [
  {
    icon: 'fa-solid fa-folder-open',
    title: 'CLASIFICAR',
    desc: 'Comprender estado biológico, necesidades y complejidad.',
  },
  {
    icon: 'fa-solid fa-filter',
    title: 'SELECCIONAR',
    desc: 'Identificar quién avanza y quién necesita prepararse.',
  },
  {
    icon: 'fa-solid fa-gauge-high',
    title: 'EVALUAR',
    desc: 'Analizar qué tan preparado está el organismo.',
  },
  {
    icon: 'fa-solid fa-kit-medical',
    title: 'PREPARAR',
    desc: 'Mejorar condiciones antes de una intervención.',
  },
  {
    icon: 'fa-solid fa-fingerprint',
    title: 'PERSONALIZAR',
    desc: 'Construir ruta según objetivos, riesgos y características.',
  },
]

const timeline = [
  {
    icon: 'fa-solid fa-microscope',
    title: 'AMPLIAR TU EVALUACIÓN',
    desc: 'Solicitar biomarcadores o estudios.',
  },
  {
    icon: 'fa-solid fa-heart-pulse',
    title: 'PREPARAR TU ORGANISMO',
    desc: 'Atender inflamación, metabolismo, nutrición.',
  },
  {
    icon: 'fa-solid fa-seedling',
    title: 'OPTIMIZAR TU SALUD',
    desc: 'Estrategia preventiva enfocada en energía y longevidad.',
  },
  {
    icon: 'fa-solid fa-dna',
    title: 'VALORAR UNA TERAPIA REGENERATIVA',
    desc: 'Analizar alternativas con profesionales autorizados.',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'MONITOREAR TU EVOLUCIÓN',
    desc: 'Medir cambios y ajustar decisiones.',
  },
]

const trustItems = [
  { icon: 'fa-regular fa-clock', text: '+15 años de investigación' },
  { icon: 'fa-solid fa-users', text: '100k+ casos clínicos evaluados' },
  { icon: 'fa-solid fa-globe', text: 'Speaker internacional' },
  { icon: 'fa-regular fa-clipboard', text: 'Evaluación previa a la intervención' },
  { icon: 'fa-solid fa-dna', text: 'Health Decision Platform' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  navOpen.value = false
}
</script>

<template>
  <div class="phb">
    <!-- ════════ HEADER ════════ -->
    <header class="phb-header">
      <div class="phb-header__inner">
        <a href="/" class="phb-logo" aria-label="PowerHouse Biotech">
          <img :src="logoSrc" alt="PowerHouse Biotech" class="phb-logo__img" />
          <!-- <span class="phb-logo__text">POWERHOUSE <small>BIOTECH</small><sup>™</sup></span> -->
        </a>
        <button
          class="phb-hamburger"
          :class="{ open: navOpen }"
          aria-label="Menú"
          @click="navOpen = !navOpen"
        >
          <span></span><span></span><span></span>
        </button>
        <nav class="phb-nav" :class="{ 'phb-nav--open': navOpen }">
          <a @click="scrollTo('hero')">Inicio</a>
          <a @click="scrollTo('diferenciador')">Filosofía</a>
          <a @click="scrollTo('fundador')">El Fundador</a>
          <a @click="scrollTo('ruta')">Método</a>
          <router-link to="/formulario" class="phb-nav__cta">
            INICIA AQUÍ
          </router-link>
        </nav>
      </div>
    </header>

    <!-- ════════ HERO ════════ -->
    <section id="hero" class="phb-hero">
      <div class="phb-hero__bg" :style="{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
      <div class="phb-hero__grid">
        <div class="phb-hero__content">
          <p class="phb-hero__badge">La medicina esta cambiando</p>
          <h1 class="phb-hero__title">
            La medicina regenerativa es el avance de salud mas importante del siglo XXI<br />
          </h1>
          <ul class="phb-hero__list">
            <li><i class="fa-solid fa-circle-check"></i>Evaluamos tu capacidad de autoreparación.</li>
            <li><i class="fa-solid fa-circle-check"></i>Explicamos la gravedad real de tus análisis de laboratorio.</li>
            <li><i class="fa-solid fa-circle-check"></i>Diseñamos tu ruta crítica de regeneración.</li>
          </ul>
        </div>

        <div class="phb-hero__form-wrap">
          <div class="phb-form-card">
            <h2 class="phb-form-card__title">Evaluación de Capacidad Regenerativa</h2>
            <p class="phb-form-card__sub">
              Responde unas preguntas para descubrir qué tan preparado está tu cuerpo.
              Toma pocos minutos.
            </p>
            <form class="phb-form-card__form" @submit.prevent="handleSubmit">
              <div class="phb-field">
                <i class="fa-regular fa-user phb-field__icon"></i>
                <input
                  v-model="nombre"
                  placeholder="Nombre completo"
                  :class="{ error: formErrors.nombre }"
                  @input="formErrors.nombre = ''"
                />
              </div>
              <p v-if="formErrors.nombre" class="phb-field__error">{{ formErrors.nombre }}</p>
              <div class="phb-field">
                <i class="fa-regular fa-envelope phb-field__icon"></i>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Correo electrónico"
                  :class="{ error: formErrors.email }"
                  @input="formErrors.email = ''"
                />
              </div>
              <p v-if="formErrors.email" class="phb-field__error">{{ formErrors.email }}</p>
              <div class="phb-field phb-field--phone">
                <div class="phb-phone-pick">
                  <button type="button" class="phb-phone-pick__btn" @click="showCountryPicker = !showCountryPicker">
                    <span class="phb-phone-pick__flag">{{ currentCountry.flag }}</span>
                    <span class="phb-phone-pick__code">{{ currentCountry.code }}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                  </button>
                  <div v-if="showCountryPicker" class="phb-phone-pick__drop">
                    <button
                      v-for="c in countries"
                      :key="c.code + c.label"
                      type="button"
                      class="phb-phone-pick__opt"
                      :class="{ active: countryCode === c.code }"
                      @click="selectCountry(c)"
                    >
                      <span class="phb-phone-pick__flag">{{ c.flag }}</span>
                      <span class="phb-phone-pick__code">{{ c.code }}</span>
                      <span class="phb-phone-pick__label">{{ c.label }}</span>
                    </button>
                  </div>
                </div>
                <input
                  v-model="phoneNum"
                  type="tel"
                  placeholder="Teléfono / WhatsApp"
                  :class="{ error: formErrors.telefono }"
                  @input="formErrors.telefono = ''"
                />
              </div>
              <p v-if="formErrors.telefono" class="phb-field__error">{{ formErrors.telefono }}</p>
              <button type="submit" class="phb-form-card__btn" :disabled="submitLoading">
                {{ submitLoading ? 'Enviando...' : 'INICIA AQUI TU EVALUACIÓN →' }}
              </button>
            </form>
            <p class="phb-form-card__foot">
              <i class="fa-solid fa-lock"></i>
              Tu información será tratada de forma privada y confidencial.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ DIFERENCIADOR ════════ -->
    <section id="diferenciador" class="phb-dif">
      <div class="phb-dif__inner">
        <p class="phb-section-label">Nuestra Filosofía</p>
        <h2 class="phb-section-title">EL DIFERENCIADOR PHB</h2>
        <p class="phb-section-sub">No tratamos sin antes entender. Por qué los resultados varían.</p>
        <p class="phb-dif__intro">
          Dos personas con el mismo diagnóstico pueden tener resultados diferentes...
          El reto es saber a quién tratar, cuándo intervenir y cómo preparar su estado interno.
        </p>
        <div class="phb-dif__grid">
          <div v-for="(s, i) in steps" :key="i" class="phb-dif__card">
            <span class="phb-dif__num">{{ i + 1 }}</span>
            <div class="phb-dif__icon-wrap">
              <i :class="s.icon"></i>
            </div>
            <h3 class="phb-dif__card-title">{{ s.title }}</h3>
            <p class="phb-dif__card-desc">{{ s.desc }}</p>
          </div>
        </div>
        <div class="phb-dif__cta-wrap">
          <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="phb-dif__cta">
            VER POWERHOUSE BIOTECH →
          </a>
        </div>
      </div>
    </section>

    <!-- ════════ FUNDADOR ════════ -->
    <section id="fundador" class="phb-founder">
      <div class="phb-founder__inner">
        <p class="phb-section-label">FOUNDER & CEO — HEALTH DECISION PLATFORM</p>
        <h2 class="phb-section-title">Juan Román Garza.</h2>
        <p class="phb-founder__role">Medicina regenerativa de precisión y longevidad.</p>
        <div class="phb-founder__body">
          <div class="phb-founder__photo-wrap">
            <img :src="juanPhoto" alt="Juan Román Garza" class="phb-founder__photo" />
          </div>
          <div class="phb-founder__stats">
            <div class="phb-founder__stat">
              <span class="phb-founder__stat-num">+15</span>
              <span class="phb-founder__stat-label">Años de investigación</span>
            </div>
            <div class="phb-founder__stat">
              <span class="phb-founder__stat-num">100k+</span>
              <span class="phb-founder__stat-label">Casos clínicos evaluados</span>
            </div>
            <div class="phb-founder__stat">
              <span class="phb-founder__stat-num">Global</span>
              <span class="phb-founder__stat-label">Speaker internacional</span>
            </div>
          </div>
          <p class="phb-founder__bio">
            Juan Román II Garza Delgado es estratega, investigador y emprendedor en longevidad regenerativa, medicina de precisión y liderazgo bio-consciente.
            <br><br>
            Como fundador y visionario de Eternal Medical Center y PowerHouse Biotech, impulsa un ecosistema innovador que integra medicina regenerativa, diagnóstico avanzado, tecnologías de salud, educación y optimización humana.
            <br><br>
            Su trabajo combina biología del envejecimiento, biomarcadores, inteligencia artificial y pensamiento sistémico para desarrollar modelos que ayuden a las personas a extender sus años de salud, funcionalidad y alto desempeño.
          </p>
          <div class="phb-founder__links">
            <a href="https://juanromangarza.com/" target="_blank" rel="noopener noreferrer" class="phb-founder__btn">
              CONOCE MÁS SOBRE JUAN
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="phb-founder__link">
              VER POWERHOUSE BIOTECH →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ RUTA 5 PASOS ════════ -->
    <section id="ruta" class="phb-ruta">
      <div class="phb-ruta__inner">
        <p class="phb-section-label phb-section-label--light">Tu Camino Regenerativo</p>
        <h2 class="phb-section-title">TU CAMINO REGENERATIVO EN 5 PASOS</h2>
        <p class="phb-section-sub">De la evaluación a tu mejor versión.</p>
        <div class="phb-ruta__track">
          <div
            v-for="(t, i) in timeline"
            :key="i"
            class="phb-ruta__step"
          >
            <div class="phb-ruta__node">
              <span class="phb-ruta__num">{{ i + 1 }}</span>
              <div class="phb-ruta__node-icon">
                <i :class="t.icon"></i>
              </div>
            </div>
            <div class="phb-ruta__connector" v-if="i < timeline.length - 1"></div>
            <div class="phb-ruta__step-body">
              <h3>{{ t.title }}</h3>
              <p>{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ CTA FINAL ════════ -->
    <section id="cta-final" class="phb-cta">
      <div class="phb-cta__overlay"></div>
      <div class="phb-cta__inner">
        <div class="phb-cta__callouts">
          <div class="phb-cta__callout">
            <span class="phb-cta__callout-num">1</span>
            <p>Primero evaluamos.</p>
          </div>
          <div class="phb-cta__callout">
            <span class="phb-cta__callout-num">2</span>
            <p>Después seleccionamos.</p>
          </div>
          <div class="phb-cta__callout">
            <span class="phb-cta__callout-num">3</span>
            <p>Finalmente aplicamos.</p>
          </div>
        </div>
        <h2 class="phb-cta__title">
          Entiende tu biología.<br />
          Activa tu poder de regeneración.
        </h2>
        <p class="phb-cta__sub">
          La Medicina Regenerativa puede ser tu oportunidad. 
          <br><br>
          Pero el tratamiento correcto comienza antes. 
          <br><br>
          Comprende quién eres biológicamente y qué frena tu recuperación.
        </p>
        <div class="phb-cta__actions">
          <router-link to="/formulario" class="phb-cta__btn">
            INICIA TU EVALUACIÓN AQUÍ →
          </router-link>
          <a
            href="https://chat.whatsapp.com/K43yrnUQbVq2O9hn93X03c"
            target="_blank"
            rel="noopener noreferrer"
            class="phb-cta__ws"
          >
            <i class="fa-brands fa-whatsapp"></i>
            Unirme a la comunidad de WhatsApp
          </a>
        </div>
      </div>
    </section>

    <!-- ════════ FOOTER ════════ -->
    <footer class="phb-footer">
      <div class="phb-footer__inner">
        <div class="phb-footer__brand">
          <img :src="logoSrc" alt="PowerHouse Biotech" class="phb-footer__logo-img" />
          <span>POWERHOUSE BIOTECH<sup>™</sup></span>
        </div>
        <p class="phb-footer__byline">
          By <a href="https://juanromangarza.com/" target="_blank" rel="noopener noreferrer">Juan Román Garza</a>
        </p>
        <p class="phb-footer__legal">
          La evaluación es orientativa y no sustituye una consulta, diagnóstico o valoración
          médica. No garantiza elegibilidad ni resultados terapéuticos. Toda intervención debe
          ser indicada y realizada por profesionales e instituciones autorizadas.
        </p>
        <nav class="phb-footer__links">
          <router-link to="/politicas-privacidad">Política de Privacidad</router-link>
          <router-link to="/aviso-legal">Aviso Legal</router-link>
          <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer">
            VER POWERHOUSE BIOTECH
          </a>
        </nav>
        <p class="phb-footer__copy">
          &copy; {{ new Date().getFullYear() }} PowerHouse Biotech<sup>™</sup>.
          Todos los derechos reservados. Medicina regenerativa con enfoque humano.
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/fonts.modules.scss' as fonts;

// ── RESET ─────────────────────────────────────────────────────────────────────
.phb {
  background: $PHB-BG;
  color: $PHB-TEXT-2;
  min-height: 100vh;
  font-family: fonts.$font-secondary;
  overflow-x: hidden;
}

// ── HEADER ────────────────────────────────────────────────────────────────────
.phb-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba($PHB-NAVY-DARK, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid $PHB-BORDER;
  transition: background 0.3s;
}

.phb-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phb-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: $PHB-TEXT-1;
  cursor: pointer;

  &__img {
    height: 36px;
    width: auto;
    object-fit: contain;
  }

  &__text {
    @include fonts.heading-font(700);
    font-size: 1.05rem;
    letter-spacing: 0.05em;
    color: $PHB-TEXT-1;

    small {
      font-weight: 400;
      font-size: 0.85em;
    }

    sup {
      font-size: 0.5em;
      top: -0.6em;
    }
  }
}

.phb-nav {
  display: flex;
  align-items: center;
  gap: 2rem;

  a {
    font-family: fonts.$font-interface;
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: color 0.2s;
    white-space: nowrap;

    &:hover {
      color: $PHB-CYAN;
    }
  }

  &__cta {
    background: rgba($PHB-CYAN, 0.1);
    border: 1px solid $PHB-BORDER-MEDIUM;
    border-radius: 999px;
    padding: 0.45rem 1.2rem !important;
    font-weight: 700 !important;
    color: $PHB-CYAN !important;
    transition: background 0.2s, border-color 0.2s !important;

    &:hover {
      background: rgba($PHB-CYAN, 0.18) !important;
      border-color: $PHB-CYAN !important;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    background: rgba($PHB-NAVY-DARK, 0.98);
    flex-direction: column;
    gap: 0;
    padding: 0.5rem 0;
    transform: translateY(-120%);
    transition: transform 0.35s ease;
    border-bottom: 1px solid $PHB-BORDER;

    a {
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    &__cta {
      margin: 0.5rem 1.5rem;
      text-align: center;
    }

    &--open {
      transform: translateY(0);
    }
  }
}

.phb-hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 26px;
  position: relative;

  span {
    display: block;
    height: 2px;
    background: $PHB-TEXT-1;
    border-radius: 2px;
    transition: all 0.3s;
    position: absolute;
    left: 4px;
    right: 4px;

    &:nth-child(1) {
      top: 4px;
    }

    &:nth-child(2) {
      top: 12px;
    }

    &:nth-child(3) {
      top: 20px;
    }
  }

  &.open {
    span:nth-child(1) {
      top: 12px;
      transform: rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      top: 12px;
      transform: rotate(-45deg);
    }
  }

  @media (max-width: 768px) {
    display: block;
  }
}

// ── HERO ──────────────────────────────────────────────────────────────────────
.phb-hero {
  position: relative;
  padding: 7rem 1.5rem 4rem;
  overflow: hidden;
}

.phb-hero__bg {
  position: absolute;
  inset: 0;
  background: $PHB-NAVY-DARK;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(23, 24, 70, 0.7), rgba(40, 54, 69, 0.85));
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg,
        transparent,
        transparent 60px,
        rgba(255, 255, 255, 0.018) 60px,
        rgba(255, 255, 255, 0.018) 61px),
      repeating-linear-gradient(90deg,
        transparent,
        transparent 60px,
        rgba(255, 255, 255, 0.018) 60px,
        rgba(255, 255, 255, 0.018) 61px);
    pointer-events: none;
    z-index: 2;
  }
}

.phb-hero__grid {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 3rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.phb-hero__content {
  padding-top: 0.5rem;
}

.phb-hero__badge {
  display: inline-flex;
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $PHB-CYAN;
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  margin-bottom: 1.5rem;
}

.phb-hero__title {
  @include fonts.heading-font(800);
  font-size: clamp(2.2rem, 5.5vw, 3.4rem);
  color: $PHB-TEXT-1;
  margin: 0 0 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.phb-hero__accent {
  color: $PHB-CYAN;
}

.phb-hero__list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.92rem;
    color: $PHB-TEXT-2;
    line-height: 1.5;

    i {
      color: $PHB-CYAN;
      font-size: 0.82rem;
      flex-shrink: 0;
    }
  }
}

.phb-hero__sub {
  font-size: 0.85rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1.5rem;
}

.phb-hero__links {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.phb-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba($PHB-CYAN, 0.08);
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 10px;
  color: $PHB-CYAN;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;

  i {
    font-size: 0.8rem;
    transition: transform 0.2s;
  }

  &:hover {
    background: rgba($PHB-CYAN, 0.15);
    border-color: $PHB-CYAN;
    transform: translateY(-1px);

    i {
      transform: translateX(3px);
    }
  }
}

// ── FORM CARD ─────────────────────────────────────────────────────────────────
.phb-hero__form-wrap {
  position: sticky;
  top: 90px;
}

.phb-form-card {
  background: rgba(30, 34, 96, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $PHB-BORDER;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: $PHB-SHADOW-MD;
}

.phb-form-card__title {
  @include fonts.heading-font(700);
  font-size: 1.2rem;
  color: $PHB-TEXT-1;
  margin: 0 0 0.4rem;
}

.phb-form-card__sub {
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.phb-form-card__form {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.phb-field {
  position: relative;
  display: flex;
  align-items: center;

  &__icon {
    position: absolute;
    left: 1rem;
    color: $PHB-TEXT-3;
    font-size: 0.9rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.8rem;
    background: $PHB-SURFACE-2;
    border: 1px solid $PHB-BORDER;
    border-radius: 10px;
    color: $PHB-TEXT-1;
    font-family: fonts.$font-secondary;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;

    &::placeholder {
      color: $PHB-TEXT-3;
    }

    &:focus {
      border-color: $PHB-CYAN;
      background: color.adjust($PHB-SURFACE-2, $lightness: 2%);
    }

    &.error {
      border-color: $PHB-URGENT;
    }
  }

  &--phone {
    gap: 0.5rem;

    input {
      padding-left: 1rem;
      flex: 1;
      min-width: 0;
    }
  }
}

// ── Country Picker ──────────────────────────────────────────────────────────
.phb-phone-pick {
  position: relative;
  flex-shrink: 0;

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.85rem 0.7rem;
    background: $PHB-SURFACE-2;
    border: 1px solid $PHB-BORDER;
    border-radius: 10px;
    color: $PHB-TEXT-1;
    font-family: fonts.$font-secondary;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.2s;

    i {
      font-size: 0.6rem;
      color: $PHB-TEXT-3;
      margin-left: 0.15rem;
    }

    &:hover {
      border-color: $PHB-CYAN;
    }
  }

  &__flag {
    font-size: 1.15rem;
    line-height: 1;
  }

  &__code {
    font-weight: 600;
    font-size: 0.82rem;
  }

  &__drop {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 20;
    width: 210px;
    max-height: 220px;
    overflow-y: auto;
    background: $PHB-SURFACE;
    border: 1px solid $PHB-BORDER;
    border-radius: 12px;
    padding: 0.35rem;
    box-shadow: $PHB-SHADOW-MD;
  }

  &__opt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.55rem 0.7rem;
    background: none;
    border: none;
    border-radius: 8px;
    color: $PHB-TEXT-2;
    font-family: fonts.$font-secondary;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: rgba($PHB-CYAN, 0.08);
    }

    &.active {
      background: rgba($PHB-CYAN, 0.12);
      color: $PHB-TEXT-1;
      font-weight: 600;
    }
  }

  &__label {
    color: $PHB-TEXT-3;
    font-size: 0.78rem;
    margin-left: auto;
  }
}

.phb-field__error {
  font-size: 0.75rem;
  color: $PHB-URGENT-LIGHT;
  margin: 0 0 0.25rem 0.3rem;
}

.phb-form-card__btn {
  margin-top: 0.5rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
  color: $PHB-TEXT-1;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
}

.phb-form-card__foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: 1rem 0 0;
  font-size: 0.72rem;
  color: $PHB-TEXT-3;

  i {
    font-size: 0.68rem;
  }
}

// ── SECTION LABELS ────────────────────────────────────────────────────────────
.phb-section-label {
  font-family: fonts.$font-interface;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba($PHB-CYAN, 0.6);
  margin: 0 0 0.75rem;

  &--light {
    color: rgba(255, 255, 255, 0.45);
  }
}

.phb-section-title {
  @include fonts.heading-font(800);
  font-size: clamp(2rem, 4.5vw, 3rem);
  color: $PHB-TEXT-1;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.phb-section-sub {
  font-size: 1rem;
  color: $PHB-TEXT-3;
  margin: 0 0 2rem;
}

// ── DIFERENCIADOR ─────────────────────────────────────────────────────────────
.phb-dif {
  padding: 5rem 1.5rem;
  background: $PHB-MESH-GRADIENT, $PHB-BG-ALT;
  border-top: 1px solid $PHB-BORDER;
}

.phb-dif__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.phb-dif__intro {
  font-size: 0.95rem;
  color: $PHB-TEXT-2;
  line-height: 1.65;
  max-width: 680px;
  margin: 0 0 2.5rem;
}

.phb-dif__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.phb-dif__card {
  position: relative;
  background: $PHB-SURFACE;
  border: 1px solid $PHB-BORDER;
  border-radius: 16px;
  padding: 2rem 1.25rem;
  text-align: center;
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
  box-shadow: $PHB-SHADOW-XS;

  &:hover {
    background: $PHB-SURFACE-2;
    border-color: $PHB-BORDER-MEDIUM;
    transform: translateY(-3px);
  }
}

.phb-dif__num {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  @include fonts.heading-font(800);
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
  user-select: none;
}

.phb-dif__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba($PHB-CYAN, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border: 1px solid $PHB-BORDER;

  i {
    font-size: 1.3rem;
    color: $PHB-CYAN;
  }
}

.phb-dif__card-title {
  font-family: fonts.$font-principal;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: $PHB-TEXT-1;
  margin: 0 0 0.5rem;
}

.phb-dif__card-desc {
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  line-height: 1.5;
  margin: 0;
}

.phb-dif__cta-wrap {
  text-align: center;
  margin-top: 2.5rem;
}

.phb-dif__cta {
  display: inline-block;
  font-family: fonts.$font-interface;
  font-size: 0.85rem;
  font-weight: 600;
  color: $PHB-CYAN;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 999px;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: rgba($PHB-CYAN, 0.08);
    border-color: $PHB-CYAN;
  }
}

// ── FUNDADOR ──────────────────────────────────────────────────────────────────
.phb-founder {
  padding: 5rem 1.5rem;
  background: $PHB-NAVY-DARK;
  border-top: 1px solid $PHB-BORDER;
}

.phb-founder__inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.phb-founder__role {
  font-size: 1rem;
  color: $PHB-TEXT-2;
  margin: 0 0 2.5rem;
}

.phb-founder__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.phb-founder__photo-wrap {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid $PHB-BORDER-MEDIUM;
  box-shadow: 0 8px 32px rgba($PHB-CYAN, 0.12);
  flex-shrink: 0;
}

.phb-founder__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.phb-founder__stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.phb-founder__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  background: $PHB-SURFACE;
  border: 1px solid $PHB-BORDER;
  border-radius: 14px;
  min-width: 140px;
  box-shadow: $PHB-SHADOW-SM;
}

.phb-founder__stat-num {
  @include fonts.heading-font(800);
  font-size: 1.8rem;
  color: $PHB-CYAN;
  line-height: 1;
}

.phb-founder__stat-label {
  font-size: 0.75rem;
  color: $PHB-TEXT-3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.phb-founder__bio {
  font-size: 0.92rem;
  color: $PHB-TEXT-2;
  line-height: 1.7;
  margin: 0;
  max-width: 680px;
}

.phb-founder__links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.phb-founder__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.95rem 2rem;
  background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
  color: $PHB-TEXT-1;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.2);

  i {
    font-size: 0.78rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35);
  }
}

.phb-founder__link {
  font-size: 0.85rem;
  color: $PHB-BLUE-LIGHT;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: $PHB-CYAN;
  }
}

// ── RUTA 5 PASOS ──────────────────────────────────────────────────────────────
.phb-ruta {
  padding: 5rem 1.5rem;
  background: $PHB-BG-ALT;
  border-top: 1px solid $PHB-BORDER;
}

.phb-ruta__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.phb-ruta__track {
  display: flex;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.phb-ruta__step {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }
}

.phb-ruta__node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0;
    flex-shrink: 0;
  }
}

.phb-ruta__num {
  @include fonts.heading-font(800);
  font-size: 2.2rem;
  color: rgba($PHB-CYAN, 0.1);
  line-height: 1;
}

.phb-ruta__node-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $PHB-SURFACE;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $PHB-BORDER-MEDIUM;
  box-shadow: 0 4px 16px rgba($PHB-CYAN, 0.08);

  i {
    color: $PHB-CYAN;
    font-size: 1.2rem;
  }
}

.phb-ruta__connector {
  position: absolute;
  top: 48px;
  left: calc(50% + 36px);
  right: calc(-50% + 28px);
  height: 2px;
  background: linear-gradient(90deg, rgba($PHB-CYAN, 0.25), rgba($PHB-CYAN, 0.05));
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
}

.phb-ruta__step-body {
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
  }

  h3 {
    font-family: fonts.$font-principal;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: $PHB-TEXT-1;
    margin: 0 0 0.3rem;
  }

  p {
    font-size: 0.82rem;
    color: $PHB-TEXT-3;
    line-height: 1.45;
    margin: 0;
  }
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
.phb-cta {
  position: relative;
  padding: 5rem 1.5rem;
  background: $PHB-NAVY-DARK;
  overflow: hidden;
}

.phb-cta__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 35% at 50% 100%, rgba($PHB-CYAN, 0.04) 0%, transparent 70%),
    linear-gradient(180deg, rgba($PHB-NAVY-DARK, 0.5) 0%, $PHB-NAVY-DARK 100%);
  pointer-events: none;
}

.phb-cta__inner {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.phb-cta__callouts {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}

.phb-cta__callout {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  p {
    font-family: fonts.$font-interface;
    font-size: 0.85rem;
    font-weight: 600;
    color: $PHB-TEXT-2;
    margin: 0;
  }
}

.phb-cta__callout-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba($PHB-CYAN, 0.1);
  border: 1px solid $PHB-BORDER-MEDIUM;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: fonts.$font-interface;
  font-size: 0.75rem;
  font-weight: 800;
  color: $PHB-CYAN;
  flex-shrink: 0;
}

.phb-cta__title {
  @include fonts.heading-font(800);
  font-size: clamp(2rem, 4.5vw, 3rem);
  color: $PHB-TEXT-1;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.phb-cta__sub {
  font-size: 1rem;
  color: $PHB-TEXT-2;
  line-height: 1.65;
  max-width: 620px;
  margin: 0 auto 2rem;
}

.phb-cta__actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.phb-cta__btn {
  display: inline-flex;
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
  color: $PHB-TEXT-1;
  border: none;
  border-radius: 12px;
  font-family: fonts.$font-accent;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 24px rgba($PHB-CYAN, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba($PHB-CYAN, 0.35);
  }
}

.phb-cta__ws {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  background: #25d366;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(#25d366, 0.3);
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;

  i {
    font-size: 1.15rem;
  }

  &:hover {
    background: #20bd5a;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(#25d366, 0.45);
  }
}

.phb-cta__trust {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem 2.5rem;
  margin-top: 2.5rem;
}

.phb-cta__trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: $PHB-TEXT-3;

  i {
    color: $PHB-CYAN;
    font-size: 0.95rem;
    width: 20px;
    text-align: center;
  }
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
.phb-footer {
  background: color.adjust($PHB-NAVY-DARK, $lightness: -3%);
  padding: 3rem 1.5rem 2rem;
  border-top: 1px solid $PHB-BORDER;
}

.phb-footer__inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.phb-footer__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;

  img {
    height: 28px;
    width: auto;
  }

  span {
    @include fonts.heading-font(700);
    font-size: 1rem;
    color: $PHB-TEXT-2;
    letter-spacing: 0.06em;

    sup {
      font-size: 0.45em;
    }
  }
}

.phb-footer__byline {
  font-size: 0.78rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1.5rem;

  a {
    color: $PHB-CYAN;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $PHB-BLUE-LIGHT;
    }
  }
}

.phb-footer__legal {
  font-size: 0.75rem;
  color: $PHB-TEXT-3;
  line-height: 1.6;
  margin: 0 auto 2rem;
  max-width: 720px;
}

.phb-footer__links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  a {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $PHB-TEXT-2;
    }
  }
}

.phb-footer__copy {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.18);
  margin: 0;

  sup {
    font-size: 0.55em;
  }
}
</style>
