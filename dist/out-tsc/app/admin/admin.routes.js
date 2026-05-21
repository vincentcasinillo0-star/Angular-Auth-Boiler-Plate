import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
export const ADMIN_ROUTES = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverviewComponent },
            {
                path: 'accounts',
                loadChildren: () => import('./accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES)
            }
        ]
    }
];
