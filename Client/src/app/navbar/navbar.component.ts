import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  role = '';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        this.userName = parsed.name;
        this.role = parsed.role;
        this.isLoggedIn = true;
      } catch (error) {
        console.error('Failed to parse user data from localStorage');
      }
    }
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.location.path().includes(route);
  }
}
