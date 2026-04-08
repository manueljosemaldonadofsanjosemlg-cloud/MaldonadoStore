import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { inject as injectCore } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  template: `
    <div class="hero-section fade-in">
      <div class="container hero-content">
        <span class="badge-new">Colección 2026</span>
        <h1 class="hero-title">Estilo que define <br><span>Tu Futuro</span></h1>
        <p class="hero-subtitle">Mochilas, tecnología y moda con envío gratuito a toda Europa.</p>
        <div class="hero-actions">
          <button class="btn-primary" (click)="scrollToCatalog()">Ver Novedades</button>
          <button class="btn-outline" (click)="scrollToCatalog()">Saber más</button>
        </div>
      </div>
      <div class="hero-glow"></div>
    </div>

    <div id="catalog" class="container section-products">
      <div class="section-header">
        <h2>Catálogo Exclusivo</h2>
        <div class="divider"></div>
      </div>

      <app-product-filter 
        [categories]="categories()" 
        [selectedCategory]="selectedCategory()"
        (searchChange)="updateSearch(\$event)"
        (categoryChange)="updateCategory(\$event)"
      />

      <div class="product-grid">
        @if (isLoading()) {
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
          @for (product of filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
          } @empty {
            <div class="empty-state glass fade-in">
              <span class="icon">🔍</span>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda o categorías.</p>
              <button (click)="resetFilters()" class="btn-primary">Limpiar filtros</button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding: 6rem 0;
      overflow: hidden;
      margin-top: -2rem;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 800px;
    }

    .badge-new {
      background: rgba(56, 189, 248, 0.1);
      color: var(--accent-primary);
      padding: 0.5rem 1.2rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 1px solid var(--accent-primary);
      display: inline-block;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 4.5rem;
      line-height: 1.1;
      font-weight: 800;
      margin-bottom: 1.5rem;
    }

    .hero-title span {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 3rem;
    }

    .hero-actions {
      display: flex;
      gap: 1.5rem;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: white;
      padding: 0.8rem 2rem;
      border-radius: 9999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--text-secondary);
    }

    .hero-glow {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 1;
    }

    .section-products {
      padding: 4rem 0;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }

    .divider {
      width: 60px;
      height: 4px;
      background: var(--accent-primary);
      border-radius: 2px;
    }

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
    
    @media (max-width: 768px) {
      .hero-title { font-size: 3rem; }
      .hero-actions { flex-direction: column; }
    }
  `]
})
export class ProductListPageComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  isLoading = signal<boolean>(true);
  
  searchQuery = signal<string>('');
  selectedCategory = signal<string | null>(null);

  filteredProducts = computed(() => {
    let result = this.products();
    if (this.selectedCategory()) {
      if (this.selectedCategory() === 'OFERTAS') {
        result = result.filter(p => p.onSale);
      } else {
        result = result.filter(p => p.category === this.selectedCategory());
      }
    }
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    return result;
  });

  ngOnInit() {
    this.loadInitialData();
    this.route.queryParams.subscribe(params => {
      if (params['filter'] === 'ofertas') {
        this.selectedCategory.set('OFERTAS');
        this.scrollToCatalog();
      }
    });
  }

  loadInitialData() {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe((cats: string[]) => {
      this.categories.set(['OFERTAS', ...cats]);
    });

    this.productService.getProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: Product[]) => this.products.set(data),
        error: (err: any) => console.error('Error fetching products', err)
      });
  }

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  updateCategory(category: string | null) {
    this.selectedCategory.set(category);
  }

  scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
  }
}
