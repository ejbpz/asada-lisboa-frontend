import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { NewsCard } from "@shared/components/news-card/news-card";

@Component({
  selector: 'carousel-news',
  imports: [NewsCard],
  templateUrl: './carousel-news.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselNews {
  // private readonly newsService: NewsService = inject(NewsService);
  // public news: NewsInterface[] = this.newsService.data;

  public maxIndex = signal<boolean>(false);
  public minIndex = signal<boolean>(true);

  private carouselReference = viewChild<ElementRef<HTMLDivElement>>('carousel');

  private cardWidth: number = 0;
  private cardGap: number = 20;

  ngAfterViewInit(): void {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    const firstCard = carousel.children[0] as HTMLElement;
    this.cardWidth = firstCard.clientWidth;

    carousel.addEventListener('scroll', () => {
      this.updateLimits();
    });

    this.updateLimits();
  }

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

  private updateLimits() {
    const carousel = this.carouselReference()?.nativeElement;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    // margen de tolerancia por decimales
    const tolerance = 2;

    this.minIndex.set(carousel.scrollLeft <= tolerance);
    this.maxIndex.set(carousel.scrollLeft >= maxScrollLeft - tolerance);
  }
}
