import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(p => this.translateProduct(p)))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      map(products => products.map(p => this.translateProduct(p)))
    );
  }

  private translateProduct(product: Product): Product {
    const dictionary: { [key: string]: string } = {
      'Mens': 'Hombre',
      'Womens': 'Mujer',
      'Man': 'Hombre',
      'Woman': 'Mujer',
      'Backpack': 'Mochila',
      'Cotton': 'Algodón',
      'Slim Fit': 'Corte Ajustado',
      'Casual': 'Informal',
      'Gold': 'Oro',
      'Silver': 'Plata',
      'Jacket': 'Chaqueta',
      'Solid': 'Sólido',
      'Shirt': 'Camisa',
      'Hard Drive': 'Disco Duro',
      'Solid State': 'Disco Sólido',
      'Bracelet': 'Brazalete',
      'Jewelry': 'Joyería',
      'Electronics': 'Electrónica',
      'White': 'Blanco',
      'Black': 'Negro',
      'Blue': 'Azul',
      'Red': 'Rojo',
      'Steel': 'Acero',
      'Stainless': 'Inoxidable',
      'Water Resistant': 'Resistente al Agua',
      'Internal': 'Interno',
      'External': 'Externo',
      'Portable': 'Portátil',
      'Great': 'Excelente',
      'Perfect': 'Perfecto',
      'Daily': 'Diario',
      'Lightweight': 'Ligero',
      'Durable': 'Duradero',
      'Made of': 'Hecho de',
      'High quality': 'Alta calidad',
      'Features': 'Características',
      'Design': 'Diseño'
    };

    let translatedTitle = product.title;
    let translatedDesc = product.description;

    // Traducciones manuales de descripciones para los productos principales (IDs 1-4)
    const manualDescriptions: { [key: number]: string } = {
      1: "Tu mochila perfecta para el uso diario y caminatas por el bosque. Guarda tu laptop de hasta 15 pulgadas en la funda acolchada, protegida de golpes.",
      2: "Camisetas de ajuste delgado para hombre, ligeras y con un diseño moderno. Ideales para un look casual y cómodo.",
      3: "Chaqueta de algodón para hombre, perfecta para el otoño y días frescos. Estilo militar con múltiples bolsillos.",
      4: "Camiseta de manga larga Slim Fit para hombre, fabricada con materiales de alta calidad para mayor durabilidad."
    };

    if (manualDescriptions[product.id]) {
      translatedDesc = manualDescriptions[product.id];
    } else {
      Object.keys(dictionary).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translatedTitle = translatedTitle.replace(regex, dictionary[key]);
        translatedDesc = translatedDesc.replace(regex, dictionary[key]);
      });
    }

    const price = Number((product.price * 0.92).toFixed(2));
    const onSale = product.id % 3 === 0; // Marcamos cada tercer producto como oferta
    const originalPrice = onSale ? Number((price * 1.3).toFixed(2)) : undefined;

    return {
      ...product,
      title: translatedTitle,
      description: translatedDesc,
      price: price,
      onSale: onSale,
      originalPrice: originalPrice
    };
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}
