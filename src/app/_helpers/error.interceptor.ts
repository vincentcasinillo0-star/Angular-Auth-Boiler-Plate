import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AccountService } from '@app/_services';

export function errorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
    const accountService = inject(AccountService);

    return next(request).pipe(catchError(err => {
        if ([401, 403].includes(err.status) && accountService.accountValue) {
            accountService.logout();
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
    }));
}