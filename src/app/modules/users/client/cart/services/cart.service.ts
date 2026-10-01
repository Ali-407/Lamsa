import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItems = signal<CartItem[]>([]);

  subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  deliveryFee = computed(() => {
    return this.cartItems().length > 0 ? 10 : 0;
  });

  total = computed(() => {
    return this.subtotal() + this.deliveryFee();
  });

  itemCount = computed(() => {
    return this.cartItems().reduce((count, item) => count + item.quantity, 0);
  });

  updateQuantity(id: string, delta: number): void {
    this.cartItems.update(items => {
      return items.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  }

  removeItem(id: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }

  addToCart(product: any): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          size: product.size || 'SMALL',
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image || product.images?.[0] || ''
        };
        return [...items, newItem];
      }
    });
  }
}
