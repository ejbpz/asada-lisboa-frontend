import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
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

  // Init signals
  public maxIndex = signal<boolean>(false);
  public minIndex = signal<boolean>(true);

  // Document child
  private carouselReference = viewChild<ElementRef<HTMLDivElement>>('carousel');

  // Init defaults
  private cardWidth: number = 0;
  private cardGap: number = 20;

  // AfterViewInit
  ngAfterViewInit(): void {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    if (!carousel.children.length) return;

    const firstCard = carousel.children[0] as HTMLElement;
    this.cardWidth = firstCard.clientWidth;

    carousel.addEventListener('scroll', () => {
      this.updateLimits();
    });

    this.updateLimits();
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
