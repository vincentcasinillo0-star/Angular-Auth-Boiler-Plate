import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
let LoginComponent = class LoginComponent {
    formBuilder;
    route;
    router;
    accountService;
    alertService;
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
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        // stop here if form is invalid
        if (this.form.invalid)
            return;
        this.error = '';
        this.loading = true;
        this.accountService.login(this.f['email'].value, this.f['password'].value)
            .pipe(first())
            .subscribe({
            next: () => {
                // get return url from query parameters or default to home page
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
};
LoginComponent = __decorate([
    Component({
        templateUrl: 'login.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink]
    })
], LoginComponent);
export { LoginComponent };
