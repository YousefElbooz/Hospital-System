import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patients.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  image: string;
  age: number;
  bloodType?: string;
  medicalHistory?: string[];
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm = '';
  userRole: string | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {
    // Get user role from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userRole = user.role;
    }
  }

  ngOnInit() {
    // Only fetch patients if user is doctor or admin
    if (this.userRole === 'doctor' || this.userRole === 'admin') {
      this.loadPatients();
    } else {
      this.router.navigate(['/']); // Redirect to home if not authorized
    }
  }

  loadPatients() {
    this.isLoading = true;
    this.error = null;
    
    this.patientService.getAllPatients().subscribe({
      next: (res: any) => {
        this.patients = res.filter((patient: any) => patient.role === 'patient');
        this.filteredPatients = [...this.patients];
        this.isLoading = false;
      },
      error: (err:any) => {
        console.error('Error loading patients:', err);
        this.error = 'Failed to load patients. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterPatients() {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = [...this.patients];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredPatients = this.patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      (patient.phone && patient.phone.includes(searchTerm))
    );
  }

  viewPatientDetails(patientId: string) {
    this.router.navigate(['/patients', patientId]);
  }

  createMedicalReport(patientId: string) {
    this.router.navigate(['/create-report', patientId]);
  }

  createMedicalTest(patientId: string) {
    this.router.navigate(['/create-test', patientId]);
  }
}
