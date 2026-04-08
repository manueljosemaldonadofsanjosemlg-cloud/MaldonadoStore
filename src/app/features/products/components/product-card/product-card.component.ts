import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card glass fade-in" [class.on-sale]="product.onSale">
      <div class="image-wrapper">
        <div class="category-tag">{{ translateCategory(product.category) }}</div>
        @if (product.onSale) {
          <div class="sale-badge">OFERTA</div>
        }
        <img [src]="product.image" [alt]="product.title">
      </div>
      <div class="content">
        <h3 class="title">{{ product.title }}</h3>
        <p class="description">{{ product.description | slice:0:80 }}...</p>
        <div class="footer">
          <div class="price-container">
            @if (product.onSale) {
              <span class="original-price">{{ product.originalPrice }}€</span>
            }
            <span class="currency">€</span>
            <span class="amount">{{ product.price }}</span>
          </div>
          <div class="actions">
            <button 
              class="add-btn" 
              [class.added]="isAdded()"
              [title]="isAdded() ? 'Añadido' : 'Añadir al carrito'" 
              (click)="addToCart()"
            >
              <span class="plus">@if(isAdded()){ ✓ } @else { + }</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 1.5rem;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      border-color: var(--accent-primary);
    }

    .image-wrapper {
      position: relative;
      height: 250px;
      background: white;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .product-card:hover .image-wrapper {
      background: #f8fafc;
    }

    .category-tag {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: var(--bg-main);
      color: var(--accent-primary);
      padding: 0.3rem 0.8rem;
      border-radius: 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      z-index: 2;
      border: 1px solid var(--glass-border);
    }

    .product-card.on-sale {
      border-color: #fca5a5;
    }

    .sale-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #ef4444;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 800;
      z-index: 2;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover img {
      transform: scale(1.1);
    }

    .content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 0.75rem;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }

    .description {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .footer {
      margin-top: auto;
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--glass-border);
    }

    .price-container {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .original-price {
      text-decoration: line-through;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .currency {
      color: var(--accent-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
    }

    .add-btn {
      width: 40px;
      height: 40px;
      border-radius: 0.75rem;
      background: var(--accent-primary);
      border: none;
      color: var(--bg-main);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .add-btn:hover {
      transform: rotate(90deg);
      filter: brightness(1.1);
    }

    .add-btn.added {
      background: #10b981;
      transform: none !important;
    }

    .plus {
      font-size: 1.5rem;
      font-weight: 400;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private cartService = inject(CartService);
  isAdded = signal(false);

  addToCart() {
    this.cartService.addToCart(this.product);
    this.isAdded.set(true);
    setTimeout(() => this.isAdded.set(false), 2000);
  }

  translateCategory(category: string): string {
    const map: { [key: string]: string } = {
      'OFERTAS': 'Ofertas',
      'electronics': 'Electrónica',
      'jewelery': 'Joyería',
      "men's clothing": 'Ropa de Hombre',
      "women's clothing": 'Ropa de Mujer'
    };
    return map[category] || category;
  }
}
