import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule,RouterModule,RouterOutlet,NzIconModule],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss'
})
export class SiderComponent {
  @Input() isExpanded = false;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
}
