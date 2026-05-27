import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { ReceiptsApi } from '@core/services/receipts-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { ReceiptResponse } from '@public/interfaces/receipt-respose.interface';
import { ReceiptDetailsResponse } from '@public/interfaces/receipt-details-response.interface';
import { ReCaptchaValidator } from "@shared/components/re-captcha-validator/re-captcha-validator";

@Component({
  selector: 'receipts-form',
  imports: [ReactiveFormsModule, ReCaptchaValidator, TitleCasePipe, DecimalPipe],
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

  protected keys = signal<string[]>([]);
  protected values = signal<string[]>([]);

  protected receiptNumber = signal<number>(0);
  protected receiptData = signal<ReceiptResponse | undefined>(undefined);
  protected receiptDetailsData = signal<ReceiptDetailsResponse | undefined>(undefined);

  // Injects
  private toast = inject(ToastMessage);
  private formBuilder = inject(FormBuilder);
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

    if (!this.captchaToken) {
      this.toast.error('ReCAPTCHA obligatorio.');
      return;
    }

    this.contactService.recaptchaValidation(this.captchaToken)
      .subscribe({
        next: (isValid: boolean) => {
          if(!isValid)
            this.toast.error('ReCAPTCHA fallido.');

          this.receiptNumber.set(this.receiptsForm.value['receiptNumber']);
          this.receiptApiService(this.receiptNumber());
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
        }
      });
  }

  protected onReceiptDetails(index: number) {
    this.receiptDetailsApiService(this.receiptNumber(), index);
  }

  // Captcha resolve
  protected onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling receipts API
  protected receiptApiService(receiptNumber: number): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.receiptsService.getReceipt(receiptNumber)
      .subscribe({
        next: (value: ReceiptResponse) => {
          this.isLoading.set(false);
          this.receiptData.set(value);

          if(value.table) {
            for(let record of value.table) {
              this.keys.set(Object.keys(record))
              this.values.set(Object.values(record))
            }
          }

          this.receiptsForm.reset();
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }

  protected receiptDetailsApiService(receiptNumber: number, index: number): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.receiptsService.getReceiptDetails({ receiptNumber, index })
      .subscribe({
        next: (value: ReceiptDetailsResponse) => {
          this.isLoading.set(false);
          this.receiptDetailsData.set(value);

          this.receiptsForm.reset();
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }
}
