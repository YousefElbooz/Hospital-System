import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css'],
  imports:[RouterLink,RouterLinkActive]
})
export class AdminDashBoardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate(['/admin', path]);
  }
}