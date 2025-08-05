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

export const routes: Routes = [
      {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'doctor/:id', component: DoctorProfileComponent },
      { path: 'patient', component: PatientsComponent },
      { path: 'patient/:id', component: PatientsProfileComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'doctors/:id', component: DoctorDetailsComponent },
      { path: 'profile', component: ProfileComponent },

    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  { path: '**', component: NotFoundComponent }
];
