import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    standalone: false,
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    account!: Account;
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.accountService.account.subscribe(x => this.account = x!);
        this.form = this.formBuilder.group({
            title: [this.account.title, Validators.required],
            firstName: [this.account.firstName, Validators.required],
            lastName: [this.account.lastName, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', Validators.minLength(6)],
            confirmPassword: ['']
        }, {
            validators: this.mustMatch('password', 'confirmPassword')
        });
    }

    get f() { return this.form.controls; }

    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['mustMatch']) return;
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) return;

        this.loading = true;
        this.accountService.update(this.account.id!, this.form.value)
            .subscribe({
                next: () => {
                    this.alertService.success('Profile updated successfully', { keepAfterRouteChange: true });
                    this.loading = false;
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }
}