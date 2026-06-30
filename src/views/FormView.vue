<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM
const STEP_WEBHOOK = import.meta.env.VITE_WEBHOOK_FORM_STEP
const LEAD_NOTE = [
  '🧬 Cuestionario PHB completado',
  '🏁 Estado: finalizado',
  '✅ Acción: contacto actualizado con respuestas completas',
].join('\n')
const PROGRESS_NOTE_PREFIX = 'Progreso del formulario'

interface QuestionItem {
  id: number
  section: number
  text: string
  interpretation: string
  biomarkers: string
}

interface SectionData {
  id: number
  title: string
  questions: QuestionItem[]
}

const sectionsData: SectionData[] = [
  {
    id: 1,
    title: 'I. Salud metabólica',
    questions: [
      { id: 1, section: 1, text: 'Después de consumir pan, arroz, pasta, postres o bebidas azucaradas, ¿presenta sueño, cansancio, hambre o dificultad para concentrarse?', interpretation: 'Respuesta glucémica ineficiente o señales compatibles con resistencia a la insulina.', biomarkers: 'Glucosa en ayunas, HbA1c, insulina, HOMA-IR, HOMA-B, TyG y METS-IR.' },
      { id: 2, section: 1, text: '¿Ha aumentado de peso principalmente alrededor del abdomen o le resulta difícil reducir cintura aun cuando intenta comer menos?', interpretation: 'Adiposidad central asociada con deterioro de la sensibilidad a la insulina.', biomarkers: 'BMI, insulina, HOMA-IR, TyG-BMI, METS-IR, triglicéridos, HDL y TG/HDL.' },
      { id: 3, section: 1, text: '¿Siente hambre nuevamente menos de tres horas después de comer o necesita consumir azúcar, café o carbohidratos para recuperar energía?', interpretation: 'Inestabilidad energética, hiperinsulinemia compensatoria o mala selección de alimentos.', biomarkers: 'Glucosa, insulina, HbA1c, HOMA-IR, HOMA-B y TyG.' },
      { id: 4, section: 1, text: '¿Ha presentado sed excesiva, necesidad de orinar con frecuencia, visión borrosa o pérdida inexplicable de peso?', interpretation: 'Posible desregulación glucémica que requiere evaluación clínica prioritaria.', biomarkers: 'Glucosa en ayunas, HbA1c, glucosa en orina, cetonas en orina y osmolalidad sérica estimada.' },
      { id: 5, section: 1, text: '¿Tiene antecedentes personales o familiares de prediabetes, diabetes, hígado graso, obesidad o síndrome metabólico?', interpretation: 'Mayor predisposición cardiometabólica y necesidad de vigilancia longitudinal.', biomarkers: 'Glucosa, HbA1c, insulina, HOMA-IR, TyG, TyG-BMI, METS-IR, triglicéridos y HDL.' },
    ],
  },
  {
    id: 2,
    title: 'II. Salud cardiovascular',
    questions: [
      { id: 6, section: 2, text: '¿Experimenta presión o dolor en el pecho, falta de aire, mareo o fatiga desproporcionada al caminar o subir escaleras?', interpretation: 'Señal de alerta cardiovascular; no debe esperarse al resultado del panel para buscar valoración médica.', biomarkers: 'ApoB, LDL, non-HDL, colesterol remanente, triglicéridos, Lp(a), PCR y AIP.' },
      { id: 7, section: 2, text: '¿Le han diagnosticado presión arterial elevada o registra mediciones superiores a las recomendadas?', interpretation: 'Mayor carga vascular, renal y metabólica.', biomarkers: 'Glucosa, HbA1c, creatinina, eGFR, ACR urinaria, ácido úrico, sodio, potasio y Na/K.' },
      { id: 8, section: 2, text: '¿Algún familiar directo presentó infarto, embolia o enfermedad cardiovascular a una edad temprana?', interpretation: 'Posible riesgo hereditario que no siempre se refleja únicamente en el colesterol convencional.', biomarkers: 'Lp(a), ApoB, LDL, non-HDL, AC, AIP, Chol/HDL y LDL/HDL.' },
      { id: 9, section: 2, text: '¿Fuma, vapea, permanece sentado gran parte del día o realiza menos de 150 minutos de actividad física por semana?', interpretation: 'Exposición conductual asociada con mayor riesgo vascular, inflamatorio y metabólico.', biomarkers: 'HDL, triglicéridos, TG/HDL, PCR, CRP-BMI, glucosa, insulina y HOMA-IR.' },
      { id: 10, section: 2, text: '¿Su alimentación contiene con frecuencia embutidos, frituras, comida rápida, grasas trans, alcohol o productos ultraprocesados?', interpretation: 'Posible elevación de carga aterogénica y triglicéridos.', biomarkers: 'ApoB, LDL, VLDL, triglicéridos, non-HDL, colesterol remanente, AIP, TG/HDL y VLDL-C/HDL.' },
    ],
  },
  {
    id: 3,
    title: 'III. Carga inflamatoria',
    questions: [
      { id: 11, section: 3, text: '¿Presenta dolor muscular o articular persistente, rigidez al despertar o sensación de inflamación generalizada?', interpretation: 'Posible actividad inflamatoria sistémica o musculoesquelética que necesita correlación clínica.', biomarkers: 'PCR, albúmina, CAR, CRP-BMI, SII, AISI, SIRI y ferritina/PCR.' },
      { id: 12, section: 3, text: '¿Se despierta cansado aun después de dormir suficientes horas o siente que su cuerpo tarda demasiado en recuperarse?', interpretation: 'Inflamación de bajo grado, estrés fisiológico, trastorno del sueño o alteración metabólica.', biomarkers: 'PCR, SII, SI-BMI, SIRI, cortisol, glucosa, insulina, vitamina D y TSH.' },
      { id: 13, section: 3, text: '¿Padece gingivitis, problemas dentales, infecciones recurrentes, enfermedades inflamatorias o lesiones que tardan en sanar?', interpretation: 'Posible fuente inflamatoria persistente o alteración de respuesta inmunológica.', biomarkers: 'PCR, leucocitos, neutrófilos, linfocitos, NLR, PLR, SII, AISI y albúmina.' },
      { id: 14, section: 3, text: '¿Combina exceso de grasa abdominal, poco ejercicio, mala calidad de sueño y consumo frecuente de ultraprocesados?', interpretation: 'Microentorno proinflamatorio relacionado con adiposidad y resistencia metabólica.', biomarkers: 'CRP-BMI, SI-BMI, BMI, HOMA-IR, TyG-BMI, PCR, TG/HDL y ácido úrico/HDL.' },
    ],
  },
  {
    id: 4,
    title: 'IV. Salud renal',
    questions: [
      { id: 15, section: 4, text: '¿Ha notado espuma persistente en la orina, hinchazón de piernas, tobillos, manos o párpados?', interpretation: 'Posible pérdida urinaria de proteínas o alteración en el manejo de líquidos.', biomarkers: 'Albúmina en orina, proteína en orina, ACR urinaria, creatinina, eGFR y albúmina sérica.' },
      { id: 16, section: 4, text: '¿Se levanta varias veces durante la noche a orinar o ha cambiado notablemente la cantidad de orina que produce?', interpretation: 'Posible alteración renal, prostática, metabólica o del balance de líquidos.', biomarkers: 'Creatinina, eGFR, BUN, BUN/Cr, glucosa, HbA1c, glucosa en orina, PSA total y PSA libre.' },
      { id: 17, section: 4, text: '¿Ha presentado ardor al orinar, infecciones urinarias repetidas, dolor lumbar o sangre visible en la orina?', interpretation: 'Posible infección, inflamación, cálculo o lesión urinaria; la sangre visible requiere atención médica.', biomarkers: 'Leucocitos en orina, nitritos, sangre oculta, eritrocitos, proteína, apariencia y color de orina.' },
      { id: 18, section: 4, text: '¿Utiliza con frecuencia antiinflamatorios, diuréticos, suplementos en dosis altas o ha tenido periodos prolongados de deshidratación?', interpretation: 'Posible estrés renal o alteración del equilibrio hidroelectrolítico.', biomarkers: 'BUN, creatinina, BUN/Cr, eGFR, sodio, potasio, osmolalidad, anion gap y CO₂.' },
    ],
  },
  {
    id: 5,
    title: 'V. Salud hepática',
    questions: [
      { id: 19, section: 5, text: '¿Consume alcohol varias veces por semana o suele beber grandes cantidades en una sola ocasión?', interpretation: 'Exposición asociada con estrés hepático y cambios en enzimas o relaciones hepáticas.', biomarkers: 'GGT, ALT, AST, De Ritis, GGT/ALT, GGT/ALP, triglicéridos y ferritina.' },
      { id: 20, section: 5, text: '¿Tiene abdomen prominente, triglicéridos elevados, prediabetes, diabetes o diagnóstico previo de hígado graso?', interpretation: 'Posible disfunción hepática de origen metabólico.', biomarkers: 'ALT, AST, GGT, FIB-4, APRI, glucosa, HbA1c, insulina, HOMA-IR y triglicéridos.' },
      { id: 21, section: 5, text: '¿Ha presentado dolor debajo de las costillas del lado derecho, náusea frecuente, orina oscura, piel amarillenta o comezón generalizada?', interpretation: 'Posible alteración hepatobiliar; la coloración amarilla requiere valoración médica inmediata.', biomarkers: 'ALP, GGT, ALT, AST, bilirrubina en orina, albúmina, globulina y A/G Ratio.' },
      { id: 22, section: 5, text: '¿Consume varios medicamentos, hormonas, productos herbales, anabólicos o suplementos sin supervisión?', interpretation: 'Posible exposición hepatotóxica o interacción entre sustancias.', biomarkers: 'ALT, AST, GGT, ALP, De Ritis, GGT/ALT, GGT/ALP, albúmina y globulina.' },
    ],
  },
  {
    id: 6,
    title: 'VI. Sistema inmune',
    questions: [
      { id: 23, section: 6, text: '¿Ha tenido infecciones respiratorias, digestivas, urinarias o cutáneas con mayor frecuencia de lo habitual?', interpretation: 'Posible alteración de la respuesta inmunitaria o exposición persistente.', biomarkers: 'Leucocitos, neutrófilos, linfocitos, monocitos, NLR, LMR, NMR y SIRI.' },
      { id: 24, section: 6, text: '¿Padece alergias, asma, dermatitis, congestión recurrente o reacciones frecuentes a alimentos o medicamentos?', interpretation: 'Posible componente alérgico o hipersensibilidad.', biomarkers: 'Eosinófilos, porcentaje de eosinófilos, basófilos, porcentaje de basófilos y leucocitos totales.' },
      { id: 25, section: 6, text: '¿Tiene alguna enfermedad autoinmune diagnosticada, fiebre recurrente, ganglios inflamados o sudoración nocturna?', interpretation: 'Posible activación o desregulación inmunológica que requiere evaluación médica dirigida.', biomarkers: 'Leucocitos y diferencial, NLR, PLR, LMR, SII, AISI, SIRI, PCR, albúmina y globulina.' },
      { id: 26, section: 6, text: '¿Sus heridas tardan en cerrar o suele recuperarse lentamente después de enfermedades, cirugías o entrenamientos?', interpretation: 'Posible alteración inmunitaria, inflamatoria, metabólica o nutricional.', biomarkers: 'Leucocitos, linfocitos, neutrófilos, PCR, albúmina, glucosa, HbA1c, vitamina D, hierro y ferritina.' },
    ],
  },
  {
    id: 7,
    title: 'VII. Balance hematológico y oxigenación',
    questions: [
      { id: 27, section: 7, text: '¿Siente cansancio, debilidad, palpitaciones o falta de aire al realizar actividades que antes toleraba?', interpretation: 'Posible anemia, deficiencia de hierro o menor capacidad de transporte de oxígeno.', biomarkers: 'Glóbulos rojos, hemoglobina, hematocrito, VCM, HCM, RDW, hierro, TSAT y ferritina.' },
      { id: 28, section: 7, text: '¿Experimenta mareo al levantarse, dolor de cabeza frecuente, palidez, manos frías o dificultad para concentrarse?', interpretation: 'Posible alteración hematológica, nutricional o circulatoria.', biomarkers: 'Hemoglobina, hematocrito, glóbulos rojos, VCM, RDW, hierro, ferritina, vitamina B12 y folato.' },
      { id: 29, section: 7, text: '¿Presenta moretones sin explicación, sangrado frecuente de encías o nariz, o tarda en detenerse una hemorragia?', interpretation: 'Posible alteración plaquetaria o de coagulación que necesita valoración específica.', biomarkers: 'Plaquetas, VPM, MPR, PLR, hemoglobina y hematocrito.' },
      { id: 30, section: 7, text: '¿Sigue una dieta muy restrictiva, dona sangre con frecuencia o ha tenido sangrado digestivo, úlceras o cirugía gastrointestinal?', interpretation: 'Mayor probabilidad de deficiencia de hierro, B12 o folato.', biomarkers: 'Hierro sérico, TSAT, ferritina, hemoglobina, VCM, RDW, vitamina B12, ácido fólico, Hcy/B12 y Hcy/Folate.' },
    ],
  },
  {
    id: 8,
    title: 'VIII. Energía y eficiencia fisiológica',
    questions: [
      { id: 31, section: 8, text: '¿Tiene energía aceptable al despertar, pero presenta una caída marcada durante la mañana o la tarde?', interpretation: 'Posible inestabilidad metabólica, alteración del sueño o carga de estrés.', biomarkers: 'Glucosa, insulina, HOMA-IR, cortisol, ESR cortisol/glucosa, TSH y ferritina.' },
      { id: 32, section: 8, text: '¿Se agota rápidamente al hacer ejercicio o necesita varios días para recuperarse de una actividad moderada?', interpretation: 'Posible baja reserva funcional, alteración hormonal, inflamatoria o hematológica.', biomarkers: 'Hemoglobina, ferritina, magnesio, IGF-1, cortisol, IGF-1/cortisol, PCR y vitamina D.' },
      { id: 33, section: 8, text: '¿Tiene calambres, espasmos, debilidad muscular, temblores o palpitaciones frecuentes?', interpretation: 'Posible alteración mineral, electrolítica, tiroidea o neuromuscular.', biomarkers: 'Magnesio, calcio, calcio corregido, Mg/Ca, sodio, potasio, Na/K, TSH y vitamina D.' },
      { id: 34, section: 8, text: '¿Ha perdido fuerza, masa muscular o rendimiento físico aun cuando mantiene una alimentación y entrenamiento razonables?', interpretation: 'Posible predominio catabólico o insuficiente recuperación.', biomarkers: 'IGF-1, cortisol, IGF-1/cortisol, testosterona, T/cortisol, DHEA-S y vitamina D.' },
    ],
  },
  {
    id: 9,
    title: 'IX. Estado nutricional, tiroideo y electrolítico',
    questions: [
      { id: 35, section: 9, text: '¿Su alimentación excluye grupos completos de alimentos o contiene poca proteína, vegetales, frutas o alimentos frescos?', interpretation: 'Posible insuficiencia de micronutrientes o proteína.', biomarkers: 'Albúmina, vitamina B12, ácido fólico, vitamina D, hierro, ferritina, magnesio y calcio.' },
      { id: 36, section: 9, text: '¿Presenta hormigueo, entumecimiento, problemas de memoria, lengua sensible o sensación de quemazón en manos o pies?', interpretation: 'Posible alteración neurológica o deficiencia de vitaminas del complejo B.', biomarkers: 'Vitamina B12, ácido fólico, homocisteína, Hcy/B12, Hcy/Folate, VCM y RDW.' },
      { id: 37, section: 9, text: '¿Siente frío cuando otros no, tiene estreñimiento, piel seca, caída de cabello o lentitud física y mental?', interpretation: 'Posible alteración tiroidea o metabólica.', biomarkers: 'TSH, colesterol total, LDL, triglicéridos, glucosa, sodio y CK como prueba complementaria si fuera necesario.' },
      { id: 38, section: 9, text: '¿Padece diarrea o vómito frecuentes, utiliza diuréticos o laxantes, suda excesivamente o consume muy poca agua?', interpretation: 'Posible desequilibrio de líquidos, minerales o electrolitos.', biomarkers: 'Sodio, potasio, cloruro, CO₂, calcio, magnesio, Na/K, anion gap, BUN/Cr y osmolalidad.' },
    ],
  },
  {
    id: 10,
    title: 'X. Eje androgénico, composición corporal y próstata',
    questions: [
      { id: 39, section: 10, text: '¿Ha disminuido su deseo sexual, la frecuencia de erecciones espontáneas o la calidad de las erecciones?', interpretation: 'Posible alteración androgénica, metabólica, vascular o relacionada con estrés.', biomarkers: 'Testosterona total, estradiol, T/E2, DHEA-S, T/DHEA-S, glucosa, HOMA-IR, ApoB y triglicéridos.' },
      { id: 40, section: 10, text: '¿Ha perdido masa muscular o fuerza mientras aumenta la grasa abdominal o del pecho?', interpretation: 'Posible desequilibrio entre composición corporal, andrógenos y metabolismo.', biomarkers: 'Testosterona, estradiol, T/E2, DHEA-S, BMI, insulina, HOMA-IR, cortisol y T/cortisol.' },
      { id: 41, section: 10, text: '¿Ha notado menor motivación, concentración, iniciativa, tolerancia al esfuerzo o estabilidad emocional?', interpretation: 'Posible interacción entre hormonas sexuales, sueño, estrés y metabolismo.', biomarkers: 'Testosterona, DHEA-S, cortisol, T/cortisol, DHEA-S/cortisol, TSH, vitamina D y glucosa.' },
      { id: 42, section: 10, text: '¿Tiene dificultad para iniciar la orina, flujo débil, urgencia, goteo o necesidad de levantarse varias veces por la noche?', interpretation: 'Posible alteración prostática o urinaria.', biomarkers: 'PSA total, PSA libre, PSA libre/PSA total, examen de orina, creatinina y eGFR.' },
      { id: 43, section: 10, text: '¿Utiliza o ha utilizado testosterona, anabólicos, finasterida, medicamentos prostáticos o tratamientos para fertilidad?', interpretation: 'Factor esencial para contextualizar resultados hormonales, hematológicos y prostáticos.', biomarkers: 'Testosterona, estradiol, T/E2, DHEA-S, PSA total, PSA libre, hemoglobina, hematocrito, ALT, AST y lípidos.' },
    ],
  },
  {
    id: 11,
    title: 'XI. Longevidad y edad fenotípica',
    questions: [
      { id: 44, section: 11, text: 'Comparado con hace cinco años, ¿ha disminuido claramente su fuerza, velocidad para caminar, equilibrio o capacidad para subir escaleras?', interpretation: 'Posible pérdida acelerada de reserva funcional.', biomarkers: 'PhenoAge, PhenoAgeAccel, albúmina, PCR, glucosa, creatinina, hemoglobina, RDW e IGF-1.' },
      { id: 45, section: 11, text: '¿Se enferma con mayor facilidad o tarda más tiempo en recuperarse de infecciones, lesiones, estrés o viajes?', interpretation: 'Posible disminución de resiliencia fisiológica.', biomarkers: 'PhenoAge, PhenoAgeAccel, PCR, albúmina, leucocitos, linfocitos, glucosa, vitamina D y DHEA-S/cortisol.' },
      { id: 46, section: 11, text: '¿Ha percibido deterioro progresivo de memoria, atención, agilidad mental o capacidad para aprender?', interpretation: 'Posible envejecimiento funcional, alteración metabólica o deficiencia nutricional.', biomarkers: 'PhenoAge, PhenoAgeAccel, homocisteína, Hcy/B12, Hcy/Folate, vitamina B12, folato, glucosa y HbA1c.' },
    ],
  },
  {
    id: 12,
    title: 'XII. Estrés y carga alostática',
    questions: [
      { id: 47, section: 12, text: '¿Duerme menos de siete horas, se despierta varias veces o comienza el día sin sentirse recuperado?', interpretation: 'Posible carga de estrés sostenida y recuperación insuficiente.', biomarkers: 'Cortisol, CAI, DHEA-S/cortisol, ESR cortisol/glucosa, PCR, glucosa y testosterona/cortisol.' },
      { id: 48, section: 12, text: '¿Se siente permanentemente en alerta, irritable, ansioso o incapaz de relajarse aun cuando no existe una urgencia inmediata?', interpretation: 'Posible activación sostenida del sistema de respuesta al estrés.', biomarkers: 'Cortisol, CAI, DHEA-S/cortisol, glucosa, PCR, insulina y T/cortisol.' },
      { id: 49, section: 12, text: '¿Utiliza café, bebidas energéticas, azúcar, alcohol o medicamentos para poder activarse durante el día o desconectarse por la noche?', interpretation: 'Posible compensación conductual de fatiga, estrés o alteraciones del sueño.', biomarkers: 'Cortisol, glucosa, insulina, HOMA-IR, GGT, triglicéridos, magnesio y DHEA-S/cortisol.' },
      { id: 50, section: 12, text: '¿En los últimos seis meses ha vivido presión laboral, económica, familiar o emocional que percibe superior a su capacidad de recuperación?', interpretation: 'Mayor carga alostática y posible predominio catabólico.', biomarkers: 'CAI, cortisol, PCR, DHEA-S/cortisol, IGF-1/cortisol, testosterona/cortisol, glucosa, HbA1c y CRP-BMI.' },
    ],
  },
]

