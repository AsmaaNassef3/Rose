import { Product } from './../../shared/interfaces/home/popularitems';
import { BestSeller } from './../../shared/interfaces/bestseller/bestseller';
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../shared/interfaces/categories/categories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { PestsellerService } from '../../core/services/pestseller/pestseller.service';


import { OwlOptions } from 'ngx-owl-carousel-o';
import { LyersComponent } from "../../shared/ui/lyers/lyers.component";
import { ChartService } from '../../core/services/chart/chart.service';
import { Router, RouterLink } from '@angular/router';
import { CustomerComponent } from "../../shared/ui/customer/customer.component";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, LyersComponent, RouterLink, CustomerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
private readonly pestsellerService = inject(PestsellerService);
private readonly categoriesService = inject(CategoriesService);
private readonly chartService = inject(ChartService);

private readonly router = inject(Router);

customOptions: OwlOptions = {
  loop: true,
  autoplay: true,
  autoplayTimeout: 1000, // يتغير كل 3 ثواني
  autoplayHoverPause: true, // يوقف الحركة لو حطيتي الماوس عليه
  smartSpeed: 400, // سرعة الحركة بين الكروت (كل ما زادت بقت أبطأ)
  nav: true,
  navText: ['‹', '›'],
  dots: false,
  responsive: {
    0: {
      items: 1
    },
    640: {
      items: 3
    },
    1024: {
      items: 3
    }
  }
};
  categoryData: WritableSignal<Category[]> = signal([]);
  pestSeller: WritableSignal<BestSeller[]> = signal([]);
  popularItems: WritableSignal<Product[]> = signal([]);
  get reversedCategories(): Category[] {
    return this.categoryData().slice().reverse().slice(0, 5);
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryData.set(res.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

getAllPestsellerData() {
    this.pestsellerService.getPestsellerData().subscribe({
      next: (res) => {    

        this.pestSeller.set(res.bestSeller
);
console.log(this.pestSeller)

      },
      error: (error) => {
        console.error('Error fetching pestseller data:', error);
      }
    });
  }
  getPopularItems() {
this.pestsellerService.getAllProducts().subscribe({
    next: (res) => {    

console.log("prroducts",res.products)
this.popularItems.set(res.products)
console.log('pop',this.popularItems)
      },
      error: (error) => {
        console.error('Error fetching pestseller data:', error);
      }
})
  }

  AddToCart(productId: string, quantity: number) {
     const data = {
    product: productId,
    quantity: quantity
  };
    this.chartService.addProductToChart(data).subscribe({
      next: (res) => {
        console.log('producttCart',res)
          this.chartService.cartNum.set(res.numOfCartItems);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      
      }
    });
  }



  ngOnInit(): void {
    this.getAllCategories();
    this.getAllPestsellerData();
  this.getPopularItems();
  }
}

