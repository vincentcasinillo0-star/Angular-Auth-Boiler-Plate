import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { mustMatch } from '@app/_helpers';
var TokenStatus;
(function (TokenStatus) {
    TokenStatus[TokenStatus["Validating"] = 0] = "Validating";
    TokenStatus[TokenStatus["Valid"] = 1] = "Valid";
    TokenStatus[TokenStatus["Invalid"] = 2] = "Invalid";
})(TokenStatus || (TokenStatus = {}));
let ResetPasswordComponent = class ResetPasswordComponent {
    formBuilder;
    route;
    router;
    accountService;
    alertService;
    TokenStatus = TokenStatus;
    tokenStatus = TokenStatus.Validating;
    token;
    form;
    loading = false;
    submitted = false;
    error = '';
    constructor(formBuilder, route, router, accountService, alertService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.alertService = alertService;
    }
    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'];
        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: mustMatch('password', 'confirmPassword')
        });
        this.accountService.validateResetToken(this.token)
            .pipe(first())
            .subscribe({
            next: () => {
                this.tokenStatus = TokenStatus.Valid;
            },
            error: () => {
                this.tokenStatus = TokenStatus.Invalid;
            }
        });
    }
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid)
            return;
        this.loading = true;
        this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                this.router.navigate(['/account/login']);
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
};
ResetPasswordComponent = __decorate([
    Component({
        templateUrl: 'reset-password.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink]
    })
], ResetPasswordComponent);
export { ResetPasswordComponent };
