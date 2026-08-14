/**
 * Catálogo del Cuestionario de Inteligencia Biológica PHB™.
 *
 * Fuente de verdad del texto de las preguntas. El backend guarda un snapshot de
 * este catálogo en cada sync, y las llaves de custom field de GHL se derivan del
 * texto: cambiar el texto de una pregunta cambia su llave en el CRM.
 */

export interface QuestionItem {
  id: number
  section: number
  text: string
  interpretation: string
  biomarkers: string
}

export interface SectionData {
  id: number
  title: string
  questions: QuestionItem[]
}

export const sectionsData: SectionData[] = [
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

/** Escala de respuesta — periodo de referencia: últimos 90 días */
export interface ScaleOption {
  value: number
  label: string
  short: string
}

export const ANSWER_SCALE: ScaleOption[] = [
  { value: 0, label: 'Nunca / No', short: 'Nunca' },
  { value: 1, label: 'Ocasional o leve', short: 'Ocasional' },
  { value: 2, label: 'Frecuente o moderado', short: 'Frecuente' },
  { value: 3, label: 'Persistente / En tratamiento', short: 'Persistente' },
]

export const MAX_PER_QUESTION = 3

/**
 * Contenido educativo que se muestra ANTES de las preguntas de cada sección.
 * El objetivo es que el paciente entienda qué sistema está evaluando y por qué
 * importa para su capacidad de regeneración, no solo que conteste.
 */
export interface SectionEducation {
  /** Frase corta que enmarca la sección */
  headline: string
  /** Qué se está midiendo en esta sección */
  what: string
  /** Por qué importa para la ruta regenerativa */
  why: string
  /** Biomarcadores clave que este bloque ayuda a priorizar */
  markers: string
  /** Dato educativo para reforzar el valor de responder con honestidad */
  insight: string
}

export const sectionEducation: Record<number, SectionEducation> = {
  1: {
    headline: 'Cómo tu cuerpo administra la energía',
    what: 'La eficiencia con la que conviertes lo que comes en energía utilizable: respuesta a la glucosa, señal de insulina y distribución de grasa corporal.',
    why: 'La regeneración es un proceso que consume energía. Si la insulina está elevada de forma crónica, el cuerpo prioriza almacenar en lugar de reparar, y cualquier terapia regenerativa rinde menos.',
    markers: 'Glucosa, HbA1c, insulina, HOMA-IR, TyG, METS-IR, triglicéridos y HDL.',
    insight: 'La resistencia a la insulina puede preceder por 10 a 15 años a un diagnóstico formal. Los síntomas cotidianos suelen aparecer mucho antes que el laboratorio alterado.',
  },
  2: {
    headline: 'La red que lleva la reparación a cada tejido',
    what: 'El estado de tu sistema circulatorio: carga aterogénica, presión, herencia familiar y hábitos que castigan al endotelio.',
    why: 'Ningún tejido se regenera sin riego. La calidad de tus vasos define cuánto oxígeno, nutrientes y señales de reparación llegan realmente a donde los necesitas.',
    markers: 'ApoB, LDL, non-HDL, Lp(a), colesterol remanente, PCR y AIP.',
    insight: 'El colesterol total puede salir normal y aun así existir riesgo elevado. ApoB y Lp(a) muestran el número real de partículas capaces de infiltrar la pared arterial.',
  },
  3: {
    headline: 'El ruido de fondo que frena la reparación',
    what: 'Inflamación de bajo grado sostenida: dolor persistente, recuperación lenta, infecciones repetidas y focos inflamatorios silenciosos.',
    why: 'La inflamación crónica mantiene al cuerpo en modo defensa. Mientras esa señal esté encendida, el modo reparación queda en segundo plano y los resultados regenerativos se diluyen.',
    markers: 'PCR, albúmina, CAR, SII, SIRI, AISI, NLR y ferritina.',
    insight: 'La inflamación crónica de bajo grado no duele como una infección aguda: se siente como cansancio, rigidez y lentitud para recuperarse. Por eso pasa desapercibida durante años.',
  },
  4: {
    headline: 'El filtro que sostiene tu equilibrio interno',
    what: 'Función renal y manejo de líquidos, sodio, potasio y ácido úrico.',
    why: 'El riñón regula el medio en el que viven tus células. Si filtra mal, se acumulan residuos que interfieren con cualquier proceso de reparación tisular.',
    markers: 'Creatinina, eGFR, BUN, ACR urinaria, ácido úrico, sodio, potasio y Na/K.',
    insight: 'El riñón puede perder cerca de la mitad de su función antes de dar síntomas evidentes. Marcadores tempranos como la ACR urinaria lo detectan mucho antes.',
  },
  5: {
    headline: 'La planta de procesamiento de tu organismo',
    what: 'Función hepática y biliar: metabolismo de grasas, detoxificación y señales de hígado graso.',
    why: 'El hígado procesa hormonas, fármacos y desechos metabólicos. Un hígado sobrecargado altera el terreno bioquímico sobre el que trabaja cualquier protocolo regenerativo.',
    markers: 'ALT, AST, GGT, fosfatasa alcalina, bilirrubinas, albúmina, FIB-4 y relación AST/ALT.',
    insight: 'El hígado graso es hoy la alteración hepática más frecuente y suele ser reversible en etapas tempranas, pero rara vez produce síntomas hasta fases avanzadas.',
  },
  6: {
    headline: 'Tu sistema de vigilancia y reparación',
    what: 'Capacidad de defensa y regulación inmunológica: infecciones recurrentes, alergias, autoinmunidad y velocidad de recuperación.',
    why: 'Las mismas células que te defienden son las que limpian tejido dañado y coordinan la cicatrización. Un sistema inmune desregulado repara mal.',
    markers: 'Leucocitos, neutrófilos, linfocitos, NLR, PLR, SII, vitamina D y PCR.',
    insight: 'Un sistema inmune sano no es el más agresivo, sino el mejor regulado: capaz de encender la respuesta y, sobre todo, de apagarla a tiempo.',
  },
  7: {
    headline: 'Cuánto oxígeno llega realmente a tus células',
    what: 'Calidad de la sangre y transporte de oxígeno: hemoglobina, hierro, volumen y forma de los glóbulos rojos.',
    why: 'La reparación celular es un proceso que depende de oxígeno. Con transporte deficiente, la energía cae y el tejido tarda más en recuperarse.',
    markers: 'Hemoglobina, hematocrito, VCM, HCM, RDW, ferritina, hierro sérico y saturación de transferrina.',
    insight: 'Se puede tener hemoglobina normal y aun así reservas de hierro agotadas. La ferritina baja explica cansancio y caída de cabello antes de que exista anemia.',
  },
  8: {
    headline: 'Tu rendimiento fisiológico real',
    what: 'Cómo se traduce todo lo anterior en tu día a día: energía sostenida, tolerancia al esfuerzo, recuperación y claridad mental.',
    why: 'Es el termómetro funcional. Aquí se ve si tus sistemas trabajan coordinados o si estás compensando con cafeína, azúcar y fuerza de voluntad.',
    markers: 'Glucosa, insulina, TSH, vitamina D, B12, ferritina, PCR y CPK.',
    insight: 'El cansancio persistente casi nunca tiene una sola causa: suele ser la suma de varios sistemas trabajando al límite al mismo tiempo.',
  },
  9: {
    headline: 'Los materiales con los que reparas',
    what: 'Disponibilidad de nutrientes, función tiroidea y balance de electrolitos.',
    why: 'Regenerar exige materia prima. Sin vitamina D, B12, hierro, magnesio o una tiroides en rango, el cuerpo tiene el plano de reparación pero no los materiales.',
    markers: 'TSH, T4 libre, T3, vitamina D, B12, ácido fólico, magnesio, calcio, sodio y potasio.',
    insight: 'La deficiencia de vitamina D es de las más comunes y de las más silenciosas: afecta a la vez inmunidad, hueso, músculo y estado de ánimo.',
  },
  10: {
    headline: 'Hormonas, músculo y composición corporal',
    what: 'Eje androgénico, masa muscular, libido, recuperación tras entrenar y salud prostática.',
    why: 'El músculo es tejido metabólicamente activo y uno de los mejores predictores de longevidad funcional. El eje hormonal define cuánto puedes construirlo y sostenerlo.',
    markers: 'Testosterona total y libre, SHBG, estradiol, DHEA-S, PSA, BMI y masa magra.',
    insight: 'Perder masa muscular con la edad no es inevitable: es en gran medida consecuencia de desuso, déficit proteico y desregulación hormonal — y los tres son modificables.',
  },
  11: {
    headline: 'Tu edad biológica frente a la del calendario',
    what: 'Señales de envejecimiento acelerado: recuperación, piel, sueño, memoria y percepción de vitalidad.',
    why: 'Dos personas de la misma edad pueden tener capacidades regenerativas muy distintas. Aquí estimamos tu edad fenotípica, que es la que realmente marca el punto de partida.',
    markers: 'Albúmina, creatinina, glucosa, PCR, linfocitos %, VCM, RDW, fosfatasa alcalina y leucocitos (PhenoAge).',
    insight: 'La edad fenotípica se calcula con marcadores de laboratorio comunes y, a diferencia de la cronológica, puede mejorar cuando cambia el terreno metabólico e inflamatorio.',
  },
  12: {
    headline: 'La carga que tu sistema viene acumulando',
    what: 'Estrés sostenido, calidad de sueño, uso de estimulantes y carga alostática de los últimos meses.',
    why: 'El cortisol elevado de forma crónica degrada músculo, eleva glucosa y suprime reparación. Es el factor que más rápido revierte los avances de un protocolo regenerativo.',
    markers: 'Cortisol, DHEA-S, relación cortisol/DHEA, glucosa, insulina, PCR y TSH.',
    insight: 'La mayor parte de la reparación tisular y la consolidación de memoria ocurren durante el sueño profundo. Dormir mal no retrasa la regeneración: la cancela.',
  },
}

/** Total de preguntas del cuestionario */
export const TOTAL_QUESTIONS = sectionsData.reduce((sum, s) => sum + s.questions.length, 0)

/** Catálogo plano, útil para búsquedas por id */
export const allQuestions: QuestionItem[] = sectionsData.flatMap((s) => s.questions)

/**
 * Niveles de carga sintomática. Los umbrales están duplicados en
 * `assessment.service.ts` del backend (levelFromPercent): si cambias uno,
 * cambia el otro o el reporte dirá algo distinto a la pantalla.
 */
export type LevelKey = 'optimo' | 'vigilancia' | 'alerta' | 'prioritario'

export const LEVEL_LABELS: Record<LevelKey, string> = {
  optimo: 'Óptimo',
  vigilancia: 'Vigilancia',
  alerta: 'Alerta',
  prioritario: 'Prioritario',
}

export function levelFromPercent(percent: number): LevelKey {
  if (percent >= 75) return 'prioritario'
  if (percent >= 50) return 'alerta'
  if (percent >= 25) return 'vigilancia'
  return 'optimo'
}

/**
 * Normalización EXACTA usada para derivar las llaves de custom field en GHL.
 * No normaliza acentos a propósito: los campos ya creados en el CRM se
 * generaron con esta misma lógica y cambiarla los desconecta.
 */
export function cleanStringForGhl(str: string): string {
  let cleaned = str.toLowerCase()
  cleaned = cleaned.replace(/[\s\t\n\r\-\/]+/g, '_')
  cleaned = cleaned.replace(/[^a-z0-9_]/g, '')
  cleaned = cleaned.replace(/_+/g, '_')
  cleaned = cleaned.replace(/^_+|_+$/g, '')
  return cleaned
}

export function getQuestionGhlKey(q: QuestionItem): string {
  return `${q.id}_${cleanStringForGhl(q.text)}`
}

/** Catálogo que se envía al backend en cada sync (snapshot del contenido). */
export function buildCatalogPayload() {
  return sectionsData.map((section) => ({
    id: section.id,
    title: section.title,
    summary: sectionEducation[section.id]?.what ?? '',
    why: sectionEducation[section.id]?.why ?? '',
    questions: section.questions.map((q) => ({
      id: q.id,
      section: q.section,
      text: q.text,
      interpretation: q.interpretation,
      biomarkers: q.biomarkers,
    })),
  }))
}
