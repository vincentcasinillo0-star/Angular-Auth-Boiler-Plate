import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { mustMatch } from '@app/_helpers';
let UpdateComponent = class UpdateComponent {
    formBuilder;
    router;
    accountService;
    alertService;
    account;
    form;
    loading = false;
    submitted = false;
    deleting = false;
    error = '';
    constructor(formBuilder, router, accountService, alertService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.accountService = accountService;
        this.alertService = alertService;
    }
    ngOnInit() {
        this.account = this.accountService.accountValue;
        this.form = this.formBuilder.group({
            title: [this.account?.title, Validators.required],
            firstName: [this.account?.firstName, Validators.required],
            lastName: [this.account?.lastName, Validators.required],
            email: [this.account?.email, [Validators.required, Validators.email]],
            password: ['', Validators.minLength(6)],
            confirmPassword: ['']
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
        this.accountService.update(this.account.id, this.form.value)
            .pipe(first())
            .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                this.router.navigate(['/profile/details']);
            },
            error: err => {
                this.error = err;
                this.loading = false;
            }
        });
    }
    onDelete() {
        if (confirm('Are you sure you want to delete your account?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe({
                next: () => {
                    this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                },
                error: err => {
                    this.error = err;
                    this.deleting = false;
                }
            });
        }
    }
};
UpdateComponent = __decorate([
    Component({
        templateUrl: 'update.component.html',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule]
    })
], UpdateComponent);
export { UpdateComponent };