const answers = ref<Record<number, number>>({})
const showInfo = ref<Record<number, boolean>>({})

const nombre = ref('')
const email = ref('')
const phoneNum = ref('')
const countryCode = ref('+52')
const showCountryPicker = ref(false)
const formErrors = ref<Record<string, string>>({})
const submitLoading = ref(false)
const formSubmitted = ref(false)

const mode = ref<'intro' | 'wizard' | 'done'>('intro')
const activeStep = ref(0)
const dir = ref<'fwd' | 'back'>('fwd')

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
const route = useRoute()

function parseFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    nombre: parts[0] || '',
    apellido: parts.slice(1).join(' '),
  }
}

const currentSection = computed(() => sectionsData[activeStep.value])
const totalSteps = computed(() => sectionsData.length)
const isFirstStep = computed(() => activeStep.value === 0)
const isLastStep = computed(() => activeStep.value === totalSteps.value - 1)

const totalQuestions = computed(() => sectionsData.reduce((sum, s) => sum + s.questions.length, 0))
const answeredCount = computed(() => Object.keys(answers.value).length)
const overallProgress = computed(() => totalQuestions.value > 0 ? Math.round((answeredCount.value / totalQuestions.value) * 100) : 0)
const stepProgress = computed(() => Math.round(((activeStep.value + 1) / totalSteps.value) * 100))

function selectCountry(c: typeof countries[0]) {
  countryCode.value = c.code
  showCountryPicker.value = false
}

function toggleInfo(id: number) {
  showInfo.value[id] = !showInfo.value[id]
}

function setAnswer(questionId: number, value: number) {
  answers.value[questionId] = value
}

function getFullPhone() {
  return `${countryCode.value}${phoneNum.value.replace(/\D/g, '')}`
}

function hydrateContactFromQuery() {
  const queryName = typeof route.query.nombre === 'string' ? route.query.nombre : ''
  const queryEmail = typeof route.query.email === 'string' ? route.query.email : ''
  const queryPhone = typeof route.query.telefono === 'string' ? route.query.telefono : ''

  if (queryName && !nombre.value) nombre.value = queryName
  if (queryEmail && !email.value) email.value = queryEmail

  if (queryPhone && !phoneNum.value) {
    const compactPhone = queryPhone.replace(/\s+/g, '')
    const match = compactPhone.match(/^(\+\d{1,4})(\d+)$/)
    if (match) {
      countryCode.value = match[1]
      phoneNum.value = match[2]
    } else {
      phoneNum.value = compactPhone.replace(/\D/g, '')
    }
  }
}

function buildProgressNote(scope: string, detail = '') {
  const parts = [
    '🧬 Progreso PHB',
    `📍 Evento: ${scope}`,
    `✅ Respondidas: ${answeredCount.value}/${totalQuestions.value}`,
  ]

  if (detail) {
    parts.push('', '📝 Resumen de la sección', detail)
  }

  return parts.join('\n')
}

function buildQuestionDetail(questionId: number, value: number) {
  const question = sectionsData[activeStep.value]?.questions.find(q => q.id === questionId)
  const text = question ? question.text.slice(0, 70) : `Pregunta ${questionId}`
  return `• Q${questionId}: ${value}\n  ${text}`
}

function buildSectionDetail() {
  const parts = currentSection.value.questions
    .map((question) => {
      const answer = answers.value[question.id]
      return answer === undefined ? null : buildQuestionDetail(question.id, answer)
    })
    .filter(Boolean)

  if (parts.length === 0) return '• Sin respuestas registradas en esta sección'

  return ['📌 Respuestas de la sección', ...parts].join('\n')
}

async function sendStepUpdate(scope: string, detail = '') {
  if (!STEP_WEBHOOK) return

  const fullPhone = getFullPhone()
  const { nombre: firstName, apellido } = parseFullName(nombre.value)
  const note = buildProgressNote(scope, detail)

  try {
    await fetch(STEP_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: firstName,
        apellido,
        email: email.value.trim(),
        telefono: fullPhone,
        note,
        nota: note,
        cuestionario: answers.value,
        total_preguntas: totalQuestions.value,
        respondidas: answeredCount.value,
        paso: scope,
        seccion_id: currentSection.value?.id,
        seccion: currentSection.value?.title,
        pregunta_id: detail ? Number(detail.match(/Q(\d+)=/)?.[1] || 0) : 0,
        respuesta: detail ? Number(detail.match(/=(\d+)/)?.[1] ?? null) : null,
      }),
    })
  } catch {
    // Silencioso: no bloqueamos el wizard por fallos de red.
  }
}

