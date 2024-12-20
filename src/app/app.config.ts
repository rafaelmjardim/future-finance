import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment.development'; //Verificar se precisa remover (development)
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideIcons } from '@ng-icons/core';
import { iconsConfig } from './constants/icons.config';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import moment from "moment";
import 'moment/locale/pt-br';
moment.locale('pt-br');


registerLocaleData(ptBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideIcons(iconsConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
    provideAuth(() => getAuth()),
    provideHttpClient(withFetch()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    { provide: LOCALE_ID, useValue: 'pt' },
  ]
};
