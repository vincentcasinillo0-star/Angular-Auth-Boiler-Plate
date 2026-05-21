import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
let LayoutComponent = class LayoutComponent {
};
LayoutComponent = __decorate([
    Component({
        templateUrl: 'layout.component.html',
        standalone: true,
        imports: [RouterOutlet, RouterLink, RouterLinkActive]
    })
], LayoutComponent);
export { LayoutComponent };
