<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const WEBHOOK = 'https://services.leadconnectorhq.com/hooks/P62nq2IVqxaQbOrD3P1R/webhook-trigger/rG4rYvva3xMz9mEx11Xq'

const data = ref({
  nombre: '', edad: '', ciudad: '', email: '', telefono: '+52 ',
  diagnostico: [] as string[], diagnosticoOtro: '',
  tiempoCondicion: '', tomaMedicamentos: '', terapiasPrevias: [] as string[],
  impactoCalidad: '', preocupacion: '',
  conocimiento: '', expectativas: '',
  estres: '', descanso: '', situacion: '', entiendeGarantia: '',
  invertirEnClaridad: '', situacionFinanciera: '', seguroMedico: '',
  planOptimizacion: '', chequeos: '',
  tieneMedico: '', relacionMedico: '', recomendacionesMedico: '',
  medicoMencionoRM: '', dispuestoCoordinar: '', confirmacion: '',
})

type QType = 'text' | 'tel' | 'email' | 'number' | 'radio' | 'checkbox' | 'textarea'
interface Question {
  key: string
  section: string
  sectionNum: number
  question: string
  sub?: string
  type: QType
  options?: { value: string; label: string }[]
  placeholder?: string
  multiKey?: string
  multiOtroKey?: string
  tip?: string
}

