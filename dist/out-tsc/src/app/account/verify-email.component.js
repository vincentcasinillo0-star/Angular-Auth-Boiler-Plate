import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
let VerifyEmailComponent = class VerifyEmailComponent {
    route;
    router;
    accountService;
    alertService;
    verifying = true;
    error = '';
    constructor(route, router, accountService, alertService) {
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.alertService = alertService;
    }
    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                this.router.navigate(['/account/login']);
            },
            error: err => {
                this.error = err;
                this.verifying = false;
            }
        });
    }
};
VerifyEmailComponent = __decorate([
    Component({
        templateUrl: 'verify-email.component.html',
        standalone: true,
        imports: [CommonModule, RouterLink]
    })
], VerifyEmailComponent);
export { VerifyEmailComponent };
