import { Router } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'badges-carousel',
  imports: [LowerCasePipe],
  templateUrl: './badges-carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgesCarousel implements AfterViewInit {
  // Input signal
  public badges = input<string[] | undefined>(undefined);

  // View child
  protected container = viewChild<ElementRef<HTMLDivElement>>('container');

  // Injection
  private router = inject(Router);

  // Init
  isAtEnd = signal<boolean>(false);
  isAtStart = signal<boolean>(true);
  hasOverflow = signal<boolean>(false);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.updateState();
  }

  // Dynamic changes
  refreshEffect = effect(() => {
    this.badges();
    queueMicrotask(() => this.updateState());
  });

  // Check state of the container.
  private updateState(): void {
    const containerElement = this.container()?.nativeElement;
    if(!containerElement)
      return;

    const hasScroll = containerElement.scrollWidth > containerElement.clientWidth;

    this.hasOverflow.set(hasScroll);
    this.isAtStart.set(containerElement.scrollLeft <= 0);
    this.isAtEnd.set((containerElement.scrollLeft + containerElement.clientWidth) >= containerElement.scrollWidth - 1);
  }

  onScroll(): void {
    this.updateState();
  }

  // Scroll backward and forward
  scrollBackward(): void {
    const containerElement = this.container()?.nativeElement;
    if(!containerElement)
      return;

    containerElement.scrollBy({
      left: -containerElement.clientWidth * 0.8,
      behavior: 'smooth'
    });
  }

  scrollForward(): void {
    const containerElement = this.container()?.nativeElement;
    if(!containerElement)
      return;

    containerElement.scrollBy({
      left: containerElement.clientWidth * 0.8,
      behavior: 'smooth'
    });
  }

  // Search by category
  protected searchBadge(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
