<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM

const totalSteps = 7
const step = ref(1)
const sending = ref(false)
const done = ref(false)
const errMsg = ref('')

type S1 = { nombre: string; edad: string; ciudad: string; email: string; telefono: string }
type S2 = {
  diagnostico: string[]; diagnosticoOtro: string
  tiempoCondicion: string; tomaMedicamentos: string; terapiasPrevias: string[]
}
type S3 = { impactoCalidad: string; preocupacion: string }
type S4 = { conocimiento: string; expectativas: string }
type S5 = { estres: string; descanso: string; situacion: string; entiendeGarantia: string }
type S6 = {
  invertirEnClaridad: string; situacionFinanciera: string; seguroMedico: string
  planOptimizacion: string; chequeos: string
}
type S7 = {
  tieneMedico: string; relacionMedico: string; recomendacionesMedico: string
  medicoMencionoRM: string; dispuestoCoordinar: string; confirmacion: string
}

const f1 = ref<S1>({ nombre: '', edad: '', ciudad: '', email: '', telefono: '' })
const f2 = ref<S2>({ diagnostico: [], diagnosticoOtro: '', tiempoCondicion: '', tomaMedicamentos: '', terapiasPrevias: [] })
const f3 = ref<S3>({ impactoCalidad: '', preocupacion: '' })
const f4 = ref<S4>({ conocimiento: '', expectativas: '' })
const f5 = ref<S5>({ estres: '', descanso: '', situacion: '', entiendeGarantia: '' })
const f6 = ref<S6>({ invertirEnClaridad: '', situacionFinanciera: '', seguroMedico: '', planOptimizacion: '', chequeos: '' })
const f7 = ref<S7>({ tieneMedico: '', relacionMedico: '', recomendacionesMedico: '', medicoMencionoRM: '', dispuestoCoordinar: '', confirmacion: '' })

const s1Ok = computed(() =>
  f1.value.nombre.length >= 2 && f1.value.edad.length > 0 && f1.value.ciudad.length >= 2 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f1.value.email) && f1.value.telefono.length >= 7
)
const s2Ok = computed(() => f2.value.diagnostico.length > 0 && f2.value.tiempoCondicion && f2.value.tomaMedicamentos && f2.value.terapiasPrevias.length > 0)
const s3Ok = computed(() => f3.value.impactoCalidad && f3.value.preocupacion)
const s4Ok = computed(() => f4.value.conocimiento && f4.value.expectativas.length >= 5)
const s5Ok = computed(() => f5.value.estres && f5.value.descanso && f5.value.situacion && f5.value.entiendeGarantia)
const s6Ok = computed(() => f6.value.invertirEnClaridad && f6.value.situacionFinanciera && f6.value.seguroMedico && f6.value.planOptimizacion && f6.value.chequeos)
const s7Ok = computed(() =>
  f7.value.tieneMedico && f7.value.relacionMedico && f7.value.recomendacionesMedico &&
  f7.value.medicoMencionoRM && f7.value.dispuestoCoordinar &&
  (f7.value.confirmacion === 'si_quiero_claridad' || f7.value.confirmacion === 'necesito_pensarlo')
)
const canProceed = computed(() => {
  if (step.value === 1) return s1Ok.value
  if (step.value === 2) return s2Ok.value
  if (step.value === 3) return s3Ok.value
  if (step.value === 4) return s4Ok.value
  if (step.value === 5) return s5Ok.value
  if (step.value === 6) return s6Ok.value
  return true
})

function next() { if (canProceed.value && step.value < totalSteps) step.value++ }
function prev() { if (step.value > 1) step.value-- }

function toggleDiag(v: string) {
  const a = f2.value.diagnostico
  const i = a.indexOf(v)
  i === -1 ? a.push(v) : a.splice(i, 1)
}
function toggleTerapia(v: string) {
  const a = f2.value.terapiasPrevias
  const i = a.indexOf(v)
  i === -1 ? a.push(v) : a.splice(i, 1)
}

