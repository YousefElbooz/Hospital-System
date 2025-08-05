import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  baseUrl = 'http://localhost:4000';
  userRole: string | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role'); // Get user role
    this.loadMyAppointments();
  }

  loadMyAppointments(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (res) => {
        this.appointments = res.map((app: any) => ({
          ...app,
          doctor_id: {
            ...app.doctor_id,
            image: app.doctor_id.image?.startsWith('http')
              ? app.doctor_id.image
              : `${this.baseUrl}${app.doctor_id.image}`,
          },
        }));
      },
      error: (err) => console.error(err)
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(() => {
        this.appointments = this.appointments.filter((app) => app._id !== id);
      });
    }
  }

  updateState(id: string, newState: 'confirmed' | 'refused'): void {
    this.appointmentService.updateAppointment(id, { state: newState }).subscribe({
      next: () => {
        // Update UI instantly
        this.appointments = this.appointments.map(app =>
          app._id === id ? { ...app, state: newState } : app
        );
      },
      error: (err) => console.error(err)
    });
  }
}
