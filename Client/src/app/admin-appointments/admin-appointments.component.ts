import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../appointment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-appointments',
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.css'],
  imports:[DatePipe]
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe((res) => {
      this.appointments = res;
    });
  }

  deleteAppointment(id: string): void {
    if (confirm('Delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe(() => this.loadAppointments());
    }
  }
}
