import { Component, OnInit } from '@angular/core';
import { DoctorService, Doctor } from '../doctors.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,NgClass,NgIf]
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  searchTerm = '';
  selectedSpecialization = 'All';
  specializations: string[] = [];
  userRole: string | null = null;

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.filterDoctors())
     const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userRole = user.role;
    }
  
    this.doctorService.getAllDoctors().subscribe({
      next: (res) => {
        this.doctors = res;
        this.extractSpecializations();
        this.filterDoctors();
      },
      error: (err) => console.error('Error loading doctors:', err)
    });
  }

  extractSpecializations() {
    const specs = this.doctors.map(d => d.specialization);
    this.specializations = ['All', ...new Set(specs)];
  }

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpecialization =
        this.selectedSpecialization === 'All' ||
        doc.specialization === this.selectedSpecialization;
        

      return matchesSearch && matchesSpecialization;
    });
  }


  bookAppointment(doctorId: string) {
    this.router.navigate(['/doctors', doctorId]);
  }
}
