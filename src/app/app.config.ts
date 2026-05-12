import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { jwtTokenInterceptor } from '@core/interceptors/jwt-token-interceptor';
import { apiGlobalErrorInterceptor } from '@core/interceptors/api-global-error-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHotToastConfig(),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiGlobalErrorInterceptor, jwtTokenInterceptor
      ])
    ),
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'dd/MM/yyyy', timezone: '-0600' }
    }
  ]
};
