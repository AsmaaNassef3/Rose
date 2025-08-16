import { Component, inject } from '@angular/core';
import { ContactService } from '../../core/services/contact/contact.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

private readonly contactService = inject(ContactService);
private readonly formBuilder = inject(FormBuilder);

contactForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    subject: [null, [Validators.required]],
    message: [null, [Validators.required]],
    phone: [null, [Validators.required]],
   
  });
   // Check if field has error and is touched
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

 contactSubmit(): void {

 
    if (this.contactForm.valid) {
      const data = { ...this.contactForm.value };
           this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (res) => {
          console.log('contact doneee', res);

        },
        error: (err) => {
          console.log(err);
        }
      });

    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
