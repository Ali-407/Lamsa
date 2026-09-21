import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { FeaturedPerfumesComponent } from '../../components/featured-perfumes/featured-perfumes.component';
import { ShopByOccasionComponent } from '../../components/shop-by-occasion/shop-by-occasion.component';
import { ShopByScentComponent } from '../../components/shop-by-scent/shop-by-scent.component';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    FeaturedPerfumesComponent,
    ShopByOccasionComponent,
    ShopByScentComponent,
    WhyChooseUsComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {}
