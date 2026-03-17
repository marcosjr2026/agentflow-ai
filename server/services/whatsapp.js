// ─── SERVICIO DE WHATSAPP (360Dialog) ────────────────────────────────────────

/**
 * Envía un mensaje de texto por WhatsApp
 * @param {string} to - Número en formato E.164 (ej: +17861234567)
 * @param {string} text - Texto del mensaje
 * @param {string} apiKey - API key de 360Dialog de la agencia
 */
export async function sendTextMessage(to, text, apiKey) {
  const key = apiKey || process.env.DEFAULT_WABA_API_KEY;

  const response = await fetch('https://waba-v2.360dialog.io/messages', {
    method: 'POST',
    headers: {
      'D360-API-KEY': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizePhone(to),
      type: 'text',
      text: { body: text },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error WhatsApp: ${JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Envía un documento/PDF por WhatsApp
 * @param {string} to - Número destino
 * @param {string} documentUrl - URL pública del documento
 * @param {string} caption - Texto acompañante
 * @param {string} filename - Nombre del archivo
 * @param {string} apiKey - API key de la agencia
 */
export async function sendDocument(to, documentUrl, caption, filename, apiKey) {
  const key = apiKey || process.env.DEFAULT_WABA_API_KEY;

  const response = await fetch('https://waba-v2.360dialog.io/messages', {
    method: 'POST',
    headers: {
      'D360-API-KEY': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizePhone(to),
      type: 'document',
      document: {
        link: documentUrl,
        caption,
        filename,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Error WhatsApp: ${JSON.stringify(data)}`);
  return data;
}

/**
 * Normaliza un número de teléfono a formato E.164
 */
export function normalizePhone(phone) {
  // Remover todo excepto dígitos
  const digits = phone.replace(/\D/g, '');
  // Si no empieza con +, agregar +1 para US
  if (!phone.startsWith('+')) {
    return `+1${digits}`;
  }
  return `+${digits}`;
}

/**
 * Respuesta automática inicial al recibir un mensaje
 */
export const AUTO_RESPONSES = {
  initial: (name) =>
    `Hola${name ? ` ${name}` : ''} 👋, gracias por escribirnos.\nEn breve uno de nuestros asesores te atiende.\n\nSi tu consulta es urgente, escribe *URGENTE*.`,

  waiting: () =>
    `Estamos revisando tu consulta, dame unos minutos por favor. 🙏`,

  appointmentReceived: () =>
    `Con gusto te ayudamos con tu cita. En breve uno de nuestros asesores te envía la información disponible.`,

  documentRequest: (documents) =>
    `Para completar tu proceso necesitamos los siguientes documentos:\n\n${documents.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nPor favor envíalos por este chat en formato imagen o PDF.`,

  paymentReminder: (name, amount, date) =>
    `Hola ${name} 👋, te recordamos que el *${date}* se procesará tu pago mensual de *$${amount}*.\nAsegúrate de tener fondos disponibles.`,

  paymentToday: (name, amount) =>
    `${name}, hoy es el día de tu pago mensual de *$${amount}*.\nTe avisaremos cuando se confirme. ✅`,

  paymentFailed: (name, amount) =>
    `${name}, hubo un problema procesando tu pago de *$${amount}*.\nPor favor contáctanos para resolverlo lo antes posible. 📞`,

  paymentConfirmed: (name, amount) =>
    `${name} ✅ tu pago de *$${amount}* fue procesado exitosamente.\n¡Gracias por tu puntualidad!`,
};