function validatePersonal() {
  const e: Record<string, string> = {}
  if (nombre.value.trim().length < 2) e.nombre = 'Ingresa tu nombre'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) e.email = 'Email inválido'
  if (phoneNum.value.trim().length < 7) e.telefono = 'Teléfono inválido'
  formErrors.value = e
  return Object.keys(e).length === 0
}

function startWizard() {
  if (!validatePersonal()) return
  mode.value = 'wizard'
  activeStep.value = 0
  dir.value = 'fwd'
}

async function nextStep() {
  dir.value = 'fwd'
  if (isLastStep.value) {
    await handleSubmit()
  } else {
    await sendStepUpdate('seccion_completada', buildSectionDetail())
    activeStep.value++
  }
}

function prevStep() {
  dir.value = 'back'
  if (isFirstStep.value) {
    mode.value = 'intro'
  } else {
    activeStep.value--
  }
}

async function handleSubmit() {
  submitLoading.value = true
  const fullPhone = getFullPhone()
  const { nombre: firstName, apellido } = parseFullName(nombre.value)
  try {
    if (STEP_WEBHOOK) {
      await fetch(STEP_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: firstName,
          apellido,
          email: email.value.trim(),
          telefono: fullPhone,
          note: LEAD_NOTE,
          nota: LEAD_NOTE,
          cuestionario: answers.value,
          total_preguntas: totalQuestions.value,
          respondidas: answeredCount.value,
          paso: 'cuestionario_phb_finalizado',
          seccion_id: currentSection.value?.id,
          seccion: currentSection.value?.title,
        }),
      })
    }

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
        cuestionario: answers.value,
        total_preguntas: totalQuestions.value,
        respondidas: answeredCount.value,
        paso: 'cuestionario_phb',
      }),
    })
  } catch { }
  await new Promise((r) => setTimeout(r, 400))
  submitLoading.value = false
  mode.value = 'done'
  formSubmitted.value = true
}

