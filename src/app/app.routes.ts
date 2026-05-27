import { Routes } from '@angular/router';
import { authGuard } from '@app/_helpers';
import { Role } from '@app/_models';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(x => x.HomeModule),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
        canActivate: [authGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule),
        canActivate: [authGuard]
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(x => x.AccountModule)
    },
    { path: '**', redirectTo: 'home' }
];