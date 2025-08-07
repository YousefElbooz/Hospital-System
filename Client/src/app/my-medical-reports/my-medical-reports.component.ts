import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-my-medical-reports',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './my-medical-reports.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
  `]
})
export class MyMedicalReportsComponent implements OnInit {
  reports: any[] = [];
  isLoading = true;
  error: string | null = null;
  private apiUrl = 'http://localhost:4000'; // Base API URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.isLoading = true;
    this.error = null;
    
    this.http.get<any[]>(`${this.apiUrl}/reports/my-tests`)
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading medical reports:', err);
          this.error = 'Failed to load medical reports. Please try again later.';
          this.isLoading = false;
        }
      });
  }
}
