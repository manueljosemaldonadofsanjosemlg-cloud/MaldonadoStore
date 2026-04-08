import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container checkout-container fade-in">
      @if (!isOrdered()) {
        <div class="checkout-grid">
          <!-- Formulario -->
          <div class="checkout-form glass">
            <h2>Datos de Envío</h2>
            <form (submit)="placeOrder()">
              <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" placeholder="Juan Maldonado" required>
              </div>
              <div class="form-group">
                <label>Dirección</label>
                <input type="text" placeholder="Calle Falsa 123" required>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Ciudad</label>
                  <input type="text" placeholder="Madrid" required>
                </div>
                <div class="form-group">
                  <label>Código Postal</label>
                  <input type="text" placeholder="28001" required>
                </div>
              </div>
              
              <h2 class="mt-2">Pago</h2>
              <div class="form-group">
                <label>Número de Tarjeta (Fake)</label>
                <input type="text" placeholder="xxxx xxxx xxxx xxxx" required>
              </div>
              
              <button type="submit" class="btn-primary w-100 mt-2" [disabled]="cart.count() === 0">
                Confirmar Pago ({{ cart.total() | number:'1.2-2' }}€)
              </button>
            </form>
          </div>

          <!-- Resumen -->
          <div class="checkout-summary glass">
            <h3>Tu Pedido</h3>
            <div class="items-list">
              @for (item of cart.items(); track item.id) {
                <div class="summary-item">
                  <img [src]="item.image" [alt]="item.title">
                  <div class="item-info">
                    <p class="title">{{ item.title | slice:0:30 }}...</p>
                    <p class="price">{{ item.price }}€</p>
                  </div>
                </div>
              }
            </div>
            <div class="total-row">
              <span>Total a pagar</span>
              <strong>{{ cart.total() | number:'1.2-2' }}€</strong>
            </div>
          </div>
        </div>
      } @else {
        <div class="success-state glass fade-in">
          <div class="success-icon">🎉</div>
          <h1>¡Pedido Realizado!</h1>
          <p>Gracias por comprar en MaldonadoStore. Tu pedido llegará en 2-3 días hábiles.</p>
          <button class="btn-primary" (click)="goHome()">Volver a la tienda</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container { padding: 4rem 0; }
    .checkout-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 3rem;
    }
    .checkout-form, .checkout-summary { padding: 2.5rem; border-radius: 2rem; }
    h2 { margin-bottom: 2rem; border-left: 4px solid var(--accent-primary); padding-left: 1rem; }
    
    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    label { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }
    input {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      color: white;
      outline: none;
      transition: border-color 0.3s;
    }
    input:focus { border-color: var(--accent-primary); }
    
    .items-list { margin: 2rem 0; display: flex; flex-direction: column; gap: 1rem; }
    .summary-item { display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
    .summary-item img { width: 50px; height: 50px; object-fit: contain; background: white; border-radius: 0.5rem; padding: 0.2rem; }
    .item-info .title { font-size: 0.9rem; font-weight: 600; }
    .item-info .price { color: var(--accent-primary); font-size: 0.85rem; }
    
    .total-row { display: flex; justify-content: space-between; font-size: 1.2rem; padding-top: 1rem; border-top: 2px solid var(--glass-border); }
    
    .success-state { text-align: center; padding: 6rem; border-radius: 3rem; max-width: 600px; margin: 0 auto; }
    .success-icon { font-size: 5rem; margin-bottom: 2rem; }
    
    .w-100 { width: 100%; }
    .mt-2 { margin-top: 2rem; }

    @media (max-width: 992px) {
      .checkout-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent {
  protected cart = inject(CartService);
  private router = inject(Router);
  
  isOrdered = signal(false);

  placeOrder() {
    this.isOrdered.set(true);
    this.cart.clearCart();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
