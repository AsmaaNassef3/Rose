import { Component,  Output, EventEmitter ,Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthUseCaseService } from '../../domain/auth-use-case-service';
import { AuthBtnComponent } from '../../../../shared/ui/auth-btn/auth-btn.component';
import { TokenService } from '../../../services/token/token.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthBtnComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authUseCaseService = inject(AuthUseCaseService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
   private readonly tokenService = inject(TokenService);
successMessage: string | null = null;

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() clickRegister = new EventEmitter<void>();
  @Output() clickForgot = new EventEmitter<void>();
  @Output() forgot = new EventEmitter<void>();
  // Inject platformId to detect browser/server environment
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
  });

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.authUseCaseService.executeLogin(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('formLogin', res);
          if (res.message === 'success') {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
              this.tokenService.updateCurrentUser();
if(this.tokenService.currentUser().role === 'admin') {
                this.router.navigate(['/dashboard']);
}
      this.successMessage = 'تم تسجيل الدخول بنجاح!';
            }
            setTimeout(() => {
   
              this.loginSuccess.emit(); 

            }, 500);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}
