import { NgClass } from "@angular/common";
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // SEND FORM DATA TO AuthService
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // If SUCCESS
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Login Failed', err);
          alert(err.error?.message ?? 'Cannot reach the server. Is the back-end running?');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
