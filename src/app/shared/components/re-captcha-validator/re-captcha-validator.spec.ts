import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReCaptchaValidator } from './re-captcha-validator';
import { ToastMessage } from '@shared/services/toast-message';
import { ReCaptchaLoader } from '@core/services/re-captcha-loader';

describe('ReCaptchaValidator', () => {
  let component: ReCaptchaValidator;
  let fixture: ComponentFixture<ReCaptchaValidator>;

  const toastMock = {
    error: jasmine.createSpy('error')
  };

  const loaderMock = {
    load: jasmine.createSpy('load').and.returnValue(Promise.resolve())
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReCaptchaValidator],
      providers: [
        { provide: ToastMessage, useValue: toastMock },
        { provide: ReCaptchaLoader, useValue: loaderMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReCaptchaValidator);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    (window as any).grecaptcha = undefined;
    jasmine.getEnv().allowRespy(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loader on browser platform', async () => {
    (window as any).grecaptcha = {
      ready: jasmine.createSpy('ready'),
      render: jasmine.createSpy('render')
    };

    await component.ngAfterViewInit();

    expect(loaderMock.load).toHaveBeenCalled();
  });

  it('should show error when grecaptcha is undefined', async () => {
    (window as any).grecaptcha = undefined;

    await component.ngAfterViewInit();

    expect(toastMock.error).toHaveBeenCalledWith('grecaptcha no está disponible');
  });

  it('should emit token on callback', async () => {
    let callbackFn: any;

    (window as any).grecaptcha = {
      ready: (fn: any) => fn(),
      render: (_el: any, config: any) => {
        callbackFn = config.callback;
        return 1;
      }
    };

    const emitSpy = spyOn(component.resolved, 'emit');

    await component.ngAfterViewInit();

    callbackFn('token123');

    expect(emitSpy).toHaveBeenCalledWith('token123');
  });

  it('should emit empty string on expired callback', async () => {
    let expiredFn: any;

    (window as any).grecaptcha = {
      ready: (fn: any) => fn(),
      render: (_el: any, config: any) => {
        expiredFn = config['expired-callback'];
        return 1;
      }
    };

    const emitSpy = spyOn(component.resolved, 'emit');

    await component.ngAfterViewInit();

    expiredFn();

    expect(emitSpy).toHaveBeenCalledWith('');
  });

  it('should reset widget when widgetId exists', () => {
    (window as any).grecaptcha = {
      reset: jasmine.createSpy('reset')
    };

    (component as any).widgetId = 123;

    component.reset();

    expect((window as any).grecaptcha.reset).toHaveBeenCalledWith(123);
  });

  it('should not reset if grecaptcha is undefined', () => {
    (window as any).grecaptcha = undefined;

    (component as any).widgetId = 123;

    expect(() => component.reset()).not.toThrow();
  });
});
