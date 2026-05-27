import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

export function authGuard(route: ActivatedRouteSnapshot) {
    const router = inject(Router);
    const accountService = inject(AccountService);
    const account = accountService.accountValue;

    if (account) {
        if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
            router.navigate(['/home']);
            return false;
        }
        return true;
    }

    router.navigate(['/account/login'], { queryParams: { returnUrl: router.url } });
    return false;
}