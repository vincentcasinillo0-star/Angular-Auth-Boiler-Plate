import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
let SubnavComponent = class SubnavComponent {
};
SubnavComponent = __decorate([
    Component({
        selector: 'admin-subnav',
        templateUrl: 'subnav.component.html',
        standalone: true,
        imports: [RouterLink, RouterLinkActive]
    })
], SubnavComponent);
export { SubnavComponent };
