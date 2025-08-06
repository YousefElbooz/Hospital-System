import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService, Doctor } from '../doctors.service';
import { AppointmentService, Appointment } from '../appointment.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class DoctorDetailsComponent implements OnInit {
  doctorId: string = '';
  doctor!: Doctor;
  appointmentForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loggedInPatientId = ''; // will be dynamically loaded

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDoctorDetails();
    this.loadLoggedInUserId(); // NEW: extract user ID from localStorage
    this.initializeForm();
  }

  loadLoggedInUserId(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.loggedInPatientId = user?._id || '';
    } else {
      console.warn('No user data found in localStorage.');
    }
  }

  loadDoctorDetails(): void {
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (res) => (this.doctor = res),
      error: (err) => console.error('Error loading doctor:', err),
    });
  }

  initializeForm(): void {
    this.appointmentForm = this.fb.group({
      patient_id: [this.loggedInPatientId, Validators.required],
      appointment_date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.appointmentForm.invalid) return;

    const payload: Appointment = {
      ...this.appointmentForm.value,
      doctor_id: this.doctorId,
    };

    this.appointmentService.bookAppointment(payload).subscribe({
      next: () => {
        this.successMessage = 'Appointment booked successfully!';
        this.errorMessage = '';
        this.appointmentForm.reset({ patient_id: this.loggedInPatientId });
        this.submitted = false;
        setTimeout(()=>{
              this.router.navigate(['/appointments']);
        },2000)
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Booking failed.';
        this.successMessage = '';
      },
    });
  }
}
