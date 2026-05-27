import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit {
    emailVerified = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        this.accountService.verifyEmail(token)
            .subscribe({
                next: () => {
                    this.emailVerified = true;
                    this.alertService.success('Email verified successfully, you can now login', { keepAfterRouteChange: true });
                    setTimeout(() => this.router.navigate(['/account/login']), 2000);
                },
                error: err => {
                    this.alertService.error(err);
                }
            });
    }
}