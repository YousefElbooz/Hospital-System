import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editableUser: any = {};
  entries: [string, any][] = [];
  editMode = false;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.editableUser = { ...res };
        this.entries = Object.entries(res).filter(
          ([key]) => key !== 'image' && key !== 'password' && key !== '__v'
        );
      },
      error: (err) => console.error(err),
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.editableUser.imageFile = file;
    }
  }

  saveChanges(): void {
    const formData = new FormData();
    formData.append('name', this.editableUser.name || '');
    formData.append('email', this.editableUser.email || '');
    if (this.editableUser.imageFile) {
      formData.append('image', this.editableUser.imageFile);
    }

    this.profileService.updateProfile(formData).subscribe({
  next: (res) => {
    this.user = res;
    alert('Profile updated!');
  },
  error: (err) => {
    console.error(err);
    alert('Failed to update profile');
  }
});

  }

  cancelEdit(): void {
    this.editableUser = { ...this.user };
    this.previewUrl = null;
    this.editMode = false;
  }
}
