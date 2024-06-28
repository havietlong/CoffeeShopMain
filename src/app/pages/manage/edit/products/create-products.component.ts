import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService, Category } from '../../../../services/categories/categories.service';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../../services/image/image.service';
import { Product, ProductsService } from '../../../../services/products/products.service';
import { Router } from '@angular/router';
import { ProductImage, ProductImageService } from '../../../../services/productimages/productimages.service';

@Component({
  selector: 'app-create-products-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss']
})
export class CreateProductsEditComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  formGroup: FormGroup;
  categories!: Category[];
  image!: string;
  uploadedImage!: string;

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
      image: ['']
    });

    this.categoriesService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
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
        CategoryId: this.formGroup.value.category
      };

      this.productService.addProduct(product).subscribe(
        response => {
          if (response) {
            const productImage: ProductImage = {
              ProductId: response.ProductId,
              ProductImagePath: this.uploadedImage,
              ProductImageDescription: response.ProductName
            };
            this.productImageService.addProductImage(productImage).subscribe(
              response => {
                if (response) {
                  this.router.navigate(['/manage/products']);
                }

              },
              error => {
                console.error('Error adding product image', error);
              });

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
