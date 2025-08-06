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
  id:number=0
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        // console.log(this.user)
        this.editableUser = { ...res };
        this.id=this.user._id
        this.entries = Object.entries(res).filter(
          ([key]) =>  key !== 'image'&& key !== 'password' && key !== '__v'
        );
      },
      error: (err) => console.error(err),
    });
  
  }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrl = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //     this.editableUser.imageFile = file;
  //   }
  // }
  

  saveChanges(): void {
    type myObj={
    name:string;
    email:string;
    image:string
  }
    const dataObj :myObj = {
      name:this.editableUser.name,
      email:this.editableUser.email ,
      image:this.editableUser.image 
    }
  

    this.profileService.updateProfile({id:this.id,dataObj}).subscribe({
  next: (res) => {
    this.user = res;
    alert('Profile updated!');
  },
  error: (err) => {
    console.error(err);
    alert('Failed to update profile');
  }
});
   this.cancelEdit()
  window.location.reload();


  }

  cancelEdit(): void {
    this.editableUser = { ...this.user };
    this.previewUrl = null;
    this.editMode = false;
  }
}
