import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthBtnComponent } from '../../shared/ui/auth-btn/auth-btn.component';
import { UpdateprofileService } from '../../core/services/updateprofile/updateprofile.service';
import { TokenService } from '../../core/services/token/token.service';

@Component({
  selector: 'app-updatepass',
  imports: [CommonModule, ReactiveFormsModule, AuthBtnComponent, RouterLink],
  templateUrl: './updatepass.component.html',
  styleUrl: './updatepass.component.scss'
})
export class UpdatepassComponent {
 private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
    private updateprofileService = inject(UpdateprofileService)
    private readonly tokenService = inject(TokenService);



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


  registerForm: FormGroup = this.formBuilder.group({
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
    newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
   
  })



updatePassword(){
  if (this.registerForm.valid) {
      this.updateprofileService.changePassword(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('UpdatePassword', res);
           alert('New Password Successsssss شطووره ي سماسيمووو');
          if (res.message === 'success') {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
              this.tokenService.updateCurrentUser();
              

            }
            setTimeout(() => {
   
                       this.router.navigate(['/home']);

            }, 500);
          }
        },
        error: (err) => {
          console.log(err);
          alert('كلمة المرور القديمة غير صحيحة');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
}

}
