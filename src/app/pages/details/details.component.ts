import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PestsellerService } from './../../core/services/pestseller/pestseller.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Product } from '../../shared/interfaces/details/details';
import { ChartService } from '../../core/services/chart/chart.service';

type ColorKey = 'black' | 'red' | 'blue';

@Component({
  selector: 'app-details',
  imports: [DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  private readonly pestSellerService = inject(PestsellerService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly chartService = inject(ChartService);
  productDetail: WritableSignal<Product[]> = signal([]);
  selectedImageIndex: WritableSignal<number> = signal(0);
  isLoading: WritableSignal<boolean> = signal(false);

  // هيتبني بعد ما البيانات توصل
  colorImageMap: Record<ColorKey, string> = {
    black: '',
    red: '',
    blue: ''
  };

  ngOnInit(): void {
    this.loadProductDetails();
  }

  private loadProductDetails(): void {
    this.isLoading.set(true);
    
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.pestSellerService.getSpecificProduct(productId!).subscribe({
          next: (res) => {
            this.productDetail.set([res.product]);

            // نبني الماب بعد وصول البيانات
            this.colorImageMap = {
              black: res.product.imgCover,
              red: res.product.images[0] ?? '',
              blue: res.product.images[1] ?? ''
            };

            this.isLoading.set(false);
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  // اختيار اللون
  selectColor(color: ColorKey) {
    const imgUrl = this.colorImageMap[color];
    const product = this.productDetail()[0];
    if (!product) return;

    const imgIndex = product.images.indexOf(imgUrl);

    if (imgIndex >= 0) {
      this.selectImage(imgIndex);
    } else {
      // لو هو الـ imgCover نخلي المؤشر -1
      this.selectImage(-1);
    }
  }

  // Image Gallery Methods
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  getCurrentImage(product: Product): string {
    const index = this.selectedImageIndex();
    if (index === -1) {
      return product.imgCover;
    }
    if (product.images && product.images.length > index) {
      return product.images[index];
    }
    return product.imgCover;
  }

  // Utility Methods
  getDiscountPercentage(product: Product): number {
    if (product.priceAfterDiscount && product.priceAfterDiscount < product.price) {
      return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
    }
    return 0;
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Limited Stock';
    return 'In Stock';
  }

  AddToCart(productId: string, quantity: number) {
     const data = {
    product: productId,
    quantity: quantity
  };
    this.chartService.addProductToChart(data).subscribe({
      next: (res) => {
        console.log('producttCart',res)
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }



}
