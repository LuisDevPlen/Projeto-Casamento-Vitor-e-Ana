const WHATSAPP_NUMBER = '553496663050';

export function openWhatsApp(message: string): void {
  // wa.me redireciona e troca emoji por um losango. O link direto preserva os emoji.
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
