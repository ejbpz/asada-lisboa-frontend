import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReceiptsForm } from './receipts-form';
import { ContactApi } from '@core/services/contact-api';
import { ReceiptsApi } from '@core/services/receipts-api';
import { ToastMessage } from '@shared/services/toast-message';

describe('ReceiptsForm', () => {
  let component: ReceiptsForm;
  let fixture: ComponentFixture<ReceiptsForm>;

  let contactApi: jasmine.SpyObj<ContactApi>;
  let receiptsApi: jasmine.SpyObj<ReceiptsApi>;
  let toast: jasmine.SpyObj<ToastMessage>;

  beforeEach(async () => {
    contactApi = jasmine.createSpyObj('ContactApi', [
      'recaptchaValidation',
      'contactEmail'
    ]);

    receiptsApi = jasmine.createSpyObj('ReceiptsApi', [
      'getReceipt',
      'getReceiptDetails'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', [
      'error',
      'success'
    ]);

    await TestBed.configureTestingModule({
      imports: [ReceiptsForm, ReactiveFormsModule],
      providers: [
        { provide: ContactApi, useValue: contactApi },
        { provide: ReceiptsApi, useValue: receiptsApi },
        { provide: ToastMessage, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched when invalid submit', () => {
    const spy = spyOn(component['receiptsForm'], 'markAllAsTouched');

    component['onReceiptsForm']();

    expect(spy).toHaveBeenCalled();
  });

  it('should show error when captcha is missing', () => {
    component['receiptsForm'].setValue({ receiptNumber: 10 });

    component['onReceiptsForm']();

    expect(toast.error).toHaveBeenCalledWith('ReCAPTCHA obligatorio.');
  });

  it('should call receipt API after captcha validation success', fakeAsync(() => {
    component['receiptsForm'].setValue({ receiptNumber: 123 });
    component['onCaptchaResolved']('token');

    contactApi.recaptchaValidation.and.returnValue(of(true));

    receiptsApi.getReceipt.and.returnValue(of({
      receiptType: 1,
      table: []
    } as any));

    component['onReceiptsForm']();

    tick();

    expect(contactApi.recaptchaValidation).toHaveBeenCalled();
    expect(receiptsApi.getReceipt).toHaveBeenCalledWith(123);
  }));

  it('should show error when captcha validation fails', fakeAsync(() => {
    component['receiptsForm'].setValue({ receiptNumber: 123 });
    component['onCaptchaResolved']('token');

    contactApi.recaptchaValidation.and.returnValue(of(false));

    receiptsApi.getReceipt.and.returnValue(of({} as any));

    component['onReceiptsForm']();

    tick();

    expect(toast.error).toHaveBeenCalledWith('ReCAPTCHA fallido.');
  }));

  it('should not call API when already loading', () => {
    component['isLoading'].set(true);

    component['receiptApiService'](123);

    expect(receiptsApi.getReceipt).not.toHaveBeenCalled();
  });

  it('should set receipt data and keys/values', fakeAsync(() => {
    receiptsApi.getReceipt.and.returnValue(of({
      table: [{ a: 1, b: 2 }]
    } as any));

    component['receiptApiService'](1);

    tick();

    expect(component['receiptData']()).toBeTruthy();
    expect(component['keys']().length).toBeGreaterThan(0);
    expect(component['values']().length).toBeGreaterThan(0);
  }));

  it('should call receipt details API', fakeAsync(() => {
    receiptsApi.getReceiptDetails.and.returnValue(of({} as any));

    component['receiptDetailsApiService'](10, 2);

    tick();

    expect(receiptsApi.getReceiptDetails).toHaveBeenCalledWith({
      receiptNumber: 10,
      index: 2
    });
  }));

  it('should trigger receipt details from row click', () => {
    const spy = spyOn<any>(component, 'receiptDetailsApiService');

    component['receiptNumber'].set(99);

    component['onReceiptDetails'](3);

    expect(spy).toHaveBeenCalledWith(99, 3);
  });
});
