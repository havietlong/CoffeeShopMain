import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageService } from '../../../../services/image/image.service'; // Ensure you have this service implemented
import { Account, AccountService } from '../../../../services/account/account.service';
import { Employee, EmployeeService } from '../../../../services/employee/employee.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-add-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzDatePickerModule, NzInputModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'] // Note: styleUrls instead of styleUrl
})
export class AddEmployeeEditComponent {
  @Input() employeeData!: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() updatedEmployeeEmitter = new EventEmitter<boolean>()
  image!: string;
  uploadedImage!: string;
  ImageId!: string;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
              private imageService: ImageService, private accountService: AccountService,
              private employeeService: EmployeeService) {
    this.formGroup = this.fb.group({
      first_name: [{ value: '', disabled: true }],
      last_name: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],  // Prebinding the gender field with "Nam"
      role: [''],
      position: [''],
      phoneNumber: ['']
    });
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("here");

    if (changes['employeeData'] && changes['employeeData'].currentValue) {
      this.formGroup.patchValue({
        first_name: this.employeeData.data.firstName,
        last_name: this.employeeData.data.lastName,
        date: String(this.employeeData.data.dateOfBirth),
        gender: this.employeeData.data.gender,
        role: this.employeeData.data.role,
        position: this.employeeData.data.userPosition,
        phoneNumber: this.employeeData.data.phoneNumber
      });

      console.log(this.formGroup.value);
    }
  }

  generateUuid(): string {
    return uuidv4();
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
    if (this.formGroup.valid) {
      const employee = {  
        userPosition: parseInt(this.formGroup.value.position, 10),
        role: parseInt(this.formGroup.value.role, 10),
        phoneNumber: this.formGroup.value.phoneNumber,
      };

      console.log(employee);
      

      this.employeeService.updateEmployee(this.employeeData.data.userId, employee).subscribe(
        response => {
          if (response) {
            this.updatedEmployeeEmitter.emit(true)
          }
        }
      )
    } else {
      console.log('Form is invalid');
    }
    // Handle form submission here
  }
}
