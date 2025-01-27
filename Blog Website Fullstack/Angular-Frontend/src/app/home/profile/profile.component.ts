import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,

} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileSettingsForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private profileService: ProfileService) { };

  ngOnInit(): void {
    this.profileSettingsForm = this.fb.group({
      displayName: ['', [Validators.minLength(3)]],
      password: ['', [Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!#%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      email: ['', Validators.email]
    });

    this.profileService.getUserDetails().subscribe((data:any) => {
      console.log(data);
      this.profileSettingsForm.patchValue({
        displayName: data.displayName,
        password: data.password,
        email: data.email
      });
    });
  }

  onSubmit() {
    this.profileService.updateUser(this.profileSettingsForm.value);
    this.router.navigate(['mainmenu/']);
  }

  onBack() {
    this.router.navigate(['mainmenu/']);
  }
}