const questions: Question[] = [
  // ── SECCIÓN 1 ──
  { key: 'nombre', section: 'Información Básica', sectionNum: 1, question: '¿Cuál es tu nombre completo?', type: 'text', placeholder: 'Ej: Juan Pérez', tip: 'Tu nombre nos permite personalizar cada recomendación para ti.' },
  { key: 'edad', section: 'Información Básica', sectionNum: 1, question: '¿Cuántos años tienes?', type: 'number', placeholder: 'Ej: 45', tip: 'Tu edad biológica puede ser muy distinta a tu edad cronológica. La medicina regenerativa trabaja con la primera.' },
  { key: 'ciudad', section: 'Información Básica', sectionNum: 1, question: '¿En qué ciudad y país vives?', type: 'text', placeholder: 'Ej: Ciudad de México, MX', tip: 'Queremos confirmar si tienes acceso presencial a nuestros centros de evaluación.' },
  { key: 'email', section: 'Información Básica', sectionNum: 1, question: '¿Cuál es tu correo electrónico?', type: 'email', placeholder: 'correo@ejemplo.com', tip: 'Tus datos están protegidos con total confidencialidad. Solo los usaremos para tu evaluación.' },
  { key: 'telefono', section: 'Información Básica', sectionNum: 1, question: '¿Cuál es tu teléfono o WhatsApp?', type: 'tel', placeholder: 'Ej: +52 55 1234 5678', tip: 'Te contactaremos solo para coordinar tu evaluación, nada de spam.' },

  // ── SECCIÓN 2 ──
  { key: 'diagnostico', section: 'Tu Condición de Salud Actual', sectionNum: 2, question: '¿Cuál es tu diagnóstico principal?', sub: 'Selecciona todas las opciones que apliquen.', type: 'checkbox', multiKey: 'diagnostico', multiOtroKey: 'diagnosticoOtro', tip: 'Cada condición tiene un perfil biológico único. Identificarlo con precisión es el primer paso hacia la regeneración.', options: [
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Hipertensión', label: 'Hipertensión' },
    { value: 'Artritis / Problema articular', label: 'Artritis / Problema articular' },
    { value: 'Enfermedad autoinmune', label: 'Enfermedad autoinmune' },
    { value: 'Enfermedad neurodegenerativa', label: 'Enfermedad neurodegenerativa' },
    { value: 'Problema metabólico', label: 'Problema metabólico' },
    { value: 'Otro', label: 'Otro' },
  ]},
  { key: 'tiempoCondicion', section: 'Tu Condición de Salud Actual', sectionNum: 2, question: '¿Cuánto tiempo llevas con esta condición?', type: 'radio', tip: 'El factor tiempo es clave: mientras antes se intervenga, mayor es el potencial regenerativo del organismo.', options: [
    { value: 'Menos de 1 año', label: 'Menos de 1 año' },
    { value: '1-3 años', label: '1-3 años' },
    { value: '3-10 años', label: '3-10 años' },
    { value: 'Más de 10 años', label: 'Más de 10 años' },
  ]},
  { key: 'tomaMedicamentos', section: 'Tu Condición de Salud Actual', sectionNum: 2, question: '¿Actualmente tomas medicamentos?', type: 'radio', tip: 'Ciertos fármacos pueden influir en los protocolos regenerativos. Es importante conocer tu perfil farmacológico.', options: [
    { value: 'Sí', label: 'Sí' },
    { value: 'No', label: 'No' },
    { value: 'Varios', label: 'Varios' },
  ]},
  { key: 'terapiasPrevias', section: 'Tu Condición de Salud Actual', sectionNum: 2, question: '¿Has intentado otras terapias antes?', sub: 'Selecciona todas las que apliquen.', type: 'checkbox', multiKey: 'terapiasPrevias', tip: 'Saber qué has probado nos ayuda a no repetir caminos y enfocarnos en lo que realmente puede funcionar.', options: [
    { value: 'Medicina tradicional', label: 'Medicina tradicional' },
    { value: 'Medicina alternativa', label: 'Medicina alternativa' },
    { value: 'Suplementos', label: 'Suplementos' },
    { value: 'Terapias regenerativas', label: 'Terapias regenerativas' },
    { value: 'Varias combinadas', label: 'Varias combinadas' },
    { value: 'Ninguna', label: 'Ninguna' },
  ]},

  // ── SECCIÓN 3 ──
  { key: 'impactoCalidad', section: 'Nivel de Impacto', sectionNum: 3, question: '¿Cómo afecta esta condición tu calidad de vida?', type: 'radio', tip: 'La medicina regenerativa no busca solo aliviar síntomas, sino recuperar función y calidad de vida real.', options: [
    { value: 'Leve', label: '😌 Leve — Casi no me afecta' },
    { value: 'Moderada', label: '😐 Moderada — Molesta, pero funcional' },
    { value: 'Alta', label: '😣 Alta — Limita mis actividades' },
    { value: 'Severamente limitante', label: '😫 Severa — No puedo hacer mi vida normal' },
  ]},
  { key: 'preocupacion', section: 'Nivel de Impacto', sectionNum: 3, question: '¿Qué es lo que más te preocupa?', type: 'radio', tip: 'Identificar tu mayor preocupación nos permite enfocar la evaluación en lo que realmente importa para ti.', options: [
    { value: 'Dolor', label: 'El dolor' },
    { value: 'Pérdida de función', label: 'Perder mi capacidad funcional' },
    { value: 'Dependencia futura', label: 'Volverme dependiente' },
    { value: 'No saber qué hacer', label: 'No tener claridad sobre qué hacer' },
    { value: 'Empeoramiento progresivo', label: 'Que siga empeorando' },
  ]},

  // ── SECCIÓN 4 ──
  { key: 'conocimiento', section: 'Conocimiento sobre Medicina Regenerativa', sectionNum: 4, question: '¿Qué tanto has investigado sobre medicina regenerativa?', sub: 'Células madre, exosomas, péptidos, sueroterapia…', type: 'radio', tip: 'No necesitas ser un experto. Nosotros te guiamos con información clara y basada en ciencia.', options: [
    { value: 'Muy poco, apenas estoy explorando', label: '🌱 Muy poco, estoy explorando' },
    { value: 'He leído información general', label: '📖 He leído información general' },
    { value: 'He investigado a profundidad', label: '🔬 He investigado a profundidad' },
    { value: 'Ya he recibido terapias regenerativas', label: '💉 Ya recibí terapias antes' },
    { value: 'Tengo expectativas muy claras', label: '🎯 Tengo expectativas claras' },
  ]},
  { key: 'expectativas', section: 'Conocimiento sobre Medicina Regenerativa', sectionNum: 4, question: '¿Qué crees que puede lograr la medicina regenerativa en tu caso?', type: 'textarea', placeholder: 'Cuéntanos con tus palabras…', tip: 'Tus expectativas son el punto de partida para una evaluación honesta y alineada con la realidad científica.' },

  // ── SECCIÓN 5 ──
  { key: 'estres', section: 'Estrés y Carga Laboral', sectionNum: 5, question: '¿Cómo describirías tu nivel de estrés laboral actual?', type: 'radio', tip: 'El estrés crónico acelera el envejecimiento celular. Por eso es parte fundamental de cualquier evaluación regenerativa.', options: [
    { value: 'Bajo', label: '😌 Bajo' },
    { value: 'Moderado', label: '😐 Moderado' },
    { value: 'Alto', label: '😰 Alto' },
    { value: 'Crónico / constante', label: '🔥 Crónico / constante' },
  ]},
  { key: 'descanso', section: 'Estrés y Carga Laboral', sectionNum: 5, question: '¿Tu rutina diaria te permite descansar y recuperarte adecuadamente?', type: 'radio', tip: 'El sueño profundo es cuando el cuerpo activa sus mecanismos de reparación celular. Sin descanso, la regeneración se dificulta.', options: [
    { value: 'Sí', label: '✅ Sí' },
    { value: 'A veces', label: '⚠️ A veces' },
    { value: 'No', label: '❌ No' },
  ]},

  // ── SECCIÓN 6 ──
  { key: 'situacion', section: 'Compromiso y Expectativas', sectionNum: 6, question: '¿Cuál describe mejor tu situación actual?', type: 'radio', tip: 'La claridad es el primer paso hacia una decisión informada. No importa en qué etapa estés, lo importante es empezar.', options: [
    { value: 'Busco claridad antes de intervenir', label: '🧭 Busco claridad antes de decidir' },
    { value: 'Estoy confundido y necesito orientación', label: '🤔 Estoy confundido, necesito guía' },
    { value: 'Estoy listo para evaluar medicina regenerativa', label: '✅ Listo para evaluar opciones' },
    { value: 'Busco una solución rápida', label: '⚡ Busco una solución rápida' },
  ]},
  { key: 'entiendeGarantia', section: 'Compromiso y Expectativas', sectionNum: 6, question: '¿Entiendes que la medicina regenerativa no es una garantía universal?', sub: 'Los resultados varían según cada persona.', type: 'radio', tip: 'No prometemos milagros, prometemos honestidad científica. La regeneración depende de tu biología única.', options: [
    { value: 'Sí', label: '✅ Sí, lo entiendo' },
    { value: 'No estoy seguro', label: '🤷‍♂️ No estoy seguro' },
    { value: 'Pensaba que sí lo era', label: '🔍 Pensaba que era garantía' },
  ]},

  // ── SECCIÓN 7 ──
  { key: 'invertirEnClaridad', section: 'Capacidad Decisional y Económica', sectionNum: 7, question: '¿Estás dispuesto a invertir en claridad antes de tomar decisiones terapéuticas?', sub: 'La evaluación DECIDE™ es una sesión estructurada especializada.', type: 'radio', tip: 'Invertir en diagnóstico antes que en tratamiento es la decisión más inteligente y rentable a largo plazo.', options: [
    { value: 'Sí', label: '✅ Sí' },
    { value: 'Necesito más información', label: 'ℹ️ Necesito más información' },
    { value: 'No', label: '❌ No' },
  ]},
  { key: 'situacionFinanciera', section: 'Capacidad Decisional y Económica', sectionNum: 7, question: '¿Cuál describe mejor tu situación financiera actual?', sub: 'Los tratamientos regenerativos pueden representar una inversión significativa.', type: 'radio', tip: 'La transparencia financiera es parte de nuestro compromiso. Te ayudamos a evaluar opciones realistas para ti.', options: [
    { value: 'Estoy financieramente preparado', label: '💰 Preparado para evaluar opciones avanzadas' },
    { value: 'Necesitaría planificar la inversión', label: '📋 Necesitaría planificar' },
    { value: 'No estoy en posición de invertir', label: '🔴 No puedo invertir actualmente' },
  ]},
  { key: 'seguroMedico', section: 'Capacidad Decisional y Económica', sectionNum: 7, question: '¿Cuentas con seguro de gastos médicos privado?', type: 'radio', tip: 'Algunos seguros médicos cubren parte de la evaluación diagnóstica. Vale la pena verificarlo.', options: [
    { value: 'Sí', label: '✅ Sí' },
    { value: 'No', label: '❌ No' },
  ]},

  // ── SECCIÓN 8 ──
  { key: 'planOptimizacion', section: 'Alternativa Responsable', sectionNum: 8, question: 'Si no calificas para tratamiento ahora, ¿seguirías un plan de optimización biológica de 90 días?', sub: 'Mejorar tu entorno metabólico y sistémico antes de intervenir.', type: 'radio', tip: 'A veces preparar el terreno biológico es más importante que intervenir directamente. La paciencia estratégica da resultados.', options: [
    { value: 'Sí, si es lo más responsable', label: '✅ Sí, si es lo correcto' },
    { value: 'Dependería del plan', label: '🤔 Dependería del plan' },
    { value: 'No', label: '❌ No' },
  ]},

  // ── SECCIÓN 9 ──
  { key: 'chequeos', section: 'Seguimiento Médico', sectionNum: 9, question: '¿Cada cuánto realizas chequeos médicos?', type: 'radio', tip: 'La prevención y el monitoreo constante son la base de la longevidad. No esperes a tener síntomas para conocerte.', options: [
    { value: 'Anual', label: '📅 Anual' },
    { value: 'Semestral', label: '📅 Semestral' },
    { value: 'Solo cuando hay síntomas', label: '🆘 Solo cuando hay síntomas' },
    { value: 'Rara vez', label: '⏳ Rara vez' },
  ]},

  // ── SECCIÓN 10 ──
  { key: 'tieneMedico', section: 'Relación con tu Médico Tratante', sectionNum: 10, question: '¿Cuentas con un médico de cabecera o tratante principal?', type: 'radio', tip: 'La coordinación entre tu médico y nuestro equipo multiplica las probabilidades de éxito del plan regenerativo.', options: [
    { value: 'Sí, tengo uno estable', label: '👨‍⚕️ Sí, tengo médico estable' },
    { value: 'Sí, consulto varios sin coordinación', label: '🔄 Varios sin coordinación' },
    { value: 'No tengo médico de referencia', label: '❌ No tengo médico' },
    { value: 'Solo consulto cuando hay crisis', label: '🚨 Solo en crisis' },
  ]},
  { key: 'relacionMedico', section: 'Relación con tu Médico Tratante', sectionNum: 10, question: '¿Cómo describirías tu relación con tu médico actual?', type: 'radio', tip: 'La confianza con tu médico de cabecera es clave. No buscamos reemplazarlo, sino sumar una capa especializada.', options: [
    { value: 'Confianza alta', label: '🤝 Confianza alta y comunicación abierta' },
    { value: 'Confianza moderada', label: '👍 Confianza moderada' },
    { value: 'Distante', label: '👋 Distante / poco seguimiento' },
    { value: 'No me siento escuchado', label: '😤 No me siento escuchado' },
    { value: 'Cambio frecuentemente de médico', label: '🔄 Cambio frecuente de médico' },
  ]},
  { key: 'recomendacionesMedico', section: 'Relación con tu Médico Tratante', sectionNum: 10, question: '¿Tu médico ha emitido recomendaciones específicas sobre tu condición?', type: 'radio', tip: 'A veces el sistema de salud no tiene todas las respuestas. La medicina regenerativa abre opciones que muchos especialistas aún no contemplan.', options: [
    { value: 'Sí, tengo un plan claro', label: '📋 Sí, tengo un plan claro' },
    { value: 'Sí, pero no ha funcionado', label: '⚠️ Sí, pero no funcionó' },
    { value: 'Solo control farmacológico', label: '💊 Solo control farmacológico' },
    { value: 'Me dijeron que es normal para mi edad', label: '👴 "Es normal para mi edad"' },
    { value: 'No tengo recomendaciones claras', label: '❓ No tengo claridad' },
  ]},
  { key: 'medicoMencionoRM', section: 'Relación con tu Médico Tratante', sectionNum: 10, question: '¿Tu médico ha mencionado la medicina regenerativa como opción?', type: 'radio', tip: 'Muchos médicos aún no conocen el potencial real de la medicina regenerativa. Nosotros colaboramos con ellos para cerrar esa brecha.', options: [
    { value: 'Sí', label: '✅ Sí' },
    { value: 'No', label: '❌ No' },
    { value: 'La descartó', label: '🚫 La descartó' },
    { value: 'No hemos hablado del tema', label: '🤐 No lo hemos hablado' },
  ]},
  { key: 'dispuestoCoordinar', section: 'Relación con tu Médico Tratante', sectionNum: 10, question: '¿Estarías dispuesto a coordinar una preparación metabólica si tu médico lo recomienda?', sub: 'Antes de evaluar regeneración.', type: 'radio', tip: 'El enfoque multidisciplinario multiplica los resultados. Trabajamos en conjunto con tu médico, no por encima de él.', options: [
    { value: 'Sí', label: '✅ Sí' },
    { value: 'Dependería del contexto', label: '🤔 Depende del contexto' },
    { value: 'No', label: '❌ No' },
  ]},

  // ── CONFIRMACIÓN ──
  { key: 'confirmacion', section: 'Confirmación Final', sectionNum: 11, question: '¿Deseas avanzar a una evaluación estructurada?', sub: 'PowerHouse Biotech no vende tratamientos ni promete resultados universales. Primero evaluamos elegibilidad.', type: 'radio', tip: 'No se trata de venderte nada. Se trata de darte claridad real sobre si la medicina regenerativa es adecuada para ti.', options: [
    { value: 'si_quiero_claridad', label: '✅ Sí, quiero claridad antes de intervenir' },
    { value: 'necesito_pensarlo', label: '⏸️ Necesito pensarlo' },
  ]},
]

