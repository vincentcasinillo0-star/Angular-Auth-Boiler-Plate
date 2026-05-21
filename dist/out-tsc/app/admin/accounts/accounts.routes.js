import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
export const ACCOUNTS_ROUTES = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent }
];
