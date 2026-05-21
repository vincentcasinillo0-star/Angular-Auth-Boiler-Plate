import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { mustMatch } from '@app/_helpers';
let RegisterComponent = class RegisterComponent {
    formBuilder;
    router;
    accountService;
    alertService;
    form;
    loading = false;
    submitted = false;
    error = '';
    constructor(formBuilder, router, accountService, alertService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.accountService = accountService;
        this.alertService = alertService;
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validators: mustMatch('password', 'confirmPassword')
        });
    }
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid)
            return;
        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                this.router.navigate(['/account/login'], { relativeTo: undefined });
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
};
RegisterComponent = __decorate([
    Component({
        templateUrl: 'register.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink]
    })
], RegisterComponent);
export { RegisterComponent };
