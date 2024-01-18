import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {
  LocalStorageSsrHackService,
  LocalStorageService,
} from './shared/services/local-storage.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: LocalStorageService,
      useClass: LocalStorageSsrHackService,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
