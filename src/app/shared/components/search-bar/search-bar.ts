import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule }from "@angular/forms";
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { SortDirection } from '@shared/enums/sort-direction.enum';
import { SearchSortRequest } from '@shared/interfaces/search-sort-request.interface';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'search-bar',
  imports: [ReactiveFormsModule, TitleCasePipe, LowerCasePipe],
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
}) export class SearchBar implements OnInit {
  // Init
  protected SortDirection = SortDirection;

  // Input signals
  public stateValue = input.required<SearchSortRequest>();
  public sortBy = input.required<{ value: string, name: string }[]>();
  public filterBy = input.required<{ value: string, name: string }[]>();

  // Output signal
  public emitSearch = output<SearchSortRequest | undefined>();

  // Injection
  private formBuilder = inject(FormBuilder);

  // Search form
  protected searchForm: FormGroup = this.formBuilder.group({
    search: [''],
    sortBy: [''],
    filterBy: [''],
    sortDirection: [SortDirection.ASC],
  });

  // Constructor
  constructor() {
    this.searchForm.valueChanges.pipe(
      skip(1),
      debounceTime(300),
      filter((value: SearchSortRequest) => {
        return !!value.search?.trim();
      }),
      distinctUntilChanged((a, b) =>
        a.search === b.search &&
        a.sortBy === b.sortBy &&
        a.filterBy === b.filterBy &&
        a.sortDirection === b.sortDirection
      ),
      takeUntilDestroyed(),
    ).subscribe((value: SearchSortRequest) => {
      this.emitSearch.emit(value);
    });
  }

  // OnInit
  ngOnInit(): void {
    this.searchForm.patchValue({
      search: this.stateValue().search,
      sortBy: this.stateValue().sortBy,
      filterBy: this.stateValue().filterBy,
      sortDirection: this.stateValue().sortDirection,
    });
  }

  // Toggle sort value
  toggleSort() {
  const current = this.stateValue().sortDirection;
  this.searchForm.patchValue({
    sortDirection: current === SortDirection.ASC
      ? SortDirection.DESC
      : SortDirection.ASC
    });
  }
}
