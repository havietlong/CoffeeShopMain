import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { TableComponent } from './pages/customer/table/table.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
export const routes: Routes = [
    // {path:'', component: ProductsSectionComponent},
    {path:'', component: LoginComponent},
    {path:'dashboard', component: DashboardComponent},
    {path: 'manage', loadChildren: () => import('./pages/manage/manage.routes').then(m => m.routes) },
    {path: 'table/:id', component: TableComponent},
    {path: 'not-found', component: NotFoundComponent},
];
