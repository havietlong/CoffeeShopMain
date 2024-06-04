import { Component } from '@angular/core';
import { SiderComponent } from "../../components/sider/sider.component";
import { RouterOutlet } from '@angular/router';



@Component({
    selector: 'app-manage',
    standalone: true,
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.scss',
    imports: [SiderComponent, RouterOutlet]
})
export class ManageComponent {
  sidebarExpanded = true;
}
