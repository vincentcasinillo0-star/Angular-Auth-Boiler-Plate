import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    standalone: false,
    templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
    accounts: Account[] = [];

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.getAll()
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount(id: string) {
        const account = this.accounts.find(x => x.id === id);
        this.accountService.delete(id)
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id);
            });
    }
}