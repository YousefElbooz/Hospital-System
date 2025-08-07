import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-my-medical-tests',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './my-medical-tests.component.html',
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
    .status-pending { 
      background-color: #fef9c3;
      color: #854d0e;
    }
    .status-completed { 
      background-color: #dcfce7;
      color: #166534;
    }
    .status-failed { 
      background-color: #fee2e2;
      color: #991b1b;
    }
  `]
})
export class MyMedicalTestsComponent implements OnInit {
  tests: any[] = [];
  isLoading = true;
  error: string | null = null;
  private apiUrl = 'http://localhost:4000'; // Base API URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTests();
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private loadTests(): void {
    this.isLoading = true;
    this.error = null;
    
    this.http.get<any[]>(`${this.apiUrl}/myMedicalTests`)
      .subscribe({
        next: (data) => {
          this.tests = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading medical tests:', err);
          this.error = 'Failed to load medical tests. Please try again later.';
          this.isLoading = false;
        }
      });
  }
}
