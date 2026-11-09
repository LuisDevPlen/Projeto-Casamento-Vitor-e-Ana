import { Component } from '@angular/core';
import { CountdownSection } from './components/countdown-section/countdown-section';
import { CoupleSection } from './components/couple-section/couple-section';
import { GiftList } from './components/gift-list/gift-list';
import { HeroSection } from './components/hero-section/hero-section';
import { IntroSection } from './components/intro-section/intro-section';
import { RsvpSection } from './components/rsvp-section/rsvp-section';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [
    SiteHeader,
    HeroSection,
    IntroSection,
    CountdownSection,
    CoupleSection,
    GiftList,
    RsvpSection,
    SiteFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
