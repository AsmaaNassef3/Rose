import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectAllProducts,
  selectIsLoading,
  selectCurrentPage,
  selectTotalPages,
  selectSearchTerm
} from '../../store/products/product.selector';
import { loadProducts, updateSearchTerm } from '../../store/products/products.actions';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-allcategory',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CurrencyPipe],
  templateUrl: './allcategory.component.html',
})
export class AllcategoryComponent implements OnInit {
  private store = inject(Store);

  products$     = this.store.select(selectAllProducts);
  isLoading$    = this.store.select(selectIsLoading);
  currentPage$  = this.store.select(selectCurrentPage);
  totalPages$   = this.store.select(selectTotalPages);
  searchTerm$   = this.store.select(selectSearchTerm);

  ngOnInit(): void {
  
    this.searchTerm$.pipe(take(1)).subscribe(search => {
      this.store.dispatch(loadProducts({ page: 1 }));
    });
  }

  changePage(page: number): void {
    if (page < 1) return;

    this.totalPages$.pipe(take(1)).subscribe(total => {
      if (page <= total) {
     
        this.searchTerm$.pipe(take(1)).subscribe(search => {
          if (search && search.trim() !== '') {
            this.store.dispatch(updateSearchTerm({ searchTerm: search, page }));
          } else {
            this.store.dispatch(loadProducts({ page }));
          }
        });
      }
    });
  }

  getArray(totalPages: number): number[] {
    const limit = Math.min(totalPages, 10);
    return Array.from({ length: limit }, (_, i) => i + 1);
  }
}