onMounted(() => {
  const q = route.query
  if (q.nombre) data.value.nombre = q.nombre as string
  if (q.email) data.value.email = q.email as string
  if (q.telefono) data.value.telefono = q.telefono as string
})

const total = questions.length
const idx = ref(0)
const dir = ref<'fwd' | 'back'>('fwd')
const sending = ref(false)
const done = ref(false)
const errMsg = ref('')

const current = computed(() => questions[idx.value])
const progress = computed(() => ((idx.value + 1) / total) * 100)
const isLast = computed(() => idx.value >= total - 1)
const isFirst = computed(() => idx.value <= 0)

function onTelInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const prefix = '+52 '
  if (!raw.startsWith(prefix)) { data.value.telefono = prefix; return }
  data.value.telefono = raw
}

function value(key: string): any {
  return (data.value as any)[key]
}
function setValue(key: string, v: any) {
  ;(data.value as any)[key] = v
}

function toggleMulti(arrKey: string, val: string) {
  const a = data.value[arrKey as keyof typeof data.value] as unknown as string[]
  const i = a.indexOf(val)
  if (i === -1) a.push(val)
  else a.splice(i, 1)
}
function isChecked(arrKey: string, val: string) {
  const a = data.value[arrKey as keyof typeof data.value] as unknown as string[]
  return a.includes(val)
}

