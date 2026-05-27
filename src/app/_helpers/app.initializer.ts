import { AccountService } from '@app/_services';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export function appInitializer(accountService: AccountService) {
    return () => {
        const storedAccount = localStorage.getItem('account');
        if (!storedAccount) {
            return of(null);
        }
        return accountService.refreshToken().pipe(
            catchError(() => of(null))
        );
    };
}