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
  baseUrl = 'http://localhost:4000/myAppointments';
  userRole: 'doctor' | 'patient' | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userRole = parsedUser.role;
    }

    this.loadMyAppointments();
  }

  loadMyAppointments(): void {
  this.appointmentService.getMyAppointments().subscribe({
    next: (res) => {
      this.appointments = res.map((appointment: any) => {
        const doctor = appointment.doctor_id || {};
        const patient = appointment.patient_id || {};

        const defaultImage = 'doctor_3.webp';

        const formatImage = (img: string | undefined): string => {
          if (!img) return defaultImage;
          return img.startsWith('http') ? img : `${this.baseUrl}/${img}`;
        };

        // Format both doctor and patient images
        const formattedDoctor = {
          ...doctor,
          image: formatImage(doctor.image)
        };

        const formattedPatient = {
          ...patient,
          image: formatImage(patient.image)
        };

        return {
          ...appointment,
          doctor_id: formattedDoctor,
          patient_id: formattedPatient
        };
      });
    },
    error: (err) => {
      console.error('❌ Error loading appointments:', err);
    }
  });
}

  delete(id: string): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(app => app._id !== id);
        },
        error: (err) => console.error('Error deleting appointment:', err)
      });
    }
  }

  updateState(id: string, newState: 'confirmed' | 'refused'): void {
    this.appointmentService.updateAppointment(id, { newState }).subscribe({
      next: () => {
        this.appointments = this.appointments.map(app =>
          app._id === id ? { ...app, state: newState } : app
        );
      },
      error: (err) => console.error('Error updating appointment state:', err)
    });
  }
}