function onDocumentClick(e: MouseEvent) {
  const t = e.target as HTMLElement
  if (!t.closest('.fp-phone-pick')) showCountryPicker.value = false
}

onMounted(() => {
  hydrateContactFromQuery()
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
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

    <!-- ═══ DONE ═══ -->
    <main v-if="mode === 'done'" class="fp__main fp__main--done">
      <div class="fp__done">
        <div class="fp__done-icon"><i class="fa-solid fa-circle-check"></i></div>
        <h2 class="fp__done-title">¡Cuestionario enviado!</h2>
        <p class="fp__done-text">
          Gracias por completar el Cuestionario de Inteligencia Biológica PHB™. Hemos recibido tus respuestas y un especialista las revisará para diseñar tu ruta de regeneración.
        </p>
        <div class="fp__done-links">
          <router-link to="/" class="fp__done-btn">Volver al inicio</router-link>
          <a href="https://powerhousebiotech.com/" target="_blank" rel="noopener noreferrer" class="fp__done-link">VER POWERHOUSE BIOTECH →</a>
        </div>
      </div>
    </main>

    <!-- ═══ INTRO ═══ -->
    <main v-else-if="mode === 'intro'" class="fp__main">
      <div class="fp__card">
        <h1 class="fp__title">Cuestionario de Inteligencia Biológica PHB™</h1>
        <p class="fp__period">Periodo de referencia: últimos 90 días</p>

        <div class="fp-scale">
          <span class="fp-scale__label">Escala:</span>
          <div class="fp-scale__items">
            <span class="fp-scale__item"><strong>0</strong> Nunca / No</span>
            <span class="fp-scale__item"><strong>1</strong> Ocasional o leve</span>
            <span class="fp-scale__item"><strong>2</strong> Frecuente o moderado</span>
            <span class="fp-scale__item"><strong>3</strong> Persistente / En tratamiento</span>
          </div>
        </div>

        <div class="fp-personal">
          <p class="fp-personal__label">Tus datos de contacto</p>
          <div class="fp-field">
            <input v-model="nombre" placeholder="Nombre completo" :class="{ error: formErrors.nombre }" @input="formErrors.nombre = ''" />
          </div>
          <p v-if="formErrors.nombre" class="fp-field__error">{{ formErrors.nombre }}</p>
          <div class="fp-field">
            <input v-model="email" type="email" placeholder="Correo electrónico" :class="{ error: formErrors.email }" @input="formErrors.email = ''" />
          </div>
          <p v-if="formErrors.email" class="fp-field__error">{{ formErrors.email }}</p>
          <div class="fp-field fp-field--phone">
            <div class="fp-phone-pick">
              <button type="button" class="fp-phone-pick__btn" @click="showCountryPicker = !showCountryPicker">
                <span class="fp-phone-pick__flag">{{ currentCountry.flag }}</span>
                <span class="fp-phone-pick__code">{{ currentCountry.code }}</span>
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <div v-if="showCountryPicker" class="fp-phone-pick__drop">
                <button v-for="c in countries" :key="c.code + c.label" type="button" class="fp-phone-pick__opt" :class="{ active: countryCode === c.code }" @click="selectCountry(c)">
                  <span class="fp-phone-pick__flag">{{ c.flag }}</span>
                  <span class="fp-phone-pick__code">{{ c.code }}</span>
                  <span class="fp-phone-pick__label">{{ c.label }}</span>
                </button>
              </div>
            </div>
            <input v-model="phoneNum" type="tel" placeholder="Teléfono / WhatsApp" :class="{ error: formErrors.telefono }" @input="formErrors.telefono = ''" />
          </div>
          <p v-if="formErrors.telefono" class="fp-field__error">{{ formErrors.telefono }}</p>
        </div>


        <button type="button" class="fp__btn fp__btn--start" @click="startWizard">
          COMENZAR CUESTIONARIO →
        </button>

        <router-link to="/" class="fp__back">← Volver al inicio</router-link>
      </div>
    </main>

    <!-- ═══ WIZARD ═══ -->
    <main v-else class="fp__main">
      <!-- Step progress -->
      <div class="fp__progress-wrap">
        <div class="fp__step-indicator">
          <span class="fp__step-badge">Sección {{ activeStep + 1 }} de {{ totalSteps }}</span>
          <span class="fp__step-name">{{ currentSection.title }}</span>
        </div>
        <div class="fp__progress-bar">
          <div class="fp__progress-fill" :style="{ width: stepProgress + '%' }"></div>
        </div>
      </div>

      <Transition :name="dir" mode="out-in">
        <div class="fp__card fp__card--step" :key="activeStep">
          <div class="fp__section-header">
            <span class="fp__section-num">{{ currentSection.id }}</span>
            <h2 class="fp__section-title">{{ currentSection.title }}</h2>
          </div>

          <div v-for="q in currentSection.questions" :key="q.id" class="fp-question">
            <p class="fp-question__text">{{ q.id }}. {{ q.text }}</p>
            <div class="fp-question__options">
              <label v-for="n in 4" :key="n - 1" class="fp-option" :class="{ selected: answers[q.id] === n - 1 }">
                <input type="radio" :name="'q' + q.id" :value="n - 1" :checked="answers[q.id] === n - 1" @change="setAnswer(q.id, n - 1)" />
                <span class="fp-option__value">{{ n - 1 }}</span>
              </label>
            </div>
            <button type="button" class="fp-question__info-btn" @click="toggleInfo(q.id)">
              <i class="fa-regular fa-circle-info"></i>
              {{ showInfo[q.id] ? 'Ocultar' : 'Ver' }} interpretación y biomarcadores
            </button>
            <div v-if="showInfo[q.id]" class="fp-question__details">
              <p><strong>Interpretación:</strong> {{ q.interpretation }}</p>
              <p><strong>Biomarcadores relacionados:</strong> {{ q.biomarkers }}</p>
            </div>
          </div>

          <div class="fp-nav">
            <button type="button" class="fp-nav__btn fp-nav__btn--prev" @click="prevStep">
              <i class="fa-solid fa-arrow-left"></i> Anterior
            </button>
            <div class="fp-nav__spacer"></div>
            <button
              type="button"
              class="fp-nav__btn fp-nav__btn--next"
              :class="{ 'fp-nav__btn--submit': isLastStep }"
              :disabled="submitLoading"
              @click="nextStep"
            >
              <template v-if="isLastStep">
                {{ submitLoading ? 'Enviando...' : 'ENVIAR CUESTIONARIO' }}
              </template>
              <template v-else>
                Siguiente <i class="fa-solid fa-arrow-right"></i>
              </template>
            </button>
          </div>
        </div>
      </Transition>

      <div class="fp__overall-progress" v-if="answeredCount > 0">
        <span>{{ answeredCount }}/{{ totalQuestions }} preguntas respondidas en total</span>
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

  small {
    font-weight: 400;
    font-size: 0.85em;
  }

  sup {
    font-size: 0.5em;
    top: -0.6em;
  }
}

.fp__top-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: $PHB-CYAN;
  text-decoration: none;

  &:hover {
    color: $PHB-BLUE-LIGHT;
  }
}

