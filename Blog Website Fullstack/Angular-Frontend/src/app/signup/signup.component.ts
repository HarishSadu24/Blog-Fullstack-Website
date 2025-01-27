import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  constructor(private fb: FormBuilder , private blogService: BlogService , private router: Router){};

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userName : ['', [ Validators.required , Validators.minLength(3)]],
      displayName : ['',[ Validators.required , Validators.minLength(3)]],
      password: ['', [ Validators.required , Validators.minLength(3) , Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!#%*?&])[A-Za-z\\d@$!%*?&]{8,}$') ]],
      confirmPassword: ['', [ Validators.required , Validators.minLength(3) ]],
      email: ['',Validators.email]
    },
    {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup){
    const password:string = form.get('password')?.value;
    const confirmPassword:string = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch:true };
  }

  onSubmit(): void {
    if(this.signupForm.valid){
      const { confirmPassword , ...data } = this.signupForm.value;
      // console.log(data);
      
      this.blogService.signUp(data).subscribe((res)=>{
        
        if(res.status == 400){
          this.router.navigate(['']);
          alert('User already exists');
        }
        else{
          this.router.navigate(['']);
          alert('User successfully created');
        }
      },
    );
      this.signupForm.reset();
    }
  }

  onCancel(){
    this.router.navigate([''])
  }
}
