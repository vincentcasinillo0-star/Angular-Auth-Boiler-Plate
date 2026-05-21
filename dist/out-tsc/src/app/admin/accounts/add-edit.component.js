import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { mustMatch } from '@app/_helpers';
let AddEditComponent = class AddEditComponent {
    formBuilder;
    route;
    router;
    accountService;
    alertService;
    form;
    id;
    isAddMode;
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
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', passwordValidators],
            confirmPassword: ['']
        }, {
            validators: mustMatch('password', 'confirmPassword')
        });
        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(account => this.form.patchValue(account));
        }
    }
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid)
            return;
        this.loading = true;
        if (this.isAddMode) {
            this.createAccount();
        }
        else {
            this.updateAccount();
        }
    }
    createAccount() {
        this.accountService.create(this.form.value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
                this.router.navigate(['/admin/accounts']);
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
    updateAccount() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                this.router.navigate(['/admin/accounts']);
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
};
AddEditComponent = __decorate([
    Component({
        templateUrl: 'add-edit.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink]
    })
], AddEditComponent);
export { AddEditComponent };
