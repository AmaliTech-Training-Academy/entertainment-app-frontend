import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CORE_PROVIDERS } from '../core/core.module';
// import { SHARED_IMPORTS } from './shared/shared.module';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ...CORE_PROVIDERS
    // ...SHARED_IMPORTS (for standalone shared imports if needed)
  ]
};
