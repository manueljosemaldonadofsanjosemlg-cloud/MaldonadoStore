import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>(this.loadFromStorage('cart'));
  private favoriteItems = signal<Product[]>(this.loadFromStorage('favorites'));

  // Selectores de estado (Signals)
  items = this.cartItems.asReadonly();
  favorites = this.favoriteItems.asReadonly();
  
  count = computed(() => this.cartItems().length);
  favCount = computed(() => this.favoriteItems().length);
  
  total = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.price, 0);
  });

  constructor() {
    // Persistencia automática
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    });
    effect(() => {
      localStorage.setItem('favorites', JSON.stringify(this.favoriteItems()));
    });
  }

  addToCart(product: Product) {
    this.cartItems.update(prev => [...prev, product]);
  }

  toggleFavorite(product: Product) {
    this.favoriteItems.update(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }

  isFavorite(productId: number): boolean {
    return this.favoriteItems().some(p => p.id === productId);
  }

  clearCart() {
    this.cartItems.set([]);
  }

  private loadFromStorage(key: string): Product[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}