.fp__main {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.fp__main--done {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.fp__card {
  background: $PHB-SURFACE;
  border: 1px solid $PHB-BORDER;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: $PHB-SHADOW-SM;

  &--step {
    padding: 1.5rem;
  }
}

.fp__title {
  @include fonts.heading-font(700);
  font-size: 1.25rem;
  color: $PHB-TEXT-1;
  margin: 0 0 0.25rem;
}

.fp__period {
  font-size: 0.8rem;
  color: $PHB-TEXT-3;
  margin: 0 0 1rem;
  font-weight: 500;
}

// ── Scale ───────────────────────────────────────────────────────────────────
.fp-scale {
  background: $PHB-SURFACE-2;
  border: 1px solid $PHB-BORDER;
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  margin-bottom: 1.25rem;

  &__label {
    display: block;
    font-family: fonts.$font-interface;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $PHB-CYAN;
    margin-bottom: 0.35rem;
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
  }

  &__item {
    font-size: 0.72rem;
    color: $PHB-TEXT-3;
    line-height: 1.4;

    strong {
      color: $PHB-TEXT-2;
      font-weight: 700;
      margin-right: 0.15rem;
    }
  }
}

// ── Personal ────────────────────────────────────────────────────────────────
.fp-personal {
  margin-bottom: 1.25rem;

  &__label {
    font-family: fonts.$font-interface;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba($PHB-CYAN, 0.5);
    margin: 0 0 0.5rem;
  }
}

.fp-field {
  margin-bottom: 0.3rem;

  input {
    width: 100%;
    padding: 0.8rem 1rem;
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
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      min-width: 0;
    }
  }
}

.fp-field__error {
  font-size: 0.72rem;
  color: $PHB-URGENT-LIGHT;
  margin: 0 0 0.2rem 0.3rem;
}

.fp-phone-pick {
  position: relative;
  flex-shrink: 0;

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.8rem 0.7rem;
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

// ── Intro summary ──────────────────────────────────────────────────────────
.fp__summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba($PHB-CYAN, 0.04);
  border: 1px solid rgba($PHB-CYAN, 0.08);
  border-radius: 10px;
  margin-bottom: 1.25rem;
  font-size: 0.82rem;
  color: $PHB-TEXT-3;
  line-height: 1.4;

  i {
    color: $PHB-CYAN;
    font-size: 1rem;
    flex-shrink: 0;
  }

  strong {
    color: $PHB-TEXT-2;
  }
}

// ── Start button ───────────────────────────────────────────────────────────
.fp__btn--start {
  margin-bottom: 0.75rem;
}

// ── Progress (wizard) ──────────────────────────────────────────────────────
.fp__progress-wrap {
  margin-bottom: 1rem;
}

.fp__step-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.fp__step-badge {
  font-family: fonts.$font-interface;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $PHB-CYAN;
  border: 1px solid rgba($PHB-CYAN, 0.15);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  white-space: nowrap;
}

.fp__step-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: $PHB-TEXT-2;
}

