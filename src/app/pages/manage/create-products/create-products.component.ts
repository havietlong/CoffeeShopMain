import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-products',
  standalone: true,
  imports: [],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss'
})
export class CreateProductsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event:any) {
    const file = event.target.files[0];
    // Handle the selected file here
    console.log('Selected file:', file);
  }
}
