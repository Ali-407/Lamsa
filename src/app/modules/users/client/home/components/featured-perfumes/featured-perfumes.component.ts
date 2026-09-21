import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfumeCardComponent } from '../../../../../../shared/components/perfume-card/perfume-card.component';
import { Perfume } from '../../../../../../core/models/perfume.model';

@Component({
  selector: 'app-featured-perfumes',
  standalone: true,
  imports: [CommonModule, PerfumeCardComponent],
  templateUrl: './featured-perfumes.component.html',
  styleUrl: './featured-perfumes.component.scss'
})
export class FeaturedPerfumesComponent {
  // Angular Signal state holding API-ready dummy product data
  perfumes = signal<Perfume[]>([
    {
      id: 'perfume-1',
      name: 'Fleur de Lune',
      price: 195,
      scentFamily: 'Floral · Clementine & White Musk',
      category: 'Signature Extrait'
    },
    {
      id: 'perfume-2',
      name: 'Santal Parchemin',
      price: 230,
      scentFamily: 'Woody · Raw Sandalwood & Cashmere',
      category: 'Signature Extrait'
    },
    {
      id: 'perfume-3',
      name: 'Sol d\'Or',
      price: 185,
      scentFamily: 'Oriental · Golden Amber & Wild Rose',
      category: 'Eau de Parfum'
    },
    {
      id: 'perfume-4',
      name: 'Velour Oud',
      price: 250,
      scentFamily: 'Woody · Smoked Cedar & Vanilla',
      category: 'Pure Oil'
    }
  ]);
}
