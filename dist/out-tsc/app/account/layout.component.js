import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
let LayoutComponent = class LayoutComponent {
    router;
    accountService;
    constructor(router, accountService) {
        this.router = router;
        this.accountService = accountService;
    }
    ngOnInit() {
        // redirect to home if already logged in
        if (this.accountService.accountValue) {
            this.router.navigate(['/']);
        }
    }
};
LayoutComponent = __decorate([
    Component({
        templateUrl: 'layout.component.html',
        standalone: true,
        imports: [RouterOutlet]
    })
], LayoutComponent);
export { LayoutComponent };
