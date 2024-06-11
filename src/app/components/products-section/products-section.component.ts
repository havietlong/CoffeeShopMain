import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../services/products/products.service';
import { Category } from '../../services/categories/categories.service';
import { ProductImage } from '../../services/productimages/productimages.service';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.scss'
})
export class ProductsSectionComponent {
@Input() images!:ProductImage[];
@Input() products!:Product[];
@Input() categories!:Category[];

}
