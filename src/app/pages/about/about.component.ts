import { Component } from '@angular/core';
import { LyersComponent } from "../../shared/ui/lyers/lyers.component";
import { CustomerComponent } from "../../shared/ui/customer/customer.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LyersComponent, CustomerComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

}
