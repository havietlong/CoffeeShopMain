import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
export const routes: Routes = [
    // {path:'', component: ProductsSectionComponent},
    {path:'', component: DashboardComponent},
    { path: 'manage', loadChildren: () => import('./pages/manage/manage.routes').then(m => m.routes) }
    
];
