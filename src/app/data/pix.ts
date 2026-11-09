import { encode } from 'uqr';

export const PIX_KEY = '9597e253-d54d-48c7-91a9-b2c69f3a13e6';
const MERCHANT_NAME = 'Vitor e Ana';
const MERCHANT_CITY = 'BRASIL';
const MERCHANT_ACCOUNT_LIMIT = 99;

function emv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

function asciiLabel(value: string, maxLength: number): string {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.slice(0, maxLength);
}

/** CRC-16/CCITT-FALSE. O Pix calcula o CRC sobre o BR Code já incluindo o prefixo 6304. */
function crc16(payload: string): string {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index++) {
    crc ^= payload.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Pix sem valor: a pessoa informa o preço no banco e o dinheiro cai nesta mesma chave. */
export function buildUniversalPixPayload(): string {
  return assemblePix();
}

export function buildPixPayload(amount: number, description: string): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Valor do Pix inválido.');
  }

  return assemblePix(amount.toFixed(2), description);
}

function assemblePix(amount?: string, description?: string): string {
  const guiField = emv('00', 'br.gov.bcb.pix');
  const keyField = emv('01', PIX_KEY);
  const descriptionRoom = MERCHANT_ACCOUNT_LIMIT - guiField.length - keyField.length - 4;
  const cleanDescription = description
    ? asciiLabel(description, Math.max(descriptionRoom, 0))
    : '';
  const merchantAccount =
    guiField + keyField + (cleanDescription ? emv('02', cleanDescription) : '');

  const payload = [
    emv('00', '01'),
    emv('26', merchantAccount),
    emv('52', '0000'),
    emv('53', '986'),
    amount ? emv('54', amount) : '',
    emv('58', 'BR'),
    emv('59', asciiLabel(MERCHANT_NAME, 25)),
    emv('60', asciiLabel(MERCHANT_CITY, 15)),
    emv('62', emv('05', '***')),
    '6304',
  ].join('');

  return payload + crc16(payload);
}

export function pixQrDataUrl(payload: string): string {
  const qr = encode(payload, { ecc: 'M', border: 2 });
  const scale = 6;
  const canvas = document.createElement('canvas');
  canvas.width = qr.size * scale;
  canvas.height = qr.size * scale;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível gerar o QR Code.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#404951';

  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.data[y]?.[x]) {
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL('image/png');
}
