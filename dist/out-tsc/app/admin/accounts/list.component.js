import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
let ListComponent = class ListComponent {
    accountService;
    accounts;
    constructor(accountService) {
        this.accountService = accountService;
    }
    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }
    deleteAccount(account) {
        account.isDeleting = true;
        this.accountService.delete(account.id)
            .pipe(first())
            .subscribe(() => {
            this.accounts = this.accounts.filter(x => x.id !== account.id);
        });
    }
};
ListComponent = __decorate([
    Component({
        templateUrl: 'list.component.html',
        standalone: true,
        imports: [CommonModule, RouterLink]
    })
], ListComponent);
export { ListComponent };