function isValid(q: Question): boolean {
  const v = value(q.key)
  if (q.type === 'text') return typeof v === 'string' && v.trim().length >= 2
  if (q.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v ?? '')
  if (q.type === 'tel') return typeof v === 'string' && v.trim().length >= 7
  if (q.type === 'number') return typeof v === 'string' && v.trim().length > 0
  if (q.type === 'radio') return !!v
  if (q.type === 'textarea') return typeof v === 'string' && v.trim().length >= 5
  if (q.type === 'checkbox') {
    const a = value(q.key) as string[]
    if (!q.multiKey) return false
    const arr = data.value[q.multiKey as keyof typeof data.value] as string[]
    if (arr.length === 0) return false
    if (q.multiOtroKey && arr.includes('Otro')) {
      const otro = data.value[q.multiOtroKey as keyof typeof data.value] as string
      return otro.trim().length >= 2
    }
    return true
  }
  return false
}

async function sendStepUpdate() {
  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data.value, paso: idx.value + 1, pregunta: current.value.key }),
    })
  } catch {}
}

function next() {
  if (!isValid(current.value)) return
  sendStepUpdate()
  if (isLast.value) { submitForm(); return }
  dir.value = 'fwd'
  idx.value++
}
function prev() {
  if (isFirst.value) return
  dir.value = 'back'
  idx.value--
}

