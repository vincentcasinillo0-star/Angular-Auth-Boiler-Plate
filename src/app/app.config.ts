import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { appInitializer } from '@app/_helpers';
import { jwtInterceptor, errorInterceptor } from '@app/_helpers';
import { AccountService } from '@app/_services';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            deps: [AccountService],
            multi: true
        }
    ]
};