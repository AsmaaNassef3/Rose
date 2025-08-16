import { Component, ViewChild, ElementRef, inject, computed, Signal, OnInit, signal,} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../../core/services/token/token.service';
import { PlatformService } from '../../../core/services/platForm/platform.service';
import { AuthComponent } from "../../auth/auth.component";
import { ChartService } from '../../../core/services/chart/chart.service';
import { PestsellerService } from '../../../core/services/pestseller/pestseller.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, AuthComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
@ViewChild('modal') modalRef!: ElementRef<HTMLDialogElement>;
private chartService = inject(ChartService);
private pestsellerService = inject(PestsellerService);
public tokenService = inject(TokenService);
 showSearch = signal(false); // إظهار أو إخفاء الانبت
  searchValue = signal(''); 
cartCount:Signal<number>=computed(()=>this.chartService.cartNum())
  openModal() {
    this.modalRef.nativeElement.showModal();
  }
    closeModal() {
    this.modalRef.nativeElement.close();
  }
 toggleSearch() {
    this.showSearch.update(prev => !prev);
  }
    onSearch() {
    this.pestsellerService.searchTerm.set(this.searchValue());
  }
ngOnInit(): void {
  this.chartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log("cart items", res.message);
        this.chartService.cartNum.set(res.numOfCartItems);
        console.log("Total cart items:", this.chartService.cartNum());
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }
}

