import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FeedbackComponent],
  template: `
    <div class="product-grid">
      @if (isLoading) {
        @for (n of [1,2,3,4,5,6,7,8]; track n) {
          <div class="skeleton-card glass">
            <div class="skele-image"></div>
            <div class="skele-content">
              <div class="skele-title"></div>
              <div class="skele-text"></div>
              <div class="skele-footer"></div>
            </div>
          </div>
        }
      } @else {
        @for (product of products; track product.id) {
          <app-product-card [product]="product" />
        } @empty {
          <app-feedback 
            [isEmpty]="true" 
            [showReset]="true" 
            (resetFilters)="onResetFilters.emit()" 
          />
        }
      }
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2.5rem;
    }

    /* Skeleton Loading */
    .skeleton-card {
      height: 450px;
      overflow: hidden;
      animation: pulse 1.5s infinite ease-in-out;
      border-radius: 1.5rem;
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 0.2; }
      100% { opacity: 0.4; }
    }

    .skele-image { height: 250px; background: rgba(255,255,255,0.05); }
    .skele-content { padding: 2rem; }
    .skele-title { height: 1.5rem; background: rgba(255,255,255,0.05); margin-bottom: 1rem; border-radius: 4px; }
    .skele-text { height: 3rem; background: rgba(255,255,255,0.05); margin-bottom: 1rem; border-radius: 4px; }
    .skele-footer { height: 2rem; background: rgba(255,255,255,0.05); border-radius: 4px; }

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 6rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      border-radius: 2rem;
    }
    .empty-state .icon { font-size: 4rem; }
  `]
})
export class ProductGridComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input() isLoading: boolean = false;
  @Output() onResetFilters = new EventEmitter<void>();
}