async function submitForm() {
  if (!s7Ok.value) return
  sending.value = true
  errMsg.value = ''
  const payload = {
    ...f1.value, ...f2.value, ...f3.value, ...f4.value,
    ...f5.value, ...f6.value, ...f7.value,
    timestamp: Date.now(),
  }
  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    done.value = true
  } catch {
    errMsg.value = 'Error al enviar. Intenta de nuevo.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="form-page">
    <header class="form-page__header">
      <router-link to="/" class="form-page__logo">
        <span class="form-page__logo-text">POWERHOUSE <small>BIOTECH</small><sup>™</sup></span>
      </router-link>
      <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="form-page__top-link">
        VER POWERHOUSE BIOTECH
      </a>
    </header>

    <main v-if="!done" class="form-page__main">
      <div class="form-page__progress">
        <div class="form-page__progress-track">
          <div class="form-page__progress-fill" :style="{ width: (step / totalSteps) * 100 + '%' }"></div>
        </div>
        <span class="form-page__progress-label">Paso {{ step }} de {{ totalSteps }}</span>
      </div>

      <form @submit.prevent="submitForm" class="form">
        <!-- ════ STEP 1 ════ -->
        <div v-if="step === 1" class="form__step">
          <p class="form__badge">Health Decision Platform</p>
          <h1 class="form__title">¿Es la Medicina Regenerativa una alternativa segura para tu condición?</h1>
          <p class="form__desc">Este formulario nos permite evaluar si la medicina regenerativa es viable, coherente y segura para tu caso específico.</p>
          <p class="form__estimate"><i class="fa-regular fa-clock"></i> Tiempo estimado: 5–7 minutos</p>

          <fieldset class="form__section">
            <legend class="form__section-title">1️⃣ Información Básica</legend>
            <div class="form__field">
              <label>Nombre completo</label>
              <input v-model="f1.nombre" placeholder="Ej: Juan Pérez" />
            </div>
            <div class="form__row">
              <div class="form__field">
                <label>Edad</label>
                <input v-model="f1.edad" type="number" placeholder="Ej: 45" />
              </div>
              <div class="form__field">
                <label>Ciudad / País</label>
                <input v-model="f1.ciudad" placeholder="Ej: Ciudad de México, MX" />
              </div>
            </div>
            <div class="form__row">
              <div class="form__field">
                <label>Correo electrónico</label>
                <input v-model="f1.email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div class="form__field">
                <label>Teléfono / WhatsApp</label>
                <input v-model="f1.telefono" type="tel" placeholder="Ej: +52 55 1234 5678" />
              </div>
            </div>
          </fieldset>
        </div>

        <!-- ════ STEP 2 ════ -->
        <div v-if="step === 2" class="form__step">
          <h2 class="form__section-title">2️⃣ Tu Condición de Salud Actual</h2>

          <div v-for="opt in ['Diabetes','Hipertensión','Artritis / Problema articular','Enfermedad autoinmune','Enfermedad neurodegenerativa','Problema metabólico','Otro']" :key="opt" class="form__check">
            <label>
              <input type="checkbox" :checked="f2.diagnostico.includes(opt)" @change="toggleDiag(opt)" />
              {{ opt }}
            </label>
          </div>
          <div v-if="f2.diagnostico.includes('Otro')" class="form__field" style="margin-top:0.5rem">
            <input v-model="f2.diagnosticoOtro" placeholder="Especifica tu diagnóstico" />
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Cuánto tiempo llevas con esta condición?</p>
          <div v-for="o in ['Menos de 1 año','1-3 años','3-10 años','Más de 10 años']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f2.tiempoCondicion" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Actualmente tomas medicamentos?</p>
          <div v-for="o in ['Sí','No','Varios']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f2.tomaMedicamentos" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Has intentado otras terapias antes?</p>
          <div v-for="o in ['Medicina tradicional','Medicina alternativa','Suplementos','Terapias regenerativas','Varias combinadas','Ninguna']" :key="o" class="form__check">
            <label><input type="checkbox" :checked="f2.terapiasPrevias.includes(o)" @change="toggleTerapia(o)" /> {{ o }}</label>
          </div>
        </div>

        <!-- ════ STEP 3 ════ -->
        <div v-if="step === 3" class="form__step">
          <h2 class="form__section-title">3️⃣ Nivel de Impacto</h2>

          <p class="form__label">¿Cómo afecta esta condición tu calidad de vida?</p>
          <div v-for="o in ['Leve','Moderada','Alta','Severamente limitante']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f3.impactoCalidad" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Qué es lo que más te preocupa?</p>
          <div v-for="o in ['Dolor','Pérdida de función','Dependencia futura','No saber qué hacer','Empeoramiento progresivo']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f3.preocupacion" :value="o" /> {{ o }}</label>
          </div>
        </div>

        <!-- ════ STEP 4 ════ -->
        <div v-if="step === 4" class="form__step">
          <h2 class="form__section-title">4️⃣ Conocimiento sobre Medicina Regenerativa</h2>

          <p class="form__label">¿Qué tanto has escuchado o investigado sobre medicina regenerativa?</p>
          <div v-for="o in ['Muy poco, apenas estoy explorando','He leído información general','He investigado a profundidad','Ya he recibido terapias regenerativas','Tengo expectativas muy claras sobre lo que puede lograr']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f4.conocimiento" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Qué crees que puede lograr la medicina regenerativa en tu caso?</p>
          <textarea v-model="f4.expectativas" rows="4" placeholder="Escribe aquí..."></textarea>
        </div>

        <!-- ════ STEP 5 ════ -->
        <div v-if="step === 5" class="form__step">
          <h2 class="form__section-title">5️⃣ Estrés y Carga Laboral</h2>

          <p class="form__label">¿Cómo describirías tu nivel de estrés laboral actual?</p>
          <div v-for="o in ['Bajo','Moderado','Alto','Crónico / constante']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f5.estres" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Tu rutina diaria te permite descansar y recuperarte adecuadamente?</p>
          <div v-for="o in ['Sí','A veces','No']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f5.descanso" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <h2 class="form__section-title">6️⃣ Compromiso y Expectativas</h2>

          <p class="form__label">¿Cuál describe mejor tu situación actual?</p>
          <div v-for="o in ['Busco claridad antes de intervenir','Estoy confundido y necesito orientación estructurada','Estoy listo para evaluar medicina regenerativa','Busco una solución rápida']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f5.situacion" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Entiendes que la medicina regenerativa no es garantía universal?</p>
          <div v-for="o in ['Sí','No estoy seguro','Pensaba que sí lo era']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f5.entiendeGarantia" :value="o" /> {{ o }}</label>
          </div>
        </div>

        <!-- ════ STEP 6 ════ -->
        <div v-if="step === 6" class="form__step">
          <h2 class="form__section-title">7️⃣ Capacidad Decisional y Económica</h2>

          <p class="form__label">¿Estás dispuesto a invertir en claridad antes de tomar decisiones terapéuticas?</p>
          <div v-for="o in ['Sí','Necesito más información','No']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f6.invertirEnClaridad" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Cuál describe mejor tu situación financiera actual?</p>
          <div v-for="o in ['Estoy financieramente preparado para evaluar opciones avanzadas','Necesitaría planificar la inversión','No estoy en posición de invertir actualmente']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f6.situacionFinanciera" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Cuentas con seguro de gastos médicos privado?</p>
          <div v-for="o in ['Sí','No']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f6.seguroMedico" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <h2 class="form__section-title">8️⃣ Alternativa Responsable</h2>
          <p class="form__label">Si no calificas para tratamiento ahora, ¿estarías dispuesto a seguir un plan de optimización biológica de 90 días?</p>
          <div v-for="o in ['Sí, si es lo más responsable','Dependería del plan','No']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f6.planOptimizacion" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <h2 class="form__section-title">9️⃣ Seguimiento Médico</h2>
          <p class="form__label">¿Cada cuánto realizas chequeos médicos?</p>
          <div v-for="o in ['Anual','Semestral','Solo cuando hay síntomas','Rara vez']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f6.chequeos" :value="o" /> {{ o }}</label>
          </div>
        </div>

        <!-- ════ STEP 7 ════ -->
        <div v-if="step === 7" class="form__step">
          <h2 class="form__section-title">🏥 Relación con tu Médico Tratante</h2>

          <p class="form__label">¿Cuentas actualmente con un médico de cabecera o médico tratante principal?</p>
          <div v-for="o in ['Sí, tengo uno estable','Sí, pero consulto varios sin coordinación clara','No tengo médico de referencia','Solo consulto cuando hay crisis']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f7.tieneMedico" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Cómo describirías tu relación con tu médico actual?</p>
          <div v-for="o in ['Confianza alta y comunicación abierta','Confianza moderada','Distante / poco seguimiento','No me siento escuchado','Cambio frecuentemente de médico']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f7.relacionMedico" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Tu médico ha emitido recomendaciones específicas sobre tu condición actual?</p>
          <div v-for="o in ['Sí, tengo un plan claro','Sí, pero no ha funcionado como esperaba','Me han recomendado solo control farmacológico','Me han dicho que es normal para mi edad','No tengo recomendaciones claras']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f7.recomendacionesMedico" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">¿Tu médico ha mencionado medicina regenerativa como opción?</p>
          <div v-for="o in ['Sí','No','La descartó','No hemos hablado del tema']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f7.medicoMencionoRM" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <p class="form__label">Si tu médico considerara que primero necesitas estabilización metabólica, ¿estarías dispuesto a coordinar esa preparación?</p>
          <div v-for="o in ['Sí','Dependería del contexto','No']" :key="o" class="form__radio">
            <label><input type="radio" v-model="f7.dispuestoCoordinar" :value="o" /> {{ o }}</label>
          </div>

          <div class="form__divider"></div>

          <div class="form__confirm-box">
            <p class="form__confirm-disclaimer">🔒 PowerHouse Biotech no vende tratamientos ni promete resultados universales. Primero evaluamos elegibilidad.</p>
            <p class="form__label">¿Deseas avanzar a una evaluación estructurada?</p>
            <div v-for="o in [{v:'si_quiero_claridad',l:'Sí, quiero claridad antes de intervenir'},{v:'necesito_pensarlo',l:'Necesito pensarlo'}]" :key="o.v" class="form__radio">
              <label><input type="radio" v-model="f7.confirmacion" :value="o.v" /> {{ o.l }}</label>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="form__nav">
          <button v-if="step > 1" type="button" class="form__btn form__btn--back" @click="prev">
            <i class="fa-solid fa-arrow-left"></i> Anterior
          </button>
          <div class="form__nav-spacer"></div>
          <button v-if="step < totalSteps" type="button" class="form__btn form__btn--next" :disabled="!canProceed" @click="next">
            Siguiente <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else type="submit" class="form__btn form__btn--submit" :disabled="!s7Ok || sending">
            {{ sending ? 'Enviando...' : 'Enviar Evaluación' }}
          </button>
        </div>
        <p v-if="errMsg" class="form__error">{{ errMsg }}</p>
      </form>
    </main>

    <!-- ════ SUCCESS ════ -->
    <main v-else class="form-page__main form-page__main--done">
      <div class="form-page__done">
        <div class="form-page__done-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h2>Evaluación recibida</h2>
        <p>Gracias por completar el formulario. Nuestro equipo revisará tu información y te contactará para coordinar los siguientes pasos.</p>
        <div class="form-page__done-links">
          <router-link to="/" class="form-page__done-btn">Volver al inicio</router-link>
          <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="form-page__done-link">VER POWERHOUSE BIOTECH →</a>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/fonts.modules.scss' as fonts;

.form-page {
  min-height: 100vh;
  background: $PHB-BG;
  color: $PHB-TEXT-2;
  font-family: fonts.$font-secondary;
}

// ── Header ───────────────────────────────────────────────────────────────────
.form-page__header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba($PHB-NAVY-DARK, 0.94);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid $PHB-BORDER;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-page__logo {
  text-decoration: none;
  color: $PHB-TEXT-1;
}

.form-page__logo-text {
  @include fonts.heading-font(700);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  small { font-weight: 400; font-size: 0.85em; }
  sup { font-size: 0.5em; top: -0.6em; }
}

.form-page__top-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: $PHB-CYAN;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: $PHB-BLUE-LIGHT; }
}

