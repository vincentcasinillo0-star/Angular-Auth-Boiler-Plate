import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
let HomeComponent = class HomeComponent {
    accountService = inject(AccountService);
    account$ = this.accountService.account;
};
HomeComponent = __decorate([
    Component({
        templateUrl: 'home.component.html',
        standalone: true,
        imports: [CommonModule]
    })
], HomeComponent);
export { HomeComponent };
