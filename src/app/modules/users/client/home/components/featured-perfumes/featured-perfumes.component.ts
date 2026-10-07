import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfumeCardComponent } from '../../../../../../shared/components/perfume-card/perfume-card.component';
import { Perfume } from '../../../../../../core/models/perfume.model';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-featured-perfumes',
  standalone: true,
  imports: [CommonModule, PerfumeCardComponent],
  templateUrl: './featured-perfumes.component.html',
  styleUrl: './featured-perfumes.component.scss'
})
export class FeaturedPerfumesComponent implements OnInit {
  private productService = inject(ProductService);

  perfumes = signal<Perfume[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const featured = await this.productService.fetchFeaturedProducts();
      const mapped: Perfume[] = featured.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        scentFamily: `${p.scentFamily} Accord`,
        category: p.category,
        imageUrl: p.imageUrl,
        images: p.imageUrl
      }));
      this.perfumes.set(mapped);
    } catch (err) {
      console.error('Failed to load featured perfumes:', err);
      this.error.set('Failed to load featured perfumes.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
