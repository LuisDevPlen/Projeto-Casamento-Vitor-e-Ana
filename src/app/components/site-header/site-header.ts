import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  protected readonly pinned = signal(false);
  protected readonly open = signal(false);

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.pinned.set(window.scrollY > 24);
  }

  protected toggle(): void {
    this.open.update((isOpen) => !isOpen);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
