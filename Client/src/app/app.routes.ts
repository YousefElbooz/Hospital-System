import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientsProfileComponent } from './patients-profile/patients-profile.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { ProfileComponent } from './profile/profile.component';
import { adminGuard } from './admin-guard.guard';
import { AdminDoctorsComponent } from './admin-doctors/admin-doctors.component';
import { AdminPatientsComponent } from './admin-patients/admin-patients.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { AdminTestsComponent } from './admin-tests/admin-tests.component';
import { AdminDashBoardComponent } from './admin-dash-board/admin-dash-board.component';
import { MyMedicalReportsComponent } from './my-medical-reports/my-medical-reports.component';
import { MyMedicalTestsComponent } from './my-medical-tests/my-medical-tests.component';

export const routes: Routes = [
  {
  path: 'admin',
   canActivate: [adminGuard],
  component: LayoutComponent, // or create a separate AdminLayoutComponent if you prefer
  children: [
    { path: 'doctors', component: AdminDoctorsComponent },
    { path: 'dashboard', component: AdminDashBoardComponent },
    { path: 'patients', component: AdminPatientsComponent },
    { path: 'appointments', component: AdminAppointmentsComponent },
    { path: 'reports', component: AdminReportsComponent },
    { path: 'tests', component: AdminTestsComponent },
  ]
  },{
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'doctor/:id', component: DoctorProfileComponent },
      { 
        path: 'patients', 
        component: PatientsComponent,
        canActivate: [() => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const allowedRoles = ['admin', 'doctor'];
          return allowedRoles.includes(user.role);
        }]
      },
      { 
        path: 'patients/:id', 
        component: PatientsProfileComponent,
        canActivate: [() => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const allowedRoles = ['admin', 'doctor'];
          return allowedRoles.includes(user.role);
        }]
      },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'doctor-details/:id', component: DoctorDetailsComponent },
      { path: 'profile', component: ProfileComponent },

    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'patient-profile/:id', component: PatientsProfileComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  // Medical Reports and Tests - Direct routes with Layout
  {
    path: 'my-medical-reports',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        component: MyMedicalReportsComponent,
        canActivate: [() => true] // Always allow navigation
      }
    ]
  },
  {
    path: 'my-medical-tests',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        component: MyMedicalTestsComponent,
        canActivate: [() => true] // Always allow navigation
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
