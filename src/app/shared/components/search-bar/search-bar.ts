import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule }from "@angular/forms";
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { SortDirection } from '@shared/enums/sort-direction.enum';
import { SearchSortRequest } from '@shared/interfaces/search-sort-request.interface';

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
    let previousRequest: SearchSortRequest | null = null;

    this.searchForm.valueChanges.pipe(
      skip(1),
      debounceTime(400),
      distinctUntilChanged((a, b) =>
        a.search === b.search &&
        a.sortBy === b.sortBy &&
        a.filterBy === b.filterBy &&
        a.sortDirection === b.sortDirection
      ),
      takeUntilDestroyed(),
    ).subscribe((value: SearchSortRequest) => {
      if(!previousRequest) {
        previousRequest = value;
        this.emitSearch.emit(value);
        return;
      }

      const searchChanged = value.search !== previousRequest.search;
      const sortByChanged = value.sortBy !== previousRequest.sortBy;
      const filterByChanged = value.filterBy !== previousRequest.filterBy;
      const sortDirectionChanged = value.sortDirection !== previousRequest.sortDirection;

      if(searchChanged) {
        this.emitSearch.emit(value);
      }
      else if(filterByChanged) {
        if(value.search?.trim()) {
          this.emitSearch.emit(value);
        }
      }
      else if(sortByChanged || sortDirectionChanged) {
        this.emitSearch.emit(value);
      }

      previousRequest = value;
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
