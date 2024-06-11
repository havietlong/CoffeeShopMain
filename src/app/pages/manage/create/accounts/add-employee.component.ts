import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageService } from '../../../../services/image/image.service'; // Ensure you have this service implemented
import { Account, AccountService } from '../../../../services/account/account.service';
import { Employee, EmployeeService } from '../../../../services/employee/employee.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'] // Note: styleUrls instead of styleUrl
})
export class AddEmployeeComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;  
  image!:string;
  uploadedImage!: string;
  ImageId!: string;
  
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private router:Router,
    private imageService: ImageService, private accountService:AccountService, 
    private employeeService:EmployeeService) {
    this.formGroup = this.fb.group({
      name: [''],
      role: [''],
      shift: [''],
      // image: ['']
    });
  }

  generateUuid(): string {   
    return uuidv4();
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  deleteImage(){
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
    if (this.formGroup.valid) {
      const account: Account = {
        AccountId: this.generateUuid(),
        AccountUsername: this.formGroup.value.name,
        AccountPassword: 'Abc@12345',
        RoleId:2 
      };

      this.accountService.addAccount(account).subscribe(
        response => {
          console.log('Account added successfully', response);
          const employee: Employee = {
            EmployeeId: this.generateUuid(),
            EmployeeName: this.formGroup.value.name,
            EmployeePosition: this.formGroup.value.role,
            EmployeeWorkingHour:this.formGroup.value.shift,
            AccountId: response.AccountId,
          };

          this.employeeService.addEmployee(employee).subscribe(
            response => {
              if(response){
                this.router.navigate(["manage/employees"]);
              }
            }
          )
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
