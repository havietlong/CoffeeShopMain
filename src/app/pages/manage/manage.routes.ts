import { Routes } from '@angular/router';
import { ManageComponent } from './manage.component';

import { CreateProductsComponent } from './create-products/create-products.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';

export const routes: Routes = [
    // {path:'', component: ProductsSectionComponent},
    {
        path: '', component: ManageComponent, children: [
            { path: 'products', component: ManageProductsComponent },
            { path: 'create/products', component: CreateProductsComponent}
        ]
    }



];
