# Angular API Integration Project - MaldonadoStore

## Objetivo
Este proyecto es una aplicación funcional de Angular que consume la **FakeStoreAPI**. El enfoque principal ha sido la calidad de la arquitectura, la separación de responsabilidades y el uso de las últimas características de Angular (Signals, Control Flow Syntax).

## API Utilizada
- **API**: [FakeStoreAPI](https://fakestoreapi.com/)
- **Endpoints consumidos**:
  - `/products`: Para obtener la lista completa de productos.
  - `/products/categories`: Para obtener las categorías disponibles y filtrar.

## Estructura del Proyecto

### 1. Arquitectura de Servicios
El servicio `ProductService` encapsula toda la lógica de comunicación con la API. Los componentes no tienen conocimiento de las URLs ni de la estructura interna de la API.
- **Ubicación**: `src/app/core/services/product.service.ts`

### 2. Manejo de Tipado
Se ha definido una interfaz robusta `Product` para asegurar que los datos consumidos sean consistentes en toda la aplicación.
- **Ubicación**: `src/app/core/models/product.model.ts`

### 3. Flujo de Datos (In/Out)
La aplicación utiliza un patrón de **Container/Presenter**:
- `ProductListPage`: Actúa como contenedor, gestionando el estado y la comunicación con el servicio.
- `ProductCard`: Recibe datos mediante `@Input`.
- `ProductFilter`: Recibe categorías y emite eventos de búsqueda y filtrado mediante `@Output`.

### 4. UX y Control Flow
Se ha implementado la nueva sintaxis de Angular 17+ para el control de flujo:
- `@if`: Para manejar estados de carga (Skeleton Loaders).
- `@for`: Para iterar sobre los productos.
- `@empty`: Para mostrar un mensaje amigable cuando no hay resultados en la búsqueda.

### 5. Diseño Premium
Se ha utilizado CSS moderno con variables, Glassmorphism y animaciones para proporcionar una experiencia visual de alta calidad.

## Cómo ejecutar el proyecto
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Ejecutar `npm start` o `ng serve`.
4. Abrir `http://localhost:4200` en el navegador.
