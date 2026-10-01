import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { Product, VolumeOption } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BreadcrumbComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  product = signal<Product | undefined>(undefined);
  relatedProducts = signal<Product[]>([]);
  selectedVolume = signal<VolumeOption | undefined>(undefined);
  quantity = signal<number>(1);
  giftWrap = signal<boolean>(false);
  activeImageIndex = signal<number>(0);
  isAddedToCart = signal<boolean>(false);

  // Dynamic breadcrumb items
  breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const prod = this.product();
    return [
      { label: 'Home', url: '/' },
      { label: 'Shop', url: '/products' },
      { label: 'Fragrances', url: '/products' },
      { label: prod ? prod.name : 'Product Details', active: true }
    ];
  });

  // Displayed Price based on volume selection
  unitPrice = computed<number>(() => {
    const vol = this.selectedVolume();
    if (vol) return vol.price;
    return this.product()?.price ?? 0;
  });

  totalPrice = computed<number>(() => {
    return this.unitPrice() * this.quantity();
  });

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params['id'];
        this.loadProduct(id);
        // Scroll to top on navigation
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }

  private loadProduct(id: string | undefined): void {
    let targetProduct: Product | undefined;
    if (id) {
      targetProduct = this.productService.getProductById(id);
    }

    // Fallback if not found or direct route without id
    if (!targetProduct) {
      targetProduct = this.productService.getProductById('santal-parchment') ?? this.productService.allProducts()[0];
    }

    this.product.set(targetProduct);

    if (targetProduct) {
      // Default selected volume (prefer 100ml or last available size matching screenshot)
      if (targetProduct.volumes && targetProduct.volumes.length > 0) {
        const defaultVol = targetProduct.volumes.find(v => v.size.includes('100')) ?? targetProduct.volumes[targetProduct.volumes.length - 1];
        this.selectedVolume.set(defaultVol);
      } else {
        this.selectedVolume.set({ size: targetProduct.volume || '100 ml', price: targetProduct.price });
      }

      // Load 4 related products for "Olfactory Companions"
      const related = this.productService.getRelatedProducts(targetProduct.id, 4);
      this.relatedProducts.set(related);
    }

    this.quantity.set(1);
    this.giftWrap.set(false);
    this.activeImageIndex.set(0);
    this.isAddedToCart.set(false);
  }

  selectVolume(vol: VolumeOption): void {
    this.selectedVolume.set(vol);
  }

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  toggleGiftWrap(): void {
    this.giftWrap.update((v) => !v);
  }

  selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  onAddToCart(): void {
    if (this.isAddedToCart()) return;

    const prod = this.product();
    if (prod) {
      this.cartService.addToCart({
        ...prod,
        quantity: this.quantity(),
        size: this.selectedVolume()?.size || prod.volume,
        price: this.unitPrice()
      });
    }

    this.isAddedToCart.set(true);
    setTimeout(() => {
      this.isAddedToCart.set(false);
    }, 3000);
  }

  onRelatedAddToCart(prod: Product): void {
    // Action handled by card
  }
}
