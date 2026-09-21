import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScentFamily {
  id: string;
  name: string;
  notes: string;
  description: string;
}

@Component({
  selector: 'app-shop-by-scent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-by-scent.component.html',
  styleUrl: './shop-by-scent.component.scss'
})
export class ShopByScentComponent {
  scentFamilies = signal<ScentFamily[]>([
    {
      id: 'scent-1',
      name: 'Floral',
      notes: 'Jasmine · Bulgarian Rose · Peony',
      description: 'Radiant botanical bouquets brimming with elegance and timeless feminine charm.'
    },
    {
      id: 'scent-2',
      name: 'Woody',
      notes: 'Sandalwood · Cedarwood · Vetiver',
      description: 'Deep, grounding forest accords crafted from aged barks and precious timbers.'
    },
    {
      id: 'scent-3',
      name: 'Oriental',
      notes: 'Golden Amber · Vanilla · Spiced Oud',
      description: 'Warm, opulent elixirs infused with rare resins and seductive spice accords.'
    },
    {
      id: 'scent-4',
      name: 'Fresh',
      notes: 'Bergamot · Sea Salt · White Neroli',
      description: 'Crisp, uplifting compositions inspired by morning dew and Mediterranean breezes.'
    }
  ]);
}
