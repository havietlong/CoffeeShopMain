import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageService } from '../../../../services/image/image.service'; // Ensure you have this service implemented
import { Account, AccountService } from '../../../../services/account/account.service';
import { Employee, EmployeeService } from '../../../../services/employee/employee.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzDatePickerModule, NzRadioModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'] // Note: styleUrls instead of styleUrl
})
export class AddEmployeeComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  image!: string;
  uploadedImage!: string;
  ImageId!: string;
  date = null;
  gender = 1;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    private imageService: ImageService, private accountService: AccountService,
    private employeeService: EmployeeService) {
    this.formGroup = this.fb.group({
      first_name: [''],
      last_name: [''],
      date: [''],
      gender: [''],
      role: [''],
      position: [''],
      phoneNumber: ['']
    });
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  deleteImage() {
    this.uploadedImage = '';
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file: File | null = fileInput.files ? fileInput.files[0] : null;
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
              // Handle upload error here
            }
          );
        }
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  

  onSubmit() {
    const formValues = this.formGroup.value;
    
    if (this.formGroup.valid) {
      const account: Account = {
        username: formValues.first_name + formValues.last_name,
        firstName: formValues.first_name,
        lastName: formValues.last_name,
        dateOfBirth: new Date(formValues.date).toISOString(),
        role: parseInt(formValues.role, 10),
        userPosition: parseInt(formValues.position, 10),
        gender: parseInt(formValues.gender, 10),
        phoneNumber: formValues.phoneNumber.toString()
      };

      console.log(account);


      this.accountService.addAccount(account).subscribe(
        response => {
          console.log('Account added successfully', response);
        },
        error => {
          console.error('Error adding employee', error);
        })





    } else {
      console.error("Forms invalid");

    }
    // Handle form submission here
  }
}
