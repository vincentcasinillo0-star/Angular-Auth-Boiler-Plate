import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AlertComponent } from './_components';
import { Role } from './_models';
let AppComponent = class AppComponent {
    router;
    accountService;
    Role = Role;
    account = null;
    constructor(router, accountService) {
        this.router = router;
        this.accountService = accountService;
        this.accountService.account.subscribe(x => this.account = x);
    }
    logout() {
        this.accountService.logout();
        this.router.navigate(['/account/login']);
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.html',
        standalone: true,
        imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent]
    })
], AppComponent);
export { AppComponent };
