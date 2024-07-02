import { Routes } from '@angular/router';
import { ManageComponent } from './manage.component';

import { CreateProductsComponent } from './create/products/create-products.component';
import { ManageProductsComponent } from './manage/products/manage-products.component';
// import { AddEmployeeComponent } from './create/accounts/add-employee.component';
import { ManageAccountsComponent } from './manage/accounts/manage-accounts.component';
import { AddEmployeeComponent } from './create/accounts/add-employee.component';
import { ManageCategoriesComponent } from './manage/manage-categories/manage-categories.component';
import { ManageReceiptsComponent } from './manage/manage-receipts/manage-receipts.component';
import { StatisticsComponent } from './manage/statistics/statistics.component';

export const routes: Routes = [
    // {path:'', component: ProductsSectionComponent},
    {
        path: '', component: ManageComponent, children: [
            { path: 'products', component: ManageProductsComponent },
            { path: 'employees', component: ManageAccountsComponent },
            { path: 'create', children: [
                { path: 'employees', component: AddEmployeeComponent },
                { path: 'products', component: CreateProductsComponent } // Assuming you might need this
            ]},
            { path: 'categories', component: ManageCategoriesComponent },
            { path: 'receipts', component: ManageReceiptsComponent },
            { path: 'statistics', component: StatisticsComponent }
        ]
    }



];
