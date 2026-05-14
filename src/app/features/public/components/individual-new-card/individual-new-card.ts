import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { BreakLinePipe } from '@shared/pipes/break-line-pipe';
import { GenerateContent } from '@shared/utils/generate-content';
import { NewResponse } from '@shared/interfaces/new-response.interface';

@Component({
  selector: 'individual-new-card',
  imports: [DatePipe, BreakLinePipe],
  styleUrl: './individual-new-card.css',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './individual-new-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-hidden px-5',
    '(keydown.escape)': 'closeLightbox()'
  }
})
export class IndividualNewCard {
  // Init
  protected showLightbox = signal(false);
  protected generateContent = GenerateContent;
  protected currentImage = signal<string | null>(null);
  protected lightboxContainer = viewChild<ElementRef<HTMLDivElement>>('lightbox');

  // Input signal
  public newData = input.required<NewResponse>();

  // Helper methods
  protected sameDate(): boolean {
    return this.newData().publicationDate.getTime === this.newData().lastEditionDate.getTime;
  }

  // constructor
  constructor() {
    effect(() => {
      if (this.showLightbox()) {
        queueMicrotask(() => {
          this.lightboxContainer()?.nativeElement.focus();
        });
      }
    });
  }

  // Image lightbox
  onContentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.tagName !== 'IMG') return;

    const img = target as HTMLImageElement;

    this.currentImage.set(img.src);
    this.showLightbox.set(true);
  }

  closeLightbox(): void {
    if(!this.showLightbox())
      return;

    this.showLightbox.set(false);
    this.currentImage.set(null);
  }
}