.fp__progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 999px;
  overflow: hidden;
}

.fp__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $PHB-CYAN, $PHB-BLUE);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.fp__overall-progress {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.72rem;
  color: $PHB-TEXT-3;
  font-weight: 500;
}

// ── Section header ─────────────────────────────────────────────────────────
.fp__section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid $PHB-BORDER;
}

.fp__section-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba($PHB-CYAN, 0.1);
  border: 1px solid rgba($PHB-CYAN, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: fonts.$font-interface;
  font-size: 0.75rem;
  font-weight: 800;
  color: $PHB-CYAN;
  flex-shrink: 0;
}

.fp__section-title {
  @include fonts.heading-font(700);
  font-size: 1.1rem;
  color: $PHB-TEXT-1;
  margin: 0;
}

// ── Question ───────────────────────────────────────────────────────────────
.fp-question {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  &__text {
    font-size: 0.82rem;
    color: $PHB-TEXT-2;
    line-height: 1.5;
    margin: 0 0 0.6rem;
  }

  &__options {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  &__info-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: none;
    border: none;
    padding: 0;
    font-family: fonts.$font-interface;
    font-size: 0.68rem;
    font-weight: 600;
    color: rgba($PHB-CYAN, 0.6);
    cursor: pointer;
    transition: color 0.2s;

    i {
      font-size: 0.7rem;
    }

    &:hover {
      color: $PHB-CYAN;
    }
  }

  &__details {
    margin-top: 0.5rem;
    padding: 0.6rem 0.75rem;
    background: rgba($PHB-CYAN, 0.04);
    border: 1px solid rgba($PHB-CYAN, 0.08);
    border-radius: 8px;
    font-size: 0.72rem;
    color: $PHB-TEXT-3;
    line-height: 1.5;

    p {
      margin: 0 0 0.25rem;

      &:last-child {
        margin: 0;
      }
    }

    strong {
      color: $PHB-TEXT-2;
      font-weight: 600;
    }
  }
}

// ── Option ─────────────────────────────────────────────────────────────────
.fp-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $PHB-BORDER;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba($PHB-CYAN, 0.3);
    background: rgba($PHB-CYAN, 0.06);
  }

  &.selected {
    background: rgba($PHB-CYAN, 0.15);
    border-color: $PHB-CYAN;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__value {
    font-family: fonts.$font-interface;
    font-size: 0.82rem;
    font-weight: 700;
    color: $PHB-TEXT-3;
    pointer-events: none;

    .selected & {
      color: $PHB-CYAN;
    }
  }
}

// ── Navigation ─────────────────────────────────────────────────────────────
.fp-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid $PHB-BORDER;

  &__spacer {
    flex: 1;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.4rem;
    border: none;
    border-radius: 10px;
    font-family: fonts.$font-accent;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;

    i {
      font-size: 0.75rem;
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }

    &--prev {
      background: transparent;
      color: $PHB-TEXT-3;
      border: 1px solid $PHB-BORDER;

      &:hover:not(:disabled) {
        background: $PHB-SURFACE-2;
        color: $PHB-TEXT-2;
      }
    }

    &--next {
      background: rgba($PHB-CYAN, 0.08);
      border: 1px solid $PHB-BORDER-MEDIUM;
      color: $PHB-CYAN;

      &:hover:not(:disabled) {
        background: rgba($PHB-CYAN, 0.15);
      }
    }

    &--submit {
      background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
      color: $PHB-TEXT-1;
      border-color: transparent;
      box-shadow: 0 4px 20px rgba($PHB-CYAN, 0.2);

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35);
      }
    }
  }
}

// ── Back link ──────────────────────────────────────────────────────────────
.fp__back {
  display: block;
  text-align: center;
  font-size: 0.8rem;
  color: $PHB-TEXT-3;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: $PHB-CYAN;
  }
}

// ── Submit / Start button ──────────────────────────────────────────────────
.fp__btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, $PHB-CYAN, $PHB-BLUE);
  color: $PHB-TEXT-1;
  border: none;
  border-radius: 10px;
  font-family: fonts.$font-accent;
  font-size: 0.85rem;
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

// ── Done ───────────────────────────────────────────────────────────────────
.fp__done {
  text-align: center;
  max-width: 480px;
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba($PHB-CYAN, 0.35);
  }
}

.fp__done-link {
  font-size: 0.85rem;
  color: $PHB-CYAN;
  text-decoration: none;

  &:hover {
    color: $PHB-BLUE-LIGHT;
  }
}



// ── Transitions ────────────────────────────────────────────────────────────
.fwd-enter-active,
.fwd-leave-active,
.back-enter-active,
.back-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fwd-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.fwd-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.back-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.back-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
