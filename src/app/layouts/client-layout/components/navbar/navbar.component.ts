import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(state => !state);
  }
}
