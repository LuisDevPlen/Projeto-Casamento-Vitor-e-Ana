import { Component, DestroyRef, inject, signal } from '@angular/core';

const WEDDING_AT = new Date('2026-11-26T00:00:00-03:00').getTime();

interface RemainingTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-countdown-section',
  templateUrl: './countdown-section.html',
})
export class CountdownSection {
  protected readonly remaining = signal<RemainingTime>(this.readRemaining());

  constructor() {
    const timer = setInterval(() => this.remaining.set(this.readRemaining()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  private readRemaining(): RemainingTime {
    const distance = Math.max(WEDDING_AT - Date.now(), 0);
    const days = Math.floor(distance / 86_400_000);
    const hours = Math.floor((distance % 86_400_000) / 3_600_000);
    const minutes = Math.floor((distance % 3_600_000) / 60_000);
    const seconds = Math.floor((distance % 60_000) / 1000);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }
}
