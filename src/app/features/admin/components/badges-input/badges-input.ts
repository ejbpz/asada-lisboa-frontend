import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { CategoriesApi } from '@core/services/categories-api';
import { CategoriesResponse } from '@shared/interfaces/categories-response.interface';

@Component({
  selector: 'badges-input',
  imports: [LowerCasePipe, TitleCasePipe],
  templateUrl: './badges-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BadgesInput),
      multi: true,
    }
  ]
})
export class BadgesInput implements ControlValueAccessor {
  // Init
  protected disabled = false;
  protected inputValue = signal<string>('');
  protected badges = signal<CategoriesResponse[]>([]);

  // Injection
  private categoriesApiService = inject(CategoriesApi);

  // Search category
  private search$ = toObservable(this.inputValue)
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
    );

  protected readonly categoriesSearchResource = rxResource({
    params: () => this.search$,
    stream: ({ params }) => {
      return params.pipe(
        switchMap(query => {
          const q = query.trim().toLowerCase();
          return q.length >= 2
            ? this.categoriesApiService.searchCategories(q)
            : of([])
        })
      )
    }
  });

  protected filteredSuggestions = computed(() => {
    const suggestions = this.categoriesSearchResource.value() ?? [];
    const selected = this.badges();

    return suggestions.filter(s =>
      !selected.some(c =>
        c.name.trim().toLowerCase() === s.name.trim().toLowerCase()
      )
    );
  });

  // ControlValueAccessor methods
  private onChange = (_: CategoriesResponse[]) => {};
  protected onTouched = () => {};

  writeValue(value: CategoriesResponse[] | undefined): void {
    this.badges.set(value ?? []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Actions
  protected onInput(event: Event): void {
    if(this.disabled)
      return;

    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if(this.disabled)
      return;

    if(event.key === 'Enter') {
      event.preventDefault();

      const value = this.inputValue().trim().toLowerCase();

      if(!value)
        return;

      this.addBadge({
        id: null,
        name: value,
      });

      this.inputValue.set('');
    }

    if(event.key === ',' || event.code === 'Comma') {
      event.preventDefault();

      const raw = this.inputValue().toLowerCase();
      const parts = raw.split(',');

      for (const part of parts) {
        const value = part.trim();
        if (!value) continue;

        this.addBadge({
          id: null,
          name: value
        });
      }

      this.inputValue.set('');
    }
  }

  protected selectSuggestion(badge: any): void {
    if(this.disabled)
      return;

    this.addBadge({
      id: badge.id,
      name: badge.name
    });

      this.inputValue.set('');
  }

  private addBadge(badge: CategoriesResponse): void {
    const exists = this.badges().some(
      b => b.name.trim().toLowerCase() === badge.name.trim().toLowerCase()
    );

    if(exists)
      return;

    const updated = [...this.badges(), badge]
    this.badges.set(updated);
    this.onChange(updated);
  }

  protected removeBadge(index: number): void {
    if(this.disabled)
      return;

    const updated = this.badges().filter((_, i) => i !== index);
    this.badges.set(updated);
    this.onChange(updated);
  }
}
