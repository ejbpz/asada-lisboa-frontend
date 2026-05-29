import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { NewsCard } from "@shared/components/news-card/news-card";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'carousel-news',
  imports: [NewsCard],
  templateUrl: './carousel-news.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselNews {
  // Input signal
  public news = input.required<NewMinimalResponse[] | undefined>();

  // Injection
  private readonly platformId = inject(PLATFORM_ID);

  // Init signals
  public maxIndex = signal<boolean>(false);
  public minIndex = signal<boolean>(true);

  // Document child
  private carouselReference = viewChild<ElementRef<HTMLDivElement>>('carousel');

  // Init defaults
  private cardGap: number = 12;
  private cardWidth: number = 280;
  private resizeObserver?: ResizeObserver;

  // AfterViewInit
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId))
      return;

    const carousel = this.carouselReference()?.nativeElement;

    if (!carousel)
      return;

    const updateCardWidth = () => {
      const firstCard = carousel.children[0] as HTMLElement;

      if (!firstCard) return;

      this.cardWidth = firstCard.getBoundingClientRect().width;
    };

    updateCardWidth();

    this.resizeObserver = new ResizeObserver(() => {
      updateCardWidth();
    });

    this.resizeObserver.observe(carousel);

    carousel.addEventListener('scroll', () => {
      this.updateLimits();
    });

    this.updateLimits();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  // Carousel methods
  public scrollRight() {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    const step = this.cardWidth + this.cardGap;

    carousel.scrollBy({
      left: step,
      behavior: 'smooth',
    });

    setTimeout(() => this.updateLimits(), 300);
  }

  public scrollLeft() {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    const step = this.cardWidth + this.cardGap;

    carousel.scrollBy({
      left: -step,
      behavior: 'smooth',
    });

    setTimeout(() => this.updateLimits(), 300);
  }

  // Update minimum and maximum
  private updateLimits() {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    const tolerance = 2;

    this.minIndex.set(carousel.scrollLeft <= tolerance);
    this.maxIndex.set(carousel.scrollLeft >= maxScrollLeft - tolerance);
  }
}
