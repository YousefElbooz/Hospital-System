// src/app/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  }).pipe(
    map((res: any) => {
      // The API returns { doctors: [...], patients: [...] }
      // We only want to return patients
      if (res && res.patients) {
        return res.patients;
      }
      return [];
    }),
    catchError(error => {
      console.error('Error fetching patients:', error);
      return of([]);
    })
  );
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
    return this.http.put(
      `${BASE_URL}/admin/patients/${id}`, 
      data, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating patient:', error);
        return of(null);
      })
    );
  }



  // Optional: Get patient by ID
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${BASE_URL}/admin/users/id/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get medical tests for a specific patient
  getPatientMedicalTests(patientId: string): Observable<any> {
    console.log('Fetching medical tests for patient ID:', patientId);
    const url = `${BASE_URL}/medical-tests/patient/${patientId}`;
    console.log('Request URL:', url);
    
    return this.http.get(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        console.log('Raw medical tests response:', response);
        
        // If response is already an array, return it directly
        if (Array.isArray(response)) {
          console.log('Response is an array, returning directly');
          return response;
        }
        
        // Handle the new response format { success, count, data }
        if (response && typeof response === 'object') {
          // Check if response has a data property that's an array
          if (Array.isArray(response.data)) {
            console.log('Found tests in response.data');
            return response.data;
          }
          
          // If no data property but response is an object with tests, try to return it as an array
          if (response.tests && Array.isArray(response.tests)) {
            console.log('Found tests in response.tests');
            return response.tests;
          }
          
          // If no array found in the response, return an empty array
          console.warn('No array found in response:', response);
          return [];
        }
        
        console.warn('Unexpected response format, returning empty array');
        return [];
      }),
      catchError(error => {
        console.error('Error fetching patient medical tests:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return of([]);
      })
    );
  }

  // Get medical reports for a specific patient
  getPatientMedicalReports(patientId: string): Observable<any> {
    console.log('Fetching medical reports for patient ID:', patientId);
    const url = `${BASE_URL}/reports/patient/${patientId}`;
    console.log('Request URL:', url);
    
    return this.http.get(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: any) => {
        console.log('Raw API response:', response);
        
        // If response is already an array, return it directly
        if (Array.isArray(response)) {
          console.log('Response is an array, returning directly');
          return response;
        }
        
        // Handle the new response format { success, count, data }
        if (response && typeof response === 'object') {
          // Check if response has a data property that's an array
          if (Array.isArray(response.data)) {
            console.log('Found reports in response.data');
            return response.data;
          }
          
          // If no data property but response is an object with reports, try to return it as an array
          if (response.reports && Array.isArray(response.reports)) {
            console.log('Found reports in response.reports');
            return response.reports;
          }
          
          // If no array found in the response, return an empty array
          console.warn('No array found in response:', response);
          return [];
        }
        
        console.warn('Unexpected response format, returning empty array');
        return [];
      }),
      catchError(error => {
        console.error('Error fetching patient medical reports:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return of([]);
      })
    );
  }

  // Create a new medical report
  createMedicalReport(formData: FormData): Observable<any> {
    // For file uploads, we need to let the browser set the Content-Type with the boundary
    const headers = this.getAuthHeaders()
      .set('enctype', 'multipart/form-data')
      .delete('Content-Type'); // Let the browser set the Content-Type with boundary

    console.log('Sending medical report with headers:', headers);
    
    // Log all form data keys and values for debugging
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    
    return this.http.post(`${BASE_URL}/reports`, formData, { 
      headers,
      observe: 'response' // Get the full response including status and headers
    }).pipe(
      map(response => {
        console.log('Full response:', response);
        return response.body;
      }),
      catchError(error => {
        console.error('Error creating medical report:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          headers: error.headers,
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        // Return the error to be handled by the component
        return throwError(() => error);
      })
    );
  }

  // Create a new medical test
  createMedicalTest(formData: FormData): Observable<any> {
    // For file uploads, we need to let the browser set the Content-Type with the boundary
    const headers = this.getAuthHeaders()
      .set('enctype', 'multipart/form-data')
      .delete('Content-Type'); // Let the browser set the Content-Type with boundary

    console.log('Sending medical test with headers:', headers);
    
    return this.http.post(`${BASE_URL}/medical-tests`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error creating medical test:', error);
        // Return the error to be handled by the component
        return throwError(() => error);
      })
    );
  }
}
