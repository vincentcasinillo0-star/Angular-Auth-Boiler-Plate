import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';
export const PROFILE_ROUTES = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'details', pathMatch: 'full' },
            { path: 'details', component: DetailsComponent },
            { path: 'update', component: UpdateComponent }
        ]
    }
];
