import { Component, DestroyRef, HostListener, afterNextRender, computed, inject, signal } from '@angular/core';
import { GIFTS, Gift } from '../../data/gifts';
import { PIX_KEY, buildPixPayload, buildUniversalPixPayload, pixQrDataUrl } from '../../data/pix';
import { openWhatsApp } from '../../data/whatsapp';

type GiftSort = 'az' | 'menor' | 'maior';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.html',
})
export class GiftList {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sort = signal<GiftSort>('az');
  protected readonly selected = signal<Gift | null>(null);
  protected readonly pixCode = signal('');
  protected readonly qrCode = signal('');
  protected readonly pixError = signal('');
  protected readonly copied = signal(false);
  protected readonly copyHint = signal('');
  protected readonly pixKey = PIX_KEY;
  protected readonly universalCode = signal('');
  protected readonly universalQr = signal('');
  protected readonly universalCopied = signal(false);
  protected readonly universalHint = signal('');

  constructor() {
    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });

    afterNextRender(() => {
      try {
        const code = buildUniversalPixPayload();
        this.universalCode.set(code);
        this.universalQr.set(pixQrDataUrl(code));
      } catch {
        this.universalCode.set('');
        this.universalQr.set('');
      }
    });
  }

  protected readonly gifts = computed(() => {
    const items = [...GIFTS];
    const sort = this.sort();

    if (sort === 'menor') {
      return items.sort((left, right) => left.valor - right.valor);
    }

    if (sort === 'maior') {
      return items.sort((left, right) => right.valor - left.valor);
    }

    return items.sort((left, right) => left.nome.localeCompare(right.nome, 'pt-BR'));
  });

  protected price(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  protected present(gift: Gift): void {
    this.copied.set(false);
    this.copyHint.set('');

    try {
      const code = buildPixPayload(gift.valor, gift.nome);
      this.pixCode.set(code);
      this.qrCode.set(pixQrDataUrl(code));
      this.pixError.set('');
    } catch {
      this.pixCode.set('');
      this.qrCode.set('');
      this.pixError.set('Não foi possível gerar o Pix deste presente.');
    }

    this.selected.set(gift);
    document.body.style.overflow = 'hidden';
  }

  protected close(): void {
    this.selected.set(null);
    this.pixCode.set('');
    this.qrCode.set('');
    this.pixError.set('');
    this.copied.set(false);
    this.copyHint.set('');
    document.body.style.overflow = '';
  }

  protected async copyPix(): Promise<void> {
    const code = this.pixCode();
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
      this.copyHint.set('');
      return;
    } catch {
      const field = document.getElementById('pix-code');
      if (field instanceof HTMLTextAreaElement) {
        field.focus();
        field.select();
      }
      this.copied.set(false);
      this.copyHint.set('Selecione o código acima e copie.');
    }
  }

  protected async copyUniversalPix(): Promise<void> {
    const code = this.universalCode();
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      this.universalCopied.set(true);
      this.universalHint.set('');
      return;
    } catch {
      const field = document.getElementById('pix-universal');
      if (field instanceof HTMLTextAreaElement) {
        field.focus();
        field.select();
      }
      this.universalCopied.set(false);
      this.universalHint.set('Selecione o código acima e copie.');
    }
  }

  protected notifyCouple(): void {
    const gift = this.selected();
    if (!gift) {
      return;
    }

    openWhatsApp(this.giftMessage(gift));
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    if (this.selected()) {
      this.close();
    }
  }

  private giftMessage(gift: Gift): string {
    return [
      'Olá, Vitor e Ana!',
      '',
      'Escolhi um presente da lista de vocês e vou enviar o valor por Pix:',
      '',
      `Presente: ${gift.nome}`,
      `Valor: ${this.price(gift.valor)}`,
      '',
      'Meu nome:',
      '',
      'Estou muito feliz por vocês!',
    ].join('\n');
  }

  protected onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'az' || value === 'menor' || value === 'maior') {
      this.sort.set(value);
    }
  }
}
