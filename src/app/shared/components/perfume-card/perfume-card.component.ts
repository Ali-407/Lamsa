import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfume } from '../../../core/models/perfume.model';
import { CartService } from '../../../modules/users/client/cart/services/cart.service';

@Component({
  selector: 'app-perfume-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfume-card.component.html',
  styleUrl: './perfume-card.component.scss'
})
export class PerfumeCardComponent {
  @Input() perfume?: Perfume;
  private cartService = inject(CartService);

  isAdding = false;
  showNotification = false;

  onAddToCart(): void {
    if (this.perfume && !this.isAdding) {
      this.isAdding = true;
      this.cartService.addToCart({
        id: this.perfume.id,
        name: this.perfume.name,
        price: this.perfume.price,
        image: this.perfume.imageUrl || this.perfume.images || ''
      });

      this.showNotification = true;

      setTimeout(() => {
        this.isAdding = false;
        this.showNotification = false;
      }, 3000);
    }
  }
}
