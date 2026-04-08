import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-container glass fade-in">
      <div class="search-box">
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          (input)="onSearch(\$any(\$event.target).value)"
          class="glass"
        >
      </div>
      <div class="categories">
        <button 
          [class.active]="selectedCategory === null"
          (click)="onCategorySelect(null)"
          class="category-btn"
        >
          Todo
        </button>
        @for (category of categories; track category) {
          <button 
            [class.active]="selectedCategory === category"
            (click)="onCategorySelect(category)"
            class="category-btn"
          >
            {{ translateCategory(category) }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--glass-border);
      color: white;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .search-box input:focus {
      border-color: var(--accent-primary);
    }

    .categories {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.5rem 1.25rem;
      border: 1px solid var(--glass-border);
      background: transparent;
      color: var(--text-secondary);
      border-radius: 2rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .category-btn:hover {
      background: rgba(56, 189, 248, 0.1);
      color: var(--accent-primary);
    }

    .category-btn.active {
      background: var(--accent-primary);
      color: var(--bg-dark);
      border-color: var(--accent-primary);
      font-weight: 600;
    }

    @media (min-width: 768px) {
      .filter-container {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .search-box {
        width: 300px;
      }
    }
  `]
})
export class ProductFilterComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string | null = null;
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string | null>();

  onSearch(query: string) {
    this.searchChange.emit(query);
  }

  onCategorySelect(category: string | null) {
    this.categoryChange.emit(category);
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
