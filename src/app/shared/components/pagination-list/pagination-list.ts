import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

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
  protected pageSize = 8;

  // Input signals
  public offset = input.required<number>();
  public total = input.required<number>();

  // Computed signal
  protected page = computed(() => {
    const offset = Math.max(this.offset(), 0);

    if(offset === 0)
      return offset + 1;

    return Math.floor(offset / this.pageSize) + 1;
  });

  protected maxPages = computed(() => {
    return Math.ceil(Math.max(this.total(), 1) / this.pageSize);
  });

  // Before and next
  protected beforePage() {
    if(this.page() <= 1) return;

    const newOffset = this.offset() - this.pageSize;
    this.emmitOffset.emit(Math.max(newOffset, 0));
  }

  protected nextPage() {
    if(this.page() >= this.maxPages())
      return;

    const newOffset = this.offset() + this.pageSize;
    this.emmitOffset.emit(newOffset);
  }
}
