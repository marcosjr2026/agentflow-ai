import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── DETECCIÓN DE INTENCIÓN ───────────────────────────────────────────────────
/**
 * Detecta la intención del mensaje de un cliente
 * @returns { intent, urgency, summary }
 */
export async function detectIntent(message, contactType = 'lead') {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Eres un asistente de una agencia de seguros de salud en Miami.
Analiza el mensaje de un ${contactType === 'client' ? 'cliente activo' : 'prospecto'} y responde con JSON.

Intenciones posibles:
- appointment: quiere hacer una cita médica
- complaint: queja o problema con su seguro
- document: necesita enviar o solicitar documentos
- benefits: pregunta sobre sus beneficios
- payment: consulta sobre pagos o facturación
- cancel: quiere cancelar
- urgent: situación urgente o médica
- general: consulta general
- sales: interesado en un plan de seguro

Responde SOLO con este JSON:
{
  "intent": "appointment|complaint|document|benefits|payment|cancel|urgent|general|sales",
  "urgency": "low|medium|high",
  "summary": "Resumen de 1 línea de qué necesita el cliente",
  "keywords": ["palabra1", "palabra2"]
}`,
      },
      { role: 'user', content: message },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

// ─── EVALUACIÓN DE LLAMADA DE VENTAS ─────────────────────────────────────────
/**
 * Evalúa la transcripción de una llamada de ventas
 * @returns Objeto con evaluación completa
 */
export async function evaluateCall(transcript) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Eres un coach experto en ventas de seguros de salud para el mercado hispano de Miami.
Analiza la transcripción de una llamada de ventas y evalúa al agente.

El agente debe:
1. Preguntar la edad del prospecto
2. Preguntar el zip code
3. Identificar la necesidad principal (médico de cabecera, especialistas, medicamentos, dental)
4. Presentar al menos 2 opciones de planes
5. Manejar objeciones de precio, comparación con otro seguro, o indecisión
6. Intentar cerrar la venta o programar seguimiento

Responde SOLO con este JSON:
{
  "score": 0-100,
  "asked_age": true/false,
  "asked_zipcode": true/false,
  "asked_need": true/false,
  "presented_plans": true/false,
  "handled_price_objection": true/false,
  "handled_competitor_objection": true/false,
  "attempted_close": true/false,
  "close_successful": true/false,
  "missed_opportunities": ["lista de oportunidades perdidas con detalle"],
  "positives": "párrafo con lo que hizo bien el agente",
  "improvements": "párrafo con lo que necesita mejorar",
  "recommendations": "3 recomendaciones específicas y accionables numeradas",
  "summary": "Resumen de 2 líneas de la llamada"
}`,
      },
      { role: 'user', content: `TRANSCRIPCIÓN:\n\n${transcript}` },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}

// ─── TRANSCRIPCIÓN DE AUDIO (Whisper) ────────────────────────────────────────
/**
 * Transcribe un archivo de audio usando Whisper
 * @param {Buffer|ReadableStream} audioBuffer - Audio a transcribir
 * @param {string} filename - Nombre del archivo
 */
export async function transcribeAudio(audioBuffer, filename) {
  const file = new File([audioBuffer], filename, { type: 'audio/mpeg' });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'es', // Español por defecto, Whisper detecta automáticamente
  });

  return transcription.text;
}

// ─── REPORTE DIARIO DEL AGENTE ────────────────────────────────────────────────
/**
 * Genera el mensaje de reporte diario para un agente
 */
export function formatDailyReport(agentName, evaluations) {
  if (!evaluations.length) {
    return `📊 ${agentName}, hoy no se analizaron llamadas.\n\n¡Sube tus llamadas para recibir feedback! 💪`;
  }

  const avgScore = Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length);
  const allPositives = evaluations.flatMap(e => e.positives ? [e.positives] : []);
  const allImprovements = evaluations.flatMap(e => e.improvements ? [e.improvements] : []);
  const allRecs = evaluations.flatMap(e => e.recommendations ? [e.recommendations] : []);

  return `📊 *Tu resumen de hoy, ${agentName}:*

Llamadas analizadas: ${evaluations.length}
Puntuación promedio: ${avgScore}/100

✅ *Lo que hiciste bien:*
${allPositives.slice(0, 2).map(p => `• ${p.substring(0, 120)}`).join('\n')}

⚠️ *Áreas de mejora:*
${allImprovements.slice(0, 2).map(i => `• ${i.substring(0, 120)}`).join('\n')}

💡 *Para mañana:*
${allRecs.slice(0, 1).map(r => r.substring(0, 200)).join('\n')}

¡Sigue adelante, estás progresando! 💪`;
}
