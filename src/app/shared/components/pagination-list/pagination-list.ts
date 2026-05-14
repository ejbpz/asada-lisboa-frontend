import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output
} from '@angular/core';

@Component({
  selector: 'pagination-list',
  imports: [],
  templateUrl: './pagination-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class PaginationList {
  // Output signal
  public emmitOffset = output<number>();

  // Constant value
  protected readonly pageSize = 8;

  // Input signals
  public offset = input.required<number>();
  public total = input.required<number>();

  // Safe numeric offset
  protected currentOffset = computed(() => Number(this.offset()));

  // Current page
  protected page = computed(() => {
    return Math.floor(this.currentOffset() / this.pageSize) + 1;
  });

  // Total pages
  protected maxPages = computed(() => {
    return Math.ceil(Number(this.total()) / this.pageSize);
  });

  // Previous page
  protected beforePage() {
    if (this.page() <= 1)
      return;

    const newOffset = this.currentOffset() - this.pageSize;

    this.emmitOffset.emit(Math.max(newOffset, 0));
  }

  // Next page
  protected nextPage() {
    if (this.page() >= this.maxPages())
      return;

    const newOffset = this.currentOffset() + this.pageSize;

    this.emmitOffset.emit(newOffset);
  }
}
