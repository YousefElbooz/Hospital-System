import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctors.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './admin-doctors.component.html',
  styleUrls: ['./admin-doctors.component.css'],
  imports:[FormsModule]
})
export class AdminDoctorsComponent implements OnInit {
  doctors: any[] = [];
  name = '';
  email = '';
  phone = '';
  specialization = '';
  password: string = '';
  gender = '';
  image = '';
  editingDoctor: any = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(res => this.doctors = res);
  }

  submitDoctor() {
  const doctorData: any = {
    name: this.name,
    email: this.email,
    phone: this.phone,
    specialization: this.specialization,
    gender: this.gender,
    image: this.image,
  };

  // Only include password on creation
  if (!this.editingDoctor && this.password) {
    doctorData.password = this.password;
  }

  if (this.editingDoctor) {
    // Update
    this.doctorService.updateDoctor(this.editingDoctor, doctorData).subscribe(() => {
      this.loadDoctors();
      this.resetForm();
    });
  } else {
    // Create
    this.doctorService.createDoctor(doctorData).subscribe(() => {
      this.loadDoctors();
      this.resetForm();
    });
  }
}


  editDoctor(doctor: any): void {
    this.name = doctor.name;
    this.email = doctor.email;
    this.phone = doctor.phone;
    this.specialization = doctor.specialization;
    this.gender = doctor.gender;
    this.image = doctor.image;
    this.editingDoctor = doctor;
  }

  deleteDoctor(id: string): void {
    this.doctorService.deleteDoctor(id).subscribe(() => this.loadDoctors());
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.specialization = '';
    this.gender = '';
    this.image = '';
    this.editingDoctor = null;
  }
}