import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormUtils } from '@shared/utils/form-utils';
import { AboutUsApi } from '@core/services/about-us-api';
import { BreakLinePipe } from '@shared/pipes/break-line-pipe';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { AboutUsRequest } from '@admin/interfaces/about-us-request.interface';
import { AboutUsResponse } from '@public/interfaces/about-us-response.interface';

@Component({
  selector: 'admin-about-us-list',
  imports: [ReactiveFormsModule, BreakLinePipe],
  templateUrl: './admin-about-us-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-wrap items-center gap-2'
  }
})
export class AdminAboutUsList {
  // Init
  protected isLoading = signal<boolean>(false);
  private isError = signal<string | null>(null);
  private isSuccess = signal<string | null>(null);
  protected aboutUs = signal<AboutUsResponse[]>([]);
  protected selectedId = signal<string | null>(null);
  protected selectedAboutUs = signal<AboutUsResponse | null>(null);

  // Injection
  private aboutUsApi = inject(AboutUsApi);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);

  // Input signal
  public aboutUsInput = input.required<AboutUsResponse[]>();

  // View child
  private deleteModal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteAboutUsModal');
  private createEditModal = viewChild.required<ElementRef<HTMLDialogElement>>('createEditAboutUsModal');

  // Asign effect
  private initialized = false;

  private syncEffect = effect(() => {
    const incoming = this.aboutUsInput();

    if (!this.initialized && incoming.length > 0) {
      this.aboutUs.set([...incoming]);
      this.initialized = true;
    }
  });

  // Form
  protected aboutUsForm: FormGroup = this.formBuilder.group({
    content: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(2500)]],
    sectionType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    order: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern(FormUtils.numberPattern)]],
  });

  // OnSubmit form
  protected onAboutUsForm() {
    if (this.aboutUsForm.invalid) {
      this.aboutUsForm.markAllAsTouched();
      return;
    }

    this.createEditContactSection(this.aboutUsForm.value, this.selectedAboutUs()?.id);
  }

  // Delete about us section
  protected openDeleteModal(id: string): void {
    this.selectedId.set(id);
    this.deleteModal().nativeElement.showModal();
  }

  protected closeDeleteModal(): void {
    this.selectedId.set(null);
    this.deleteModal().nativeElement.close();
  }

  protected confirmDelete(): void {
    const id = this.selectedId();
    if (!id) return;

    this.deleteAboutUsSection(id);
    this.selectedId.set(null);
    this.selectedAboutUs.set(null);
  }

  // Create or edit contact section
  protected openCreateEditModal(aboutUs: AboutUsResponse | null = null): void {
    this.selectedAboutUs.set(aboutUs);
    this.createEditModal().nativeElement.showModal();
  }

  protected closeCreateEditModal(): void {
    this.selectedAboutUs.set(null);
    this.createEditModal().nativeElement.close();
  }

  private removeAboutUsSectionFromList(id: string): void {
    this.aboutUs.set(this.aboutUsInput().filter((value: AboutUsResponse) => value.id != id))
  }

  // API - Delete about us section
  private deleteAboutUsSection(id: string) {
    if(this.isLoading())
      return;

    this.isError.set(null)
    this.isLoading.set(true);

    this.aboutUsApi.deleteAboutUs(id)
      .subscribe({
        next: () => {
          this.isError.set(null);
          this.isSuccess.set('Sección \'nosotros\' eliminado con éxito.');
          this.removeAboutUsSectionFromList(id);
          this.isLoading.set(false);
        },
        error: (error: AppError) => {
          this.isSuccess.set(null);
          this.isError.set(error.message);
          this.isLoading.set(false);
        }
      })
  }

  // API - Create or update about us
  private createEditContactSection(aboutUsRequest: AboutUsRequest, id: string | undefined) {
    if(this.isLoading())
      return;

    this.isError.set(null)
    this.isLoading.set(true);

    this.aboutUsApi.createOrEditAboutUs(aboutUsRequest, id)
      .subscribe({
        next: (value: AboutUsResponse) => {
          this.isError.set(null);
          this.isSuccess.set('Información de la institución agregada con éxito.');
          this.updateAboutUsFromList(value);
          this.closeCreateEditModal();
          this.isLoading.set(false);
        },
        error: (error: AppError) => {
          this.isSuccess.set(null);
          this.isError.set(error.message);
          this.isLoading.set(false);
        }
      })
  }

  // Form patch
  private createEditPatchContent = effect(() => {
    if(this.selectedAboutUs())
      this.aboutUsForm.patchValue({
        order: this.selectedAboutUs()?.order,
        content: this.selectedAboutUs()?.content,
        sectionType: this.selectedAboutUs()?.sectionType,
      });

    else
      this.aboutUsForm.reset();
  })

  // Update contacts
  private updateAboutUsFromList(contact: AboutUsResponse): void {
    this.aboutUs.update(values => {
      const exists = values.some(v => v.id === contact.id);

      if (exists) {
        return values.map(v =>
          v.id === contact.id ? contact : v
        );
      }

      return [...values, contact];
    });
  }

  private removeAboutUsFromList(id: string): void {
    this.aboutUs.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(
      this.isError() ? this.isError() : this.isSuccess(),
      this.isError() ? '❌' : '✔'
    );

    this.isError.set(null);
    this.isSuccess.set(null);
  });
}
