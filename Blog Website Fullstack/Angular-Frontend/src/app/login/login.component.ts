import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
	FormGroup,
	Validators,
	FormBuilder,
	ReactiveFormsModule,
	FormsModule,
} from '@angular/forms';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword:boolean = false;

  constructor(private fb: FormBuilder , private blogService:BlogService ,private router:Router){
    if(!!sessionStorage.getItem('accessToken')){
      this.router.navigate(['mainmenu']);
    }
  };

  ngOnInit():void {
    this.loginForm = this.fb.group({
      userName: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  onSubmit(){
    this.blogService.signin(this.loginForm.value);
    this.loginForm.reset();
  }

  signUp(){
    this.router.navigate(['signup']);
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

}
