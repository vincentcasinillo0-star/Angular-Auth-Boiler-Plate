import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';

@Component({
    standalone: false,
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    tokenValid = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        this.accountService.validateResetToken(token)
            .subscribe({
                next: () => {
                    this.tokenValid = true;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.alertService.error('Invalid or expired reset token, please go back to forgot password and try again.');
                    this.cdr.detectChanges();
                }
            });

        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
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
        const token = this.route.snapshot.queryParams['token'];
        this.accountService.resetPassword(token, this.f['password'].value, this.f['confirmPassword'].value)
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['/account/login']);
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }
}