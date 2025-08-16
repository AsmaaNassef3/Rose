import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../layouts/components/sidenav/sidenav.component';

@Component({
  selector: 'app-updateprofile',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.scss'
})
export class UpdateprofileComponent {

}
