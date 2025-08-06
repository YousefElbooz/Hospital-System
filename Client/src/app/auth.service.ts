import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:4000/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    this.loggedIn.next(!!token);
    this.userRole.next(user ? JSON.parse(user).role : null);
  }

  login(data: { email: string; password: string; role: 'admin' | 'doctor' | 'patient' }) {
    const endpoint = 'login';

    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, data).pipe(
      tap(res => {
        // ✅ Store complete user info in one object
        const userData = {
          _id: res.userId || res.adminId,
          name: res.name,
          role: res.role,
          img: res.img || null
        };
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(userData));

        this.loggedIn.next(true);
        this.userRole.next(userData.role);
      })
    );
  }

  signupDoctor(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup-doctor`, data);
  }

  signupPatient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup-patient`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  getUserId(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  }

  getUserName(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).name : null;
  }

  getUserImage(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).img : null;
  }
}
