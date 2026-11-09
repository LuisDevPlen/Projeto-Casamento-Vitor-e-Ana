import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { openWhatsApp } from '../../data/whatsapp';

@Component({
  selector: 'app-rsvp-section',
  imports: [FormsModule],
  templateUrl: './rsvp-section.html',
})
export class RsvpSection {
  protected readonly submitted = signal(false);
  protected readonly tried = signal(false);

  protected name = '';
  protected attending: 'sim' | 'nao' = 'sim';
  protected adults = 1;
  protected children = 0;
  protected phone = '';
  protected notes = '';
  protected accepted = false;

  protected readonly quantities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  protected confirm(event: Event): void {
    event.preventDefault();
    this.tried.set(true);

    if (!this.name.trim() || !this.accepted) {
      return;
    }

    openWhatsApp(this.presenceMessage());
    this.submitted.set(true);
  }

  private presenceMessage(): string {
    const going = this.attending === 'sim';
    const lines = [
      'Olá, Vitor e Ana! \u{1F49B}',
      '',
      going
        ? 'Que alegria poder celebrar com vocês! Confirmo minha presença no casamento.'
        : 'Obrigado pelo convite com tanto carinho. Infelizmente não vou conseguir comparecer, mas desejo um casamento lindo e cheio de felicidade.',
      '',
      `\u{1F464} Nome: ${this.name.trim()}`,
      going ? '\u{2705} Presença confirmada' : '\u{1F90D} Não vou poder comparecer',
    ];

    if (going) {
      lines.push(`\u{1F465} Adultos, contando comigo: ${this.adults}`);
      lines.push(`\u{1F476} Crianças: ${this.children}`);
    }

    if (this.phone.trim()) {
      lines.push(`\u{1F4DE} Telefone: ${this.phone.trim()}`);
    }

    if (this.notes.trim()) {
      lines.push(`\u{1F4DD} Observações: ${this.notes.trim()}`);
    }

    lines.push('', going ? 'Um abraço! Até o grande dia! \u{1F942}' : 'Um abraço! \u{1F49B}');
    return lines.join('\n');
  }
}