async function submitForm() {
  sending.value = true
  errMsg.value = ''
  const payload = { ...data.value, timestamp: Date.now() }
  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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
  <div class="fp">
    <header class="fp__header">
      <router-link to="/" class="fp__logo">
        POWERHOUSE <small>BIOTECH</small><sup>™</sup>
      </router-link>
      <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="fp__top-link">
        VER POWERHOUSE BIOTECH
      </a>
    </header>

    <main v-if="!done" class="fp__main">
      <!-- Progress -->
      <div class="fp__progress">
        <div class="fp__progress-bar">
          <div class="fp__progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="fp__progress-text">Paso {{ idx + 1 }} de {{ total }}</span>
      </div>

      <div class="fp__section-badge">Sección {{ current.sectionNum }} — {{ current.section }}</div>

      <!-- Question -->
      <transition :name="dir" mode="out-in">
        <div class="fp__card" :key="idx">

          <p v-if="current.tip" class="fp__tip"><i class="fa-solid fa-lightbulb"></i> {{ current.tip }}</p>

          <!-- Text / Email / Tel / Number -->
          <template v-if="['text','email','tel','number'].includes(current.type)">
            <h2 class="fp__question">{{ current.question }}</h2>
            <div class="fp__field">
              <input
                :type="current.type === 'email' ? 'email' : current.type === 'tel' ? 'tel' : current.type === 'number' ? 'number' : 'text'"
                :placeholder="current.placeholder"
                :value="current.key === 'telefono' ? data.telefono : value(current.key)"
                @input="current.key === 'telefono' ? onTelInput($event) : setValue(current.key, ($event.target as HTMLInputElement).value)"
                @keydown.enter="next"
                autofocus
              />
            </div>
          </template>

          <!-- Textarea -->
          <template v-else-if="current.type === 'textarea'">
            <p v-if="current.tip" class="fp__tip"><i class="fa-solid fa-lightbulb"></i> {{ current.tip }}</p>
            <h2 class="fp__question">{{ current.question }}</h2>
            <div class="fp__field">
              <textarea
                :placeholder="current.placeholder"
                :value="value(current.key)"
                @input="setValue(current.key, ($event.target as HTMLTextAreaElement).value)"
                rows="4"
              ></textarea>
            </div>
          </template>

          <!-- Radio -->
          <template v-else-if="current.type === 'radio'">
            <p v-if="current.tip" class="fp__tip"><i class="fa-solid fa-lightbulb"></i> {{ current.tip }}</p>
            <h2 class="fp__question">{{ current.question }}</h2>
            <p v-if="current.sub" class="fp__sub">{{ current.sub }}</p>
            <div class="fp__options">
              <label
                v-for="o in current.options"
                :key="o.value"
                class="fp__option"
                :class="{ active: value(current.key) === o.value }"
              >
                <input
                  type="radio"
                  :name="current.key"
                  :value="o.value"
                  :checked="value(current.key) === o.value"
                  @change="setValue(current.key, o.value)"
                />
                <span class="fp__option-dot"></span>
                <span class="fp__option-label">{{ o.label }}</span>
              </label>
            </div>
          </template>

          <!-- Checkbox (multi-select) -->
          <template v-else-if="current.type === 'checkbox'">
            <p v-if="current.tip" class="fp__tip"><i class="fa-solid fa-lightbulb"></i> {{ current.tip }}</p>
            <h2 class="fp__question">{{ current.question }}</h2>
            <p v-if="current.sub" class="fp__sub">{{ current.sub }}</p>
            <div class="fp__options">
              <label
                v-for="o in current.options"
                :key="o.value"
                class="fp__option"
                :class="{ active: isChecked(current.multiKey!, o.value) }"
              >
                <input
                  type="checkbox"
                  :checked="isChecked(current.multiKey!, o.value)"
                  @change="toggleMulti(current.multiKey!, o.value)"
                />
                <span class="fp__option-box">
                  <i class="fa-solid fa-check"></i>
                </span>
                <span class="fp__option-label">{{ o.label }}</span>
              </label>
            </div>
            <div v-if="current.multiOtroKey && isChecked(current.multiKey!, 'Otro')" class="fp__field" style="margin-top: 0.75rem">
              <input
                v-model="(data as any)[current.multiOtroKey]"
                placeholder="Especifica tu diagnóstico"
              />
            </div>
          </template>

          <!-- Navigation -->
          <div class="fp__nav">
            <button v-if="!isFirst" type="button" class="fp__btn fp__btn--back" @click="prev">
              <i class="fa-solid fa-arrow-left"></i> Anterior
            </button>
            <div class="fp__nav-spacer"></div>
            <button
              type="button"
              class="fp__btn fp__btn--next"
              :class="{ 'fp__btn--submit': isLast }"
              :disabled="!isValid(current) || sending"
              @click="next"
            >
              <template v-if="isLast">
                {{ sending ? 'Enviando…' : 'Enviar Evaluación' }}
              </template>
              <template v-else>
                Siguiente <i class="fa-solid fa-arrow-right"></i>
              </template>
            </button>
          </div>
          <p v-if="errMsg" class="fp__error">{{ errMsg }}</p>
        </div>
      </transition>
    </main>

    <!-- Done -->
    <main v-else class="fp__main fp__main--done">
      <div class="fp__done">
        <div class="fp__done-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h2 class="fp__done-title">Evaluación recibida</h2>
        <p class="fp__done-text">Gracias por completar el formulario. Nuestro equipo revisará tu información y te contactará para coordinar los siguientes pasos.</p>
        <div class="fp__done-links">
          <router-link to="/" class="fp__done-btn">Volver al inicio</router-link>
          <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="fp__done-link">VER POWERHOUSE BIOTECH →</a>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/fonts.modules.scss' as fonts;

.fp {
  min-height: 100vh;
  background: $PHB-BG;
  color: $PHB-TEXT-2;
  font-family: fonts.$font-secondary;
  overflow-x: hidden;
}

// ── Header ───────────────────────────────────────────────────────────────────
.fp__header {
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

.fp__logo {
  text-decoration: none;
  color: $PHB-TEXT-1;
  @include fonts.heading-font(700);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  small { font-weight: 400; font-size: 0.85em; }
  sup { font-size: 0.5em; top: -0.6em; }
}

.fp__top-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: $PHB-CYAN;
  text-decoration: none;
  &:hover { color: $PHB-BLUE-LIGHT; }
}

// ── Main ──────────────────────────────────────────────────────────────────────
.fp__main {
  max-width: 560px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.fp__main--done {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

// ── Progress ──────────────────────────────────────────────────────────────────
.fp__progress {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.fp__progress-bar {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 999px;
  overflow: hidden;
}

.fp__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $PHB-CYAN, $PHB-BLUE);
  border-radius: 999px;
  transition: width 0.45s ease;
}

.fp__progress-text {
  font-size: 0.75rem;
  color: $PHB-TEXT-3;
  white-space: nowrap;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

// ── Section badge ─────────────────────────────────────────────────────────────
.fp__section-badge {
  display: inline-flex;
  font-family: fonts.$font-interface;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba($PHB-CYAN, 0.6);
  border: 1px solid $PHB-BORDER;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  margin-bottom: 1.5rem;
}

// ── Card ──────────────────────────────────────────────────────────────────────
.fp__card {
  background: $PHB-SURFACE;
  border: 1px solid $PHB-BORDER;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: $PHB-SHADOW-SM;
}

.fp__tip {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.78rem;
  color: rgba($PHB-CYAN, 0.7);
  margin: 0 0 1rem;
  line-height: 1.45;
  i {
    font-size: 0.7rem;
    margin-top: 0.2rem;
    color: $PHB-CYAN;
    flex-shrink: 0;
  }
}

.fp__question {
  @include fonts.heading-font(700);
  font-size: 1.2rem;
  color: $PHB-TEXT-1;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.fp__sub {
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

// ── Field ─────────────────────────────────────────────────────────────────────
.fp__field {
  input, textarea {
    width: 100%;
    padding: 0.9rem 1.1rem;
    background: $PHB-SURFACE-2;
    border: 1px solid $PHB-BORDER;
    border-radius: 12px;
    color: $PHB-TEXT-1;
    font-family: fonts.$font-secondary;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    &::placeholder { color: $PHB-TEXT-3; }
    &:focus { border-color: $PHB-CYAN; background: color.adjust($PHB-SURFACE-2, $lightness: 2%); }
  }
  textarea { resize: vertical; min-height: 110px; }
}

// ── Options ───────────────────────────────────────────────────────────────────
.fp__options {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1rem;
}

.fp__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  background: $PHB-SURFACE-2;
  border: 1.5px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  user-select: none;

  &:hover {
    background: color.adjust($PHB-SURFACE-2, $lightness: 4%);
    border-color: rgba($PHB-CYAN, 0.15);
  }

  &.active {
    background: rgba($PHB-CYAN, 0.08);
    border-color: $PHB-CYAN;
  }

  input { display: none; }
}

.fp__option-label {
  font-size: 0.92rem;
  color: $PHB-TEXT-2;
  line-height: 1.3;
  .fp__option.active & { color: $PHB-TEXT-1; font-weight: 600; }
}

// Radio dot
.fp__option-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid $PHB-BORDER;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;

  .fp__option.active & {
    border-color: $PHB-CYAN;
    background: $PHB-CYAN;
    box-shadow: 0 0 0 3px rgba($PHB-CYAN, 0.15);
  }
}

// Checkbox box
.fp__option-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid $PHB-BORDER;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
  font-size: 0.65rem;
  color: transparent;

  .fp__option.active & {
    border-color: $PHB-CYAN;
    background: $PHB-CYAN;
    color: $PHB-TEXT-1;
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
.fp__nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.fp__nav-spacer { flex: 1; }

.fp__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
  i { font-size: 0.78rem; }
  &:disabled { opacity: 0.35; cursor: default; }

  &--back {
    background: transparent;
    color: $PHB-TEXT-3;
    border: 1px solid $PHB-BORDER;
    &:hover:not(:disabled) { background: $PHB-SURFACE; color: $PHB-TEXT-2; }
  }

  &--next {
    background: rgba($PHB-CYAN, 0.08);
    border: 1px solid $PHB-BORDER-MEDIUM;
    color: $PHB-CYAN;
    &:hover:not(:disabled) { background: rgba($PHB-CYAN, 0.15); }
  }

  &--submit {
    background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
    color: $PHB-TEXT-1;
    border-color: transparent;
    box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.2);
    &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35); }
  }
}

