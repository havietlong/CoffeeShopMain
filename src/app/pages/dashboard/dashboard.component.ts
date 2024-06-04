import { Component } from '@angular/core';
import { MiniorderComponent } from '../../components/miniorder/miniorder.component';
import { TableComponent } from '../../components/table/table.component';
import { ProductsSectionComponent } from "../../components/products-section/products-section.component";
@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [MiniorderComponent, TableComponent, ProductsSectionComponent]
})
export class DashboardComponent {

}
