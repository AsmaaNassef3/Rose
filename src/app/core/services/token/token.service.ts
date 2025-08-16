import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { PlatformService } from '../platForm/platform.service';
import { Currentuser } from '../../../shared/interfaces/currentuser/currentuser';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private platformService = inject(PlatformService);
  private token: string | null = null;

  currentUser: WritableSignal<Currentuser> = signal({} as Currentuser);

  constructor() {
    if (this.platformService.isBrowser()) {
      this.token = localStorage.getItem('token');
    }
  }
  updateCurrentUser(): void {
    if (this.token) {
      this.currentUser.set(jwtDecode(this.token));
      console.log('Current user updated:', this.currentUser());
   }
  }

  isAuthenticated(): boolean {
    return Object.keys(this.currentUser()).length > 0;
  }

  onLogedOut(): void {
    this.currentUser.set({ } as Currentuser);
  }
}
