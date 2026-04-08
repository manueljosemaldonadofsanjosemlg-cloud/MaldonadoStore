import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading) {
      <div class="feedback-container">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    } @else if (isEmpty) {
      <div class="feedback-container empty fade-in">
        <span class="icon">🔍</span>
        <h3>No se han encontrado resultados</h3>
        <p>Prueba con otros filtros o categorías.</p>
        <button (click)="resetFilters.emit()" class="btn-reset" *ngIf="showReset">
          Limpiar filtros
        </button>
      </div>
    }
  `,
  styles: [`
    .feedback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      gap: 1.5rem;
      text-align: center;
      width: 100%;
      grid-column: 1 / -1;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.1);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .icon { font-size: 3rem; }
    
    h3 { margin: 0; font-size: 1.5rem; }
    p { color: var(--text-secondary); margin: 0; }

    .btn-reset {
      background: var(--accent-primary);
      color: var(--bg-dark);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class FeedbackComponent {
  @Input() isLoading: boolean = false;
  @Input() isEmpty: boolean = false;
  @Input() showReset: boolean = false;
  @Output() resetFilters = new EventEmitter<void>();
}
