import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <nav class="navbar glass">
      <div class="container nav-content">
        <div class="logo" (click)="scrollToTop()" style="cursor: pointer;">MALDONADO<span>STORE</span></div>
        <div class="nav-links">
          <a (click)="scrollToTop()" style="cursor: pointer;">Inicio</a>
          <a (click)="scrollToCatalog()" style="cursor: pointer;">Colecciones</a>
          <a (click)="filterByOfertas()" style="cursor: pointer;">Ofertas</a>
          <button class="cart-btn" (click)="toggleCart()">
            <span class="icon">🛒</span>
            <span class="badge" [class.animate-pulse]="badgePulse()">{{ cart.count() }}</span>
          </button>
        </div>
      </div>
      @if (isCartOpen()) {
        <div class="cart-dropdown glass fade-in">
          @for (item of cart.items(); track item.id) {
            <div class="cart-item">
              <span class="item-title">{{ item.title | slice:0:20 }}...</span>
              <span class="item-price">{{ item.price }}€</span>
            </div>
          } @empty {
            <p class="empty-msg">El carrito está vacío</p>
          }
          <div class="cart-total">
            <span>Total:</span>
            <strong>{{ cart.total() | number:'1.2-2' }}€</strong>
          </div>
          <div class="cart-actions">
            <button class="btn-primary small" (click)="goToCheckout()">Finalizar Compra</button>
            <button class="btn-outline small" (click)="cart.clearCart()">Limpiar</button>
          </div>
        </div>
      }
    </nav>

    <main>
      <router-outlet />
    </main>

    <footer class="glass">
      <div class="container footer-content">
        <div class="footer-section">
          <div class="logo small">MALDONADO<span>STORE</span></div>
          <p>La mejor selección de productos internacionales a tu alcance.</p>
        </div>
        <div class="footer-section">
          <h4>Contacto</h4>
          <p>info@maldonadostore.com</p>
          <p>+34 900 123 456</p>
        </div>
        <div class="footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 MaldonadoStore. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-height);
      z-index: 1000;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--glass-border);
      border-radius: 0;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .logo span {
      color: var(--accent-primary);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: var(--accent-primary);
    }

    .cart-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      position: relative;
    }

    .badge {
      background: var(--accent-primary);
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
      font-weight: 800;
      color: var(--bg-main);
    }

    .cart-dropdown {
      position: absolute;
      top: calc(var(--nav-height) + 10px);
      right: 2rem;
      width: 300px;
      padding: 1.5rem;
      border-radius: 1.5rem;
      z-index: 1100;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.5rem;
    }

    .item-price { color: var(--accent-primary); font-weight: 600; }

    .cart-total { 
      display: flex; 
      justify-content: space-between; 
      margin-top: 0.5rem;
      font-size: 1rem;
    }

    .empty-msg { text-align: center; color: var(--text-secondary); font-size: 0.9rem; }

    .btn-primary.small { 
      padding: 0.5rem; 
      font-size: 0.8rem;
    }

    .btn-outline.small {
      padding: 0.5rem;
      font-size: 0.8rem;
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      border-radius: 9999px;
      cursor: pointer;
    }

    .cart-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    main {
      padding-top: calc(var(--nav-height) + 2rem);
      min-height: calc(100vh - 200px);
    }

    footer {
      margin-top: 5rem;
      padding: 4rem 0 2rem;
      border-top: 1px solid var(--glass-border);
      border-radius: 0;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-section h4 {
      color: var(--accent-primary);
      margin-bottom: 1rem;
    }

    .footer-section p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid var(--glass-border);
      color: var(--text-secondary);
      font-size: 0.8rem;
    }
  `]
})
export class AppComponent {
  title = 'MaldonadoStore';
  private router = inject(Router);
  protected cart = inject(CartService);
  
  isCartOpen = signal(false);
  badgePulse = signal(false);

  constructor() {
    effect(() => {
      if (this.cart.count() > 0) {
        this.badgePulse.set(true);
        setTimeout(() => this.badgePulse.set(false), 400);
      }
    });
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  filterByOfertas() {
    this.router.navigate([], { queryParams: { filter: 'ofertas' } });
  }

  goToCheckout() {
    this.isCartOpen.set(false);
    this.router.navigate(['/checkout']);
  }
}
