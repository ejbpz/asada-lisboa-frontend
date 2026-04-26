import { ChangeDetectionStrategy, Component, effect, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { ImagesCard } from "@shared/components/images-card/images-card";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'gallery-list',
  imports: [ImagesCard],
  templateUrl: './gallery-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full [column-width:250px] gap-3 space-y-3 my-5',
    '(keydown.escape)': 'onKeyboardPress($event)',
    '(keydown.arrowleft)': 'onKeyboardPress($event)',
    '(keydown.arrowright)': 'onKeyboardPress($event)',
  }
})
export class GalleryList implements OnInit {
  // Init
  protected generateContent = GenerateContent;

  protected currentIndex = signal<number>(0);
  protected totalImageCount = signal<number>(0);
  protected controls = signal<boolean>(true);
  protected showMask = signal<boolean>(false);
  protected showCount = signal<boolean>(false);
  protected previewImage = signal<boolean>(false);
  protected currentLightboxImage = signal<ImageMinimalResponse | null>(null);

  // Input signal
  public images = input.required<ImageMinimalResponse[]>();

  // View child
  protected lightboxContainer = viewChild<ElementRef<HTMLDivElement>>('lightbox');

  // constructor
  constructor() {
    effect(() => {
      if (this.showMask()) {
        queueMicrotask(() => {
          this.lightboxContainer()?.nativeElement.focus();
        });
      }
    });
  }

  // OnInit
  ngOnInit(): void {
    this.totalImageCount.set(this.images().length);

    if(this.totalImageCount() >= 1)
      this.currentLightboxImage.set(this.images()[0]);
  }

  // Lightbox method
  onClickImage(index: number): void {
    this.showMask.set(true);
    this.showCount.set(true);
    this.previewImage.set(true);
    this.currentIndex.set(index);
    this.currentLightboxImage.set(this.images()[index]);
  }

  onCloseImage() {
    this.showMask.set(false);
    this.showCount.set(false);
    this.previewImage.set(false);
    this.currentIndex.set(0);
    this.currentLightboxImage.set(null);
  }

  nextImage(): void {
    this.currentIndex.update((value) => value + 1);
    if(this.currentIndex() > (this.totalImageCount() - 1)) {
      this.currentIndex.set(0);
    }
    this.currentLightboxImage.set(this.images()[this.currentIndex()]);
  }

  previousImage(): void {
    this.currentIndex.update((value) => value - 1);
    if(this.currentIndex() < 0) {
      this.currentIndex.set(this.totalImageCount() - 1);
    }
    this.currentLightboxImage.set(this.images()[this.currentIndex()]);
  }

  onKeyboardPress(event: Event) {
    event.preventDefault();

    if (!this.showMask()) return;

    if(event.type !== 'keydown')
      return;

    const keyboardEvent = event as KeyboardEvent;

    switch(keyboardEvent.key) {
      case 'ArrowLeft':
        this.previousImage();
        return;
        case 'ArrowRight':
        this.nextImage();
        return;
      case 'Escape':
        this.onCloseImage();
        return;
      default:
        return;
    }
  }
}
