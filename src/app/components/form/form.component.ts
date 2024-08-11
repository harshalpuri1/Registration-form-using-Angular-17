import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  registrationForm: FormGroup;
  submitted = false;
  isFormInvalid = false;
  submittedData: any;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      mobile_no: ['', [Validators.required, Validators.pattern(/^\+?\d{10,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      qualifications: this.fb.array([this.createQualificationGroup()]),
      address: ['', Validators.required]
    });
  }

  get qualifications(): FormArray {
    return this.registrationForm.get('qualifications') as FormArray;
  }

  createQualificationGroup(): FormGroup {
    return this.fb.group({
      qualification: ['', Validators.required],
      passout: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addQualification(): void {
    this.qualifications.push(this.createQualificationGroup());
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registrationForm.valid) {
      this.isFormInvalid = false;
      this.submittedData = this.registrationForm.value;
    } else {
      this.isFormInvalid = true;
      this.submittedData = null;
    }
  }

  printResume(): void {
    if (this.submittedData) {
      const doc = new jsPDF();
      let y = 10;

      doc.setFontSize(18);
      doc.text('Resume', 105, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      doc.text(`Full Name: ${this.submittedData.name}`, 10, y);
      y += 10;

      doc.text(`Mobile Number: ${this.submittedData.mobile_no}`, 10, y);
      y += 10;

      doc.text(`Email Address: ${this.submittedData.email}`, 10, y);
      y += 10;

      doc.text(`Address: ${this.submittedData.address}`, 10, y);
      y += 10;

      doc.text('Qualifications:', 10, y);
      y += 10;

      this.submittedData.qualifications.forEach((qualification: any, index: number) => {
        doc.text(`Qualification ${index + 1}:`, 10, y);
        y += 10;
        doc.text(`  Education Type: ${qualification.qualification}`, 10, y);
        y += 10;
        doc.text(`  Year of Passout: ${qualification.passout}`, 10, y);
        y += 10;
        doc.text(`  Percentage: ${qualification.percentage}%`, 10, y);
        y += 10;
      });

      doc.save('resume.pdf');
    }
  }
}
