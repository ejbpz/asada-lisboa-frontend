import { TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { ReceiptsApi } from '@core/services/receipts-api';
import { ToastMessage } from '@shared/services/toast-message';
import { ReceiptResponse } from '@public/interfaces/receipt-respose.interface';
import { ReCaptchaValidator } from "@shared/components/re-captcha-validator/re-captcha-validator";

@Component({
  selector: 'receipts-form',
  imports: [ReactiveFormsModule, ReCaptchaValidator, TitleCasePipe],
  templateUrl: './receipts-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col justify-center items-center'
  }
})
export class ReceiptsForm {
    // Init
    private captchaToken: string | null = null;
  protected isLoading = signal<boolean>(false);
  protected isError = signal<string | null>(null);

  protected keys = signal<string[]>([]);
  protected values = signal<string[]>([]);

  protected receiptData = signal<ReceiptResponse | undefined>(undefined);

  // Injects
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);
  private receiptsService = inject(ReceiptsApi);
    protected contactService = inject(ContactApi);

  // Form
  protected receiptsForm: FormGroup = this.formBuilder.group({
    receiptNumber: ['', [Validators.required, Validators.min(0), Validators.pattern(FormUtils.numberPattern)]]
  });

  // OnSubmit form
  protected onReceiptsForm() {
    if (this.receiptsForm.invalid) {
      this.receiptsForm.markAllAsTouched();
      return;
    }

    // if (!this.captchaToken) {
    //   this.isError.set('ReCAPTCHA obligatorio.');
    //   return;
    // }
          this.receiptApiService(this.receiptsForm.value['receiptNumber']);

    // this.contactService.recaptchaValidation(this.captchaToken)
    //   .subscribe({
    //     next: (isValid: boolean) => {
    //       if(!isValid)
    //         this.isError.set('ReCAPTCHA fallido.');

    //       this.receiptApiService(this.receiptsForm.value['receiptNumber']);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.isError.set(error.message);
    //     }
    //   });
  }

  // Captcha resolve
  protected onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling login API
  protected receiptApiService(receiptNumber: number): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.receiptsService.getReceipt(receiptNumber)
      .subscribe({
        next: (value: ReceiptResponse) => {
          this.isLoading.set(false);
          this.receiptData.set(value);

          if(value.table) {
            for(let a of value.table) {
              this.keys.set(Object.keys(a))
              this.values.set(Object.values(a))
            }
          }

          this.receiptsForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      });
  }

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(this.isError(), '❌');

    this.isError.set(null);
  });
}
