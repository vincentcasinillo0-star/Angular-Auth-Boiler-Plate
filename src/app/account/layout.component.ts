import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from '@app/_services';
import { AlertComponent } from '@app/_components';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    templateUrl: './layout.component.html'
})
export class LayoutComponent {
    constructor(private accountService: AccountService, private router: Router) {
        if (this.accountService.accountValue) {
            this.router.navigate(['/home']);
        }
    }
}