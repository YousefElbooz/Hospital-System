import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patients.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

interface MedicalReportForm {
  reportTitle: string;
  content: string;
  relatedTests: string[];
  attachment: File | null;
  patientId: string;
}

interface MedicalTestForm {
  testType: string;
  status: string;
  result: string;
  notes: string;
  attachment: File | null;
}

@Component({
  selector: 'app-patients-profile',
  templateUrl: './patients-profile.component.html',
  styleUrls: ['./patients-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PatientsProfileComponent implements OnInit {
  patient: any = null;
  isLoading = true;
  error: string | null = null;
  activeTab: 'reports' | 'tests' = 'reports';

  // Form states
  showReportForm = false;
  showTestForm = false;
  isSubmitting = false;
  formError: string | null = null;

  // Form models
  newReport: MedicalReportForm = {
    reportTitle: '',
    content: '',
    relatedTests: [],
    attachment: null,
    patientId: ''
  };

  newTest: MedicalTestForm = {
    testType: '',
    status: 'pending',
    result: '',
    notes: '',
    attachment: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPatient();
  }

  // Navigation
  goBack() {
    this.router.navigate(['/patients']);
  }

  setActiveTab(tab: 'reports' | 'tests') {
    this.activeTab = tab;
  }

  // Form control methods
  openReportForm() {
    this.newReport = {
      reportTitle: '',
      content: '',
      relatedTests: [],
      attachment: null,
      patientId: this.patient?._id || ''
    };
    this.showReportForm = true;
    this.formError = null;
  }

  openTestForm() {
    this.newTest = {
      testType: '',
      result: '',
      status: 'pending',
      notes: '',
      attachment: null
    };
    this.showTestForm = true;
    this.formError = null;
  }

  closeReportForm() {
    this.showReportForm = false;
    this.formError = null;
  }

  closeTestForm() {
    this.showTestForm = false;
    this.formError = null;
  }

  // File handling
  onReportFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newReport.attachment = input.files[0];
    }
  }

  onTestFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newTest.attachment = input.files[0];
    }
  }

  // Form submission
  async submitReport() {
    if (!this.patient?._id) {
      this.formError = 'Patient information is not available';
      return;
    }

    if (!this.newReport.reportTitle || !this.newReport.content) {
      this.formError = 'Title and content are required';
      return;
    }

    this.isSubmitting = true;
    this.formError = null;

    try {
      const user = this.authService.getCurrentUser();
      if (!user || !user._id) {
        throw new Error('You must be logged in as a doctor to create a report');
      }

      // Create form data with required fields
      const formData = new FormData();
      formData.append('reportTitle', this.newReport.reportTitle);
      formData.append('content', this.newReport.content);
      formData.append('patient', this.patient._id); // Note: 'patient' not 'patientId'
      formData.append('doctor_id', user._id); // Note: 'doctor_id' not 'doctorId'
      formData.append('doctor', user._id); // Also need 'doctor' field
      
      // Add report date (current date if not provided)
      const reportDate = new Date().toISOString();
      formData.append('reportDate', reportDate);

      // Handle file upload if present
      if (this.newReport.attachment) {
        formData.append('attachment', this.newReport.attachment, this.newReport.attachment.name);
        // If your backend expects a URL, you'll need to upload the file first and get the URL
        // For now, we'll just add a placeholder
        formData.append('attachmentUrl', 'pending-upload');
      } else {
        formData.append('attachmentUrl', ''); // Required field
      }

      // Handle related tests - ensure it's an array of strings
      let relatedTests: string[] = [];
      if (this.newReport.relatedTests && this.newReport.relatedTests.length > 0) {
        // Ensure we have an array of strings
        relatedTests = this.newReport.relatedTests.map(testId => 
          typeof testId === 'string' ? testId : String(testId)
        );
      }
      formData.append('relatedTests', JSON.stringify(relatedTests));

      console.log('Submitting report with data:', {
        reportTitle: this.newReport.reportTitle,
        content: this.newReport.content,
        patient: this.patient._id,
        doctor_id: user._id,
        doctor: user._id,
        reportDate,
        hasAttachment: !!this.newReport.attachment,
        relatedTestsCount: this.newReport.relatedTests?.length || 0
      });

      // Log the complete form data for debugging
      console.log('Sending request to create medical report with form data:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      
      // Call the service to create the report
      const response = await this.patientService.createMedicalReport(formData).toPromise();
      console.log('Report created successfully:', response);

      // Refresh the patient data
      await this.loadPatient();
      this.closeReportForm();
    } catch (error: any) {
      console.error('===== ERROR CREATING REPORT =====');
      console.error('Error object:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error status text:', error.statusText);
      console.error('Error URL:', error.url);
      console.error('Error error:', error.error);
      console.error('Error headers:', error.headers);
      console.error('Error stack:', error.stack);
      console.error('================================');
      
      // Extract error message from response if available
      let errorMessage = 'Failed to create report. Please try again.';
      
      if (error.error) {
        // Handle validation errors
        if (error.error.errors) {
          const errorMessages = Object.values(error.error.errors).map((e: any) => e.message || e);
          errorMessage = errorMessages.join('\n');
        } 
        // Handle other error messages from server
        else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.formError = errorMessage;
    } finally {
      this.isSubmitting = false;
    }
  }

  async submitTest() {
    if (!this.patient?._id) {
      this.formError = 'Patient information is not available';
      return;
    }

    if (!this.newTest.testType) {
      this.formError = 'Test type is required';
      return;
    }

    this.isSubmitting = true;
    this.formError = null;

    try {
      const formData = new FormData();
      formData.append('testType', this.newTest.testType);
      formData.append('result', this.newTest.result || '');
      formData.append('status', this.newTest.status);
      formData.append('notes', this.newTest.notes || '');
      formData.append('patientId', this.patient._id);

      // Get current user (doctor) ID
      const user = this.authService.getCurrentUser();
      if (user && user._id) {
        formData.append('doctorId', user._id);
      } else {
        throw new Error('You must be logged in as a doctor to create a test');
      }

      if (this.newTest.attachment) {
        formData.append('attachment', this.newTest.attachment, this.newTest.attachment.name);
      }

      console.log('Submitting test with data:', {
        testType: this.newTest.testType,
        status: this.newTest.status,
        patientId: this.patient._id,
        doctorId: user._id,
        hasAttachment: !!this.newTest.attachment
      });

      // Call the service to create the test
      const response = await this.patientService.createMedicalTest(formData).toPromise();
      console.log('Test created successfully:', response);

      // Refresh the patient data
      await this.loadPatient();
      this.closeTestForm();
    } catch (error: any) {
      console.error('Error creating test:', error);
      this.formError = error.error?.message || error.message || 'Failed to create test. Please try again.';
      
      // If there's a validation error with details
      if (error.error?.errors) {
        const errorMessages = Object.values(error.error.errors).map((e: any) => e.message || e);
        this.formError = errorMessages.join('\n');
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  // Data loading methods
  private loadPatient() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No patient ID provided';
      this.isLoading = false;
      return;
    }

    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        // Load related data
        this.loadPatientMedicalReports(id);
        this.loadPatientMedicalTests(id);
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.error = 'Failed to load patient details';
        this.isLoading = false;
      }
    });
  }

  private loadPatientMedicalTests(patientId: string) {
    console.log('Loading medical tests for patient ID:', patientId);
    this.patientService.getPatientMedicalTests(patientId).subscribe({
      next: (tests) => {
        console.log('Received medical tests:', tests);
        this.patient = {
          ...this.patient,
          medicalTests: tests
        };
      },
      error: (error) => {
        console.error('Error loading medical tests:', error);
        this.patient = {
          ...this.patient,
          medicalTests: []
        };
      }
    });
  }

  private loadPatientMedicalReports(patientId: string) {
    console.log('Loading medical reports for patient ID:', patientId);
    this.patientService.getPatientMedicalReports(patientId).subscribe({
      next: (response) => {
        console.log('Received medical reports response:', response);
        const reports = Array.isArray(response) ? response : [];

        this.patient = {
          ...this.patient,
          medicalReports: reports
        };

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medical reports:', error);
        this.patient = {
          ...this.patient,
          medicalReports: []
        };
        this.isLoading = false;
      }
    });
  }
}
