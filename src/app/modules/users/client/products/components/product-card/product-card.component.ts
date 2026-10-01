import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  isAdded = false;

  onAddToCart(): void {
    if (!this.isAdded) {
      this.isAdded = true;
      this.addToCart.emit(this.product);
      setTimeout(() => {
        this.isAdded = false;
      }, 3000);
    }
  }
}
