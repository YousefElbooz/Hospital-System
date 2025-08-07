import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patients.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-patients',
  templateUrl: './admin-patients.component.html',
  styleUrls: ['./admin-patients.component.css'],
  imports:[FormsModule]
})
export class AdminPatientsComponent implements OnInit {
  patients: any[] = [];

  name = '';
  email = '';
  phone = '';
  gender = '';
  image = '';
  password: string = '';

  editingPatient: any = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res) => {
        console.log('API response:', res);
        this.patients = Array.isArray(res.patients) ? res.patients : [];
      },
      error: (err) => console.error('Error loading patients', err)
    });
  }

  submitPatient(): void {
  const patient: any = {
    name: this.name,
    email: this.email,
    phone: this.phone,
    gender: this.gender,
    image: this.image || 'https://via.placeholder.com/150'
  };

  // ✅ Only include password on creation
  if (!this.editingPatient && this.password) {
    patient.password = this.password;
  }

  if (this.editingPatient && this.editingPatient._id) {
    this.patientService.updatePatient(this.editingPatient._id, patient).subscribe(() => {
      this.resetForm();
      this.loadPatients();
    });
  } else {
    this.patientService.createPatient(patient).subscribe(() => {
      this.resetForm();
      this.loadPatients();
    });
  }
}


  editPatient(patient: any): void {
    this.name = patient.name;
    this.email = patient.email;
    this.phone = patient.phone;
    this.gender = patient.gender;
    this.image = patient.image;
    this.editingPatient = patient;
  }

  deletePatient(id: string): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe(() => this.loadPatients());
    }
  }

 resetForm(): void {
  this.name = '';
  this.email = '';
  this.phone = '';
  this.gender = '';
  this.image = '';
  this.password = '';        // ✅ Add this line
  this.editingPatient = null;
}

  trackById(index: number, patient: any): string {
    return patient._id;
  }
}
