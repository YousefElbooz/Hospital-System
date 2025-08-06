// src/app/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

getAllPatients(): Observable<any> {
  return this.http.get(`${BASE_URL}/admin/users`, {
    headers: this.getAuthHeaders()
  });
}

createPatient(data: any): Observable<any> {
  return this.http.post(`${BASE_URL}/admin/patients`, data, {
    headers: this.getAuthHeaders()
  });
}

deletePatient(id: string): Observable<any> {
  return this.http.delete(`${BASE_URL}/admin/patients/${id}`, {
    headers: this.getAuthHeaders()
  });
}
updatePatient(id: string, data: any): Observable<any> {
  return this.http.put(`${BASE_URL}/admin/patients/${id}`, data, {
    headers: this.getAuthHeaders()
  });
}



  // Optional: Get patient by ID
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/admin/users/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
