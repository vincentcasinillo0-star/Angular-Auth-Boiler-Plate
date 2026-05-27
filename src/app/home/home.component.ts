import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    standalone: false,
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    account!: Account;

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.account.subscribe(x => this.account = x!);
    }
}