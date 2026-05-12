import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { BreakLinePipe } from '@shared/pipes/break-line-pipe';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { ContactRequest } from '@admin/interfaces/contact-request.interface';
import { ContactResponse } from '@public/interfaces/contact-response.interface';

@Component({
  selector: 'admin-contacts-list',
  imports: [ReactiveFormsModule, BreakLinePipe],
  templateUrl: './admin-contacts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-wrap items-center gap-2'
  }
})
export class AdminContactsList {
  // Init
  protected isLoading = signal<boolean>(false);
  protected contacts = signal<ContactResponse[]>([]);
  protected selectedId = signal<string | null>(null);
  protected selectedContact = signal<ContactResponse | null>(null);

  // Injections
  private toast = inject(ToastMessage);
  private contactsApi = inject(ContactApi);
  private formBuilder = inject(FormBuilder);

  // Input signal
  public contactsInput = input.required<ContactResponse[]>();

  // View child
  private deleteModal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteContactsModal');
  private createEditModal = viewChild.required<ElementRef<HTMLDialogElement>>('createEditContactsModal');

  // Asign effect
  private initialized = false;

  private syncEffect = effect(() => {
    const incoming = this.contactsInput();

    if (!this.initialized && incoming.length > 0) {
      this.contacts.set([...incoming]);
      this.initialized = true;
    }
  });

  // Form
  protected contactForm: FormGroup = this.formBuilder.group({
    value: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    contactType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    order: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern(FormUtils.numberPattern)]],
  });

  // OnSubmit form
  protected onContactForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.createEditContactSection(this.contactForm.value, this.selectedContact()?.id);
  }

  // Create or edit contact section
  protected openCreateEditModal(contact: ContactResponse | null = null): void {
    this.selectedContact.set(contact);
    this.createEditModal().nativeElement.showModal();
  }

  protected closeCreateEditModal(): void {
    this.selectedContact.set(null);
    this.createEditModal().nativeElement.close();
  }

  // Delete contact section
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

    this.deleteContactSection(id);
    this.selectedId.set(null);
    this.selectedContact.set(null);
  }

  // API - Create or update contact
  private createEditContactSection(contactRequest: ContactRequest, id: string | undefined) {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.contactsApi.createOrEditContact(contactRequest, id)
      .subscribe({
        next: (value: ContactResponse) => {
          this.toast.success('Información de contacto agregada con éxito.');
          this.updateContactFromList(value);
          this.closeCreateEditModal();
          this.isLoading.set(false);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
          this.isLoading.set(false);
        }
      })
  }

  // API - Delete contact section
  private deleteContactSection(id: string) {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.contactsApi.deleteContact(id)
      .subscribe({
        next: () => {
          this.toast.success('Información de contacto eliminado con éxito.');
          this.removeContactFromList(id);
          this.closeDeleteModal();
          this.isLoading.set(false);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
          this.isLoading.set(false);
        }
      })
  }

  // Form patch
  private createEditPatchContent = effect(() => {
    if(this.selectedContact())
      this.contactForm.patchValue({
        order: this.selectedContact()?.order,
        value: this.selectedContact()?.value,
        contactType: this.selectedContact()?.contactType,
      });

    else
      this.contactForm.reset();
  })

  // Update contacts
  private updateContactFromList(contact: ContactResponse): void {
    this.contacts.update(values => {
      const exists = values.some(v => v.id === contact.id);

      if (exists) {
        return values.map(v =>
          v.id === contact.id ? contact : v
        );
      }

      return [...values, contact];
    });
  }

  private removeContactFromList(id: string): void {
    this.contacts.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
