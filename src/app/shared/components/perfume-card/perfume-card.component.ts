import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfume } from '../../../core/models/perfume.model';

@Component({
  selector: 'app-perfume-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfume-card.component.html',
  styleUrl: './perfume-card.component.scss'
})
export class PerfumeCardComponent {
  @Input() perfume?: Perfume;
}
