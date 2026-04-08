import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);

  // Selectores de estado (Signals)
  items = this.cartItems.asReadonly();
  
  count = computed(() => this.cartItems().length);
  
  total = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.price, 0);
  });

  addToCart(product: Product) {
    this.cartItems.update(prev => [...prev, product]);
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
