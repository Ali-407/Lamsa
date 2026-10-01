import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../../modules/users/client/cart/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);
  cartService = inject(CartService);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(state => !state);
  }
}
