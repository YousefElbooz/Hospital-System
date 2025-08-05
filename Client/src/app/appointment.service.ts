import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  state?: string;
}

const BASE_URL = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  // 🔐 Get headers with token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Book an appointment
  bookAppointment(data: Appointment): Observable<any> {
    return this.http.post(`${BASE_URL}/appointments`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get all appointments (Admin use)
  getAllAppointments(): Observable<any> {
    return this.http.get(`${BASE_URL}/appointments`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get appointments for logged-in user
getMyAppointments(): Observable<any> {
  return this.http.get(`${BASE_URL}/myAppointments`, {
    headers: this.getAuthHeaders()
  });
}


  // ✅ Get appointment by ID
  getAppointmentById(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/appointments/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get appointments by email (optional)
  getAppointmentsByEmail(email: string): Observable<any> {
    return this.http.get(`${BASE_URL}/appointments/email/${email}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update appointment (e.g. change status)
  updateAppointment(id: string, update: Partial<Appointment>): Observable<any> {
    return this.http.patch(`${BASE_URL}/appointments/id/${id}`, update, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete appointment
  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/appointments/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
