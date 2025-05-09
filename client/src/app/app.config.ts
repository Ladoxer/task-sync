import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tasksReducer } from './features/tasks/store/tasks.reducer';
import { TasksEffects } from './features/tasks/store/tasks.effects';
import { teamsReducer } from './features/teams/store/teams.reducer';
import { TeamsEffects } from './features/teams/store/teams.effects';

const socketConfig: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ['websocket'],
    autoConnect: true
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    provideStore({
      tasks: tasksReducer,
      teams: teamsReducer
    }),
    provideEffects([TasksEffects, TeamsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    }),
    importProvidersFrom(
      SocketIoModule.forRoot(socketConfig)
    )
  ]
};
