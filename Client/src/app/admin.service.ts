import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:4000'; // Replace with your actual backend URL

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🔍 Get all users (doctors + patients)
  getAllUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔍 Get user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/admin/users/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 🔍 Get user by Email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${BASE_URL}/admin/users/email/${email}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✏️ Update user
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${BASE_URL}/admin/users/id/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 🗑️ Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/admin/users/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getDoctorById(id: string): Observable<any> {
  return this.http.get(`${BASE_URL}/doctors/${id}`, {
    headers: this.getAuthHeaders()
  });
  }

}
