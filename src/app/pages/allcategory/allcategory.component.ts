import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category } from '../../shared/interfaces/categories/categories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-allcategory',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './allcategory.component.html',
  styleUrls: ['./allcategory.component.scss']
})
export class AllcategoryComponent implements OnInit {
  sliderImages = [
    '/assets/images/slide-1.png',
    '/assets/images/slide-2.png',
    '/assets/images/slide-3.png',
    '/assets/images/slide-4.png'
  ];

  sliderOptions = {
    loop: true,
    margin: 16,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1024: { items: 1 }
    }
  };
  

  private readonly categoriesService = inject(CategoriesService);
  categoryData: WritableSignal<Category[]> = signal([]);

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

  ngOnInit(): void {
    this.getAllCategories();
  }
}
