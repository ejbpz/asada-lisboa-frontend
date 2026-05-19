import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';
import { AuthApi } from '@core/services/auth-api';
import { ToastMessage } from '@shared/services/toast-message';
import { SeoRouteListener } from '@core/services/seo-route-listener';

describe('App', () => {
  let authApiSpy: jasmine.SpyObj<AuthApi>;
  let toastSpy: jasmine.SpyObj<ToastMessage>;
  let seoRouteListenerSpy: jasmine.SpyObj<SeoRouteListener>;

  beforeEach(async () => {
    toastSpy = jasmine.createSpyObj('ToastMessage', [ 'error' ]);
    authApiSpy = jasmine.createSpyObj('AuthApi', [ 'sessionExpired' ]);
    seoRouteListenerSpy = jasmine.createSpyObj('SeoRouteListener', ['init']);

    authApiSpy.sessionExpired.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: SeoRouteListener,
          useValue: seoRouteListenerSpy
        },

        {
          provide: AuthApi,
          useValue: authApiSpy
        },

        {
          provide: ToastMessage,
          useValue: toastSpy
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize seo route listener', () => {
    TestBed.createComponent(App);
    expect(seoRouteListenerSpy.init).toHaveBeenCalled();
  });

  it('should show toast when session expired', () => {
    authApiSpy.sessionExpired.and.returnValue(true);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(toastSpy.error).toHaveBeenCalledWith('Tu sesión expiró. Inicia sesión nuevamente en otra pestaña.');
  });

  it('should not show toast when session is valid', () => {
    authApiSpy.sessionExpired.and.returnValue(false);
    TestBed.createComponent(App);

    expect(toastSpy.error).not.toHaveBeenCalled();
  });
});
