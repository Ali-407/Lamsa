import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OccasionCategory {
  id: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-shop-by-occasion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-by-occasion.component.html',
  styleUrl: './shop-by-occasion.component.scss'
})
export class ShopByOccasionComponent {
  occasions = signal<OccasionCategory[]>([
    { id: 'occ-1', title: 'Birthday', subtitle: 'Celebratory Expressions' },
    { id: 'occ-2', title: 'Wedding', subtitle: 'Nuptial & Romantic' },
    { id: 'occ-3', title: 'Gift', subtitle: 'Bespoke Luxury Boxes' },
    { id: 'occ-4', title: 'Personal Use', subtitle: 'Everyday Signature Scents' }
  ]);
}
