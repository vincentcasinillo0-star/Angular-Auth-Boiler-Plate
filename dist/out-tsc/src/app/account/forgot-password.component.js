import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
let ForgotPasswordComponent = class ForgotPasswordComponent {
    formBuilder;
    accountService;
    alertService;
    form;
    loading = false;
    submitted = false;
    error = '';
    constructor(formBuilder, accountService, alertService) {
        this.formBuilder = formBuilder;
        this.accountService = accountService;
        this.alertService = alertService;
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid)
            return;
        this.loading = true;
        this.accountService.forgotPassword(this.f['email'].value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Please check your email for password reset instructions');
                this.loading = false;
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
};
ForgotPasswordComponent = __decorate([
    Component({
        templateUrl: 'forgot-password.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink]
    })
], ForgotPasswordComponent);
export { ForgotPasswordComponent };
