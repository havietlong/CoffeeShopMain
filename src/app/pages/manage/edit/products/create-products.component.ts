import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService, Category } from '../../../../services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../../services/image/image.service';
import { Product, ProductsService } from '../../../../services/products/products.service';
import { Router } from '@angular/router';
import { ProductImage, ProductImageService } from '../../../../services/productimages/productimages.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
@Component({
  selector: 'app-create-products-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzDropDownModule, NzButtonModule, NzIconModule, NzModalModule, FormsModule, NzInputModule],
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss']
})
export class CreateProductsEditComponent {
  @Input() productData!:Product;
  @ViewChild('fileInput') fileInput!: ElementRef;
  formGroup: FormGroup;
  categories!: any[];
  image!: string;
  uploadedImage!: string;
  categoryDisplay = '...';
  isVisibleMiddle = false;
  value?: string;

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private imageService: ImageService,
    private productImageService: ProductImageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      // image: ['']
    });

    this.fetchCategories();
    this.fetchProductsData();
  }
  
  fetchProductsData(){
    this.productService.getProducts()
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe(
      (response: any) => { // Adjust 'any' to the correct interface/type if available
        console.log(response.data);
        this.categories = response.data; // Assign the array of categories to 'this.categories'
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }


  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    // console.log(this.value);
    this.isVisibleMiddle = false;
    const data:Partial<Category>={
      CategoryName:this.value
    }
    if (this.value) {
      this.categoriesService.addCategory(data).subscribe(
        res => {
          if(res){
            this.fetchCategories();
          }
        }
      )      
    }
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  selectCategory(category: any): void {
    console.log(category);
    this.categoryDisplay = category.categoryName;
    this.formGroup.get('category')?.setValue(category.categoryId);
    this.log();
  }

  log(): void {
    console.log(this.formGroup.get('category')?.value);
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageService.convertToBase64(file).then(base64Image => {
        this.image = base64Image;
        this.formGroup.patchValue({ image: base64Image });
        if (base64Image) {
          this.imageService.uploadImage(base64Image).subscribe(
            response => {
              console.log('Upload successful', response);
              this.formGroup.patchValue({ image: response.data.display_url });
              this.uploadedImage = response.data.display_url;
            },
            error => {
              console.error('Upload failed', error);
            }
          );
        }
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const product: Product = {
        ProductName: this.formGroup.value.name,
        ProductPrice: this.formGroup.value.price,
        ProductDescription: this.formGroup.value.description,
        CategoryId: this.formGroup.value.category,
        ImageUrl: this.formGroup.value.image,        
      };

      this.productService.addProduct(product).subscribe(
        response => {
          if (response) {
            this.router.navigate(['/manage/products']);
          }
        },        
        error => {
  console.error('Error adding employee', error);
})





    } else {
  console.log('Form is invalid');
}
    // Handle form submission here
  }
}
