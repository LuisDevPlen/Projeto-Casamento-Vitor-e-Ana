const WHATSAPP_NUMBER = '553496663050';

function isMobile(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}

/** A página do WhatsApp troca emoji por interrogação. O aplicativo e o WhatsApp Web preservam. */
export function whatsAppUrl(message: string, userAgent: string): string {
  const text = encodeURIComponent(message);
  const endpoint = isMobile(userAgent) ? 'whatsapp://send' : 'https://web.whatsapp.com/send';

  return `${endpoint}?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

export function openWhatsApp(message: string): void {
  const url = whatsAppUrl(message, navigator.userAgent);

  if (url.startsWith('whatsapp:')) {
    window.location.assign(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