.fp__error {
  text-align: center;
  color: $PHB-URGENT-LIGHT;
  font-size: 0.85rem;
  margin-top: 1rem;
}

// ── Transitions ───────────────────────────────────────────────────────────────
.fwd-enter-active, .fwd-leave-active,
.back-enter-active, .back-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.fwd-enter-from { opacity: 0; transform: translateX(40px); }
.fwd-leave-to { opacity: 0; transform: translateX(-40px); }
.back-enter-from { opacity: 0; transform: translateX(-40px); }
.back-leave-to { opacity: 0; transform: translateX(40px); }

// ── Done ──────────────────────────────────────────────────────────────────────
.fp__done {
  text-align: center;
  max-width: 440px;
}

.fp__done-icon {
  font-size: 3.2rem;
  color: $PHB-CYAN;
  margin-bottom: 1rem;
}

.fp__done-title {
  @include fonts.heading-font(800);
  font-size: 1.5rem;
  color: $PHB-TEXT-1;
  margin: 0 0 0.75rem;
}

.fp__done-text {
  font-size: 0.92rem;
  color: $PHB-TEXT-2;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.fp__done-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.fp__done-btn {
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

.fp__done-link {
  font-size: 0.85rem;
  color: $PHB-CYAN;
  text-decoration: none;
  &:hover { color: $PHB-BLUE-LIGHT; }
}
</style>
