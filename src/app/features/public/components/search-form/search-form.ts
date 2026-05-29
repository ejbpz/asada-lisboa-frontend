import { RouterLink } from "@angular/router";
import { TitleCasePipe } from "@angular/common";
import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, of } from "rxjs";
import { FormUtils } from '@shared/utils/form-utils';
import { SearchApi } from '@core/services/search-api';
import { AppError } from "@core/interfaces/app-error.interface";

@Component({
  selector: 'search-form',
  imports: [ReactiveFormsModule, RouterLink, TitleCasePipe],
  templateUrl: './search-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col justify-center items-center'
  }
})
export class SearchForm {
  // Init
  private query = signal<string>('');

  // Injections
  private searchApi = inject(SearchApi);
  private formBuilder = inject(FormBuilder);

  // Form
  protected searchForm: FormGroup = this.formBuilder.group({
    query: ['', [Validators.required, Validators.minLength(2)]]
  });

  // OnSubmit form
  protected onSearch(event: Event) {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      this.query.set(inputElement.value);
    }, 300);
  }

  // Resource
  public searchResource = rxResource({
    params: () => this.query(),
    stream: ({ params }) => this.searchApi.searchPublicData(params).pipe(
      catchError((error: AppError) => {
        return of(undefined);
      })
    )
  });

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
