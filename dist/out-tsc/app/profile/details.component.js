import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '@app/_services';
let DetailsComponent = class DetailsComponent {
    accountService = inject(AccountService);
    account$ = this.accountService.account;
};
DetailsComponent = __decorate([
    Component({
        templateUrl: 'details.component.html',
        standalone: true,
        imports: [CommonModule, RouterLink]
    })
], DetailsComponent);
export { DetailsComponent };