// ── Progress ─────────────────────────────────────────────────────────────────
.form-page__progress {
  max-width: 640px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-page__progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.form-page__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $PHB-CYAN, $PHB-BLUE);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.form-page__progress-label {
  font-size: 0.78rem;
  color: $PHB-TEXT-3;
  white-space: nowrap;
  font-weight: 600;
}

// ── Main ──────────────────────────────────────────────────────────────────────
.form-page__main {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.form-page__main--done {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

// ── Form ──────────────────────────────────────────────────────────────────────
.form__step {
  animation: form-fade 0.3s ease;
}

@keyframes form-fade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form__badge {
  display: inline-flex;
  font-family: fonts.$font-interface;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $PHB-CYAN;
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  margin-bottom: 1rem;
}

.form__title {
  @include fonts.heading-font(800);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  color: $PHB-TEXT-1;
  margin: 0 0 0.75rem;
  line-height: 1.25;
}

.form__desc {
  font-size: 0.9rem;
  color: $PHB-TEXT-2;
  line-height: 1.6;
  margin: 0 0 0.5rem;
}

.form__estimate {
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  margin: 0 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  i { font-size: 0.78rem; }
}

// ── Sections ──────────────────────────────────────────────────────────────────
.form__section {
  border: none;
  padding: 0;
  margin: 0;
}

.form__section-title {
  @include fonts.heading-font(700);
  font-size: 1.15rem;
  color: $PHB-TEXT-1;
  margin: 0 0 1.25rem;
}

.form__divider {
  height: 1px;
  background: $PHB-BORDER;
  margin: 1.25rem 0;
}

.form__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: $PHB-TEXT-1;
  margin: 0 0 0.75rem;
}

// ── Field ─────────────────────────────────────────────────────────────────────
.form__field {
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: $PHB-TEXT-2;
    margin-bottom: 0.35rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    background: $PHB-SURFACE;
    border: 1px solid $PHB-BORDER;
    border-radius: 10px;
    color: $PHB-TEXT-1;
    font-family: fonts.$font-secondary;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    &::placeholder { color: $PHB-TEXT-3; }
    &:focus { border-color: $PHB-CYAN; }
  }

  textarea { resize: vertical; min-height: 100px; }
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 500px) { grid-template-columns: 1fr; }
}

// ── Radio / Check ─────────────────────────────────────────────────────────────
.form__radio, .form__check {
  margin-bottom: 0.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.88rem;
    color: $PHB-TEXT-2;
    cursor: pointer;
    padding: 0.6rem 1rem;
    background: $PHB-SURFACE;
    border: 1px solid $PHB-BORDER;
    border-radius: 10px;
    transition: background 0.2s, border-color 0.2s;
    &:hover { background: $PHB-SURFACE-2; }
  }

  input:checked + & label,
  input:checked ~ span { color: $PHB-TEXT-1; }

  input[type="radio"]:checked + label,
  input[type="checkbox"]:checked + label {
    background: rgba($PHB-CYAN, 0.08);
    border-color: $PHB-CYAN;
  }
}

.form__radio label { font-weight: 400; }

// ── Confirm ───────────────────────────────────────────────────────────────────
.form__confirm-box {
  background: rgba($PHB-CYAN, 0.04);
  border: 1px solid $PHB-BORDER-MEDIUM;
  border-radius: 16px;
  padding: 1.5rem;
}

.form__confirm-disclaimer {
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

// ── Navigation ────────────────────────────────────────────────────────────────
.form__nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
}

.form__nav-spacer { flex: 1; }

.form__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.8rem;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;

  i { font-size: 0.8rem; }
  &:disabled { opacity: 0.4; cursor: default; }

  &--back {
    background: transparent;
    color: $PHB-TEXT-2;
    border: 1px solid $PHB-BORDER;
    &:hover:not(:disabled) { background: $PHB-SURFACE; }
  }

  &--next {
    background: rgba($PHB-CYAN, 0.1);
    border: 1px solid $PHB-BORDER-MEDIUM;
    color: $PHB-CYAN;
    &:hover:not(:disabled) { background: rgba($PHB-CYAN, 0.18); }
  }

  &--submit {
    background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
    color: $PHB-TEXT-1;
    box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.2);
    &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35); }
  }
}

.form__error {
  text-align: center;
  color: $PHB-URGENT-LIGHT;
  font-size: 0.85rem;
  margin-top: 1rem;
}

// ── Done ──────────────────────────────────────────────────────────────────────
.form-page__done {
  text-align: center;
  max-width: 480px;
}

.form-page__done-icon {
  font-size: 3rem;
  color: $PHB-CYAN;
  margin-bottom: 1rem;
}

.form-page__done h2 {
  @include fonts.heading-font(800);
  font-size: 1.6rem;
  color: $PHB-TEXT-1;
  margin: 0 0 0.75rem;
}

.form-page__done p {
  font-size: 0.92rem;
  color: $PHB-TEXT-2;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.form-page__done-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.form-page__done-btn {
  display: inline-flex;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
  color: $PHB-TEXT-1;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.2);
  transition: transform 0.15s, box-shadow 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35); }
}

.form-page__done-link {
  font-size: 0.85rem;
  color: $PHB-CYAN;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: $PHB-BLUE-LIGHT; }
}
</style>
