# Diseño de Base de Datos — MongoDB
## Sistema de Inventario (Carpintería)

---

## 1. Información General

| Parámetro        | Valor              |
|------------------|--------------------|
| Motor            | MongoDB 7.x        |
| Nombre de la BD  | `inventario`       |
| Puerto           | `27017` (localhost) |
| Backend          | Spring Boot 3.4.3 + Spring Data MongoDB |
| Paquete base     | `com.inventario.backend` |

---

## 2. Colecciones

### 2.1 `users` — Usuarios del sistema

Almacena las cuentas de usuario con su rol y credenciales.

**Documento ejemplo:**
```json
{
  "_id": ObjectId("..."),
  "name": "Carlos Mendez",
  "email": "carlos@carpentry.com",
  "passwordHash": "$2a$10$...",
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2025-02-23T00:00:00Z"),
  "updatedAt": ISODate("2025-02-23T00:00:00Z")
}
```

**Campos:**

| Campo          | Tipo     | Requerido | Notas                                          |
|----------------|----------|-----------|------------------------------------------------|
| `_id`          | ObjectId | ✓         | Generado por MongoDB                           |
| `name`         | String   | ✓         | Nombre completo                                |
| `email`        | String   | ✓         | Único. Usado como username para login          |
| `passwordHash` | String   | ✓         | BCrypt hash. **Nunca se expone al frontend**   |
| `role`         | String   | ✓         | Enum: `admin` \| `warehouse_manager` \| `viewer` |
| `isActive`     | Boolean  | ✓         | `false` = cuenta desactivada (no puede loguearse) |
| `createdAt`    | Date     | ✓         | Fecha de creación                              |
| `updatedAt`    | Date     | ✓         | Última modificación                            |

**Índices:**
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

---

### 2.2 `categories` — Categorías de productos

**Documento ejemplo:**
```json
{
  "_id": ObjectId("..."),
  "name": "Lumber & Boards",
  "description": "Raw wood boards, plywood, MDF panels",
  "color": "#8B5E3C",
  "createdAt": ISODate("2025-02-23T00:00:00Z"),
  "updatedAt": ISODate("2025-02-23T00:00:00Z")
}
```

**Campos:**

| Campo         | Tipo     | Requerido | Notas                                        |
|---------------|----------|-----------|----------------------------------------------|
| `_id`         | ObjectId | ✓         | Generado por MongoDB                         |
| `name`        | String   | ✓         | Único. Ej.: "Lumber & Boards"                |
| `description` | String   | ✓         | Descripción breve de la categoría            |
| `color`       | String   | ✓         | Código hex para la UI. Ej.: `#8B5E3C`        |
| `createdAt`   | Date     | ✓         |                                              |
| `updatedAt`   | Date     | ✓         |                                              |

> **Nota:** `productCount` del modelo TypeScript **no se persiste** en MongoDB.
> Se calcula en tiempo real con una aggregation sobre la colección `products`:
> ```js
> db.products.countDocuments({ categoryId: ObjectId("...") })
> ```

**Índices:**
```js
db.categories.createIndex({ name: 1 }, { unique: true })
```

---

### 2.3 `products` — Productos / Materiales de inventario

Colección central del sistema. Cada documento representa un SKU único.

**Documento ejemplo:**
```json
{
  "_id": ObjectId("..."),
  "name": "Pine Board 2x4x8",
  "description": "Standard pine lumber board, 8 feet",
  "categoryId": ObjectId("..."),
  "sku": "LUM-PIN-248",
  "unit": "piece",
  "currentStock": 120,
  "minimumStock": 30,
  "unitPrice": 5.50,
  "location": "Aisle A-1",
  "imageUrl": null,
  "createdAt": ISODate("2025-02-23T00:00:00Z"),
  "updatedAt": ISODate("2025-02-23T00:00:00Z")
}
```

**Campos:**

| Campo          | Tipo     | Requerido | Notas                                                         |
|----------------|----------|-----------|---------------------------------------------------------------|
| `_id`          | ObjectId | ✓         | Generado por MongoDB                                          |
| `name`         | String   | ✓         | Nombre descriptivo del producto                               |
| `description`  | String   | ✓         |                                                               |
| `categoryId`   | ObjectId | ✓         | Referencia a `categories._id`                                 |
| `sku`          | String   | ✓         | Stock Keeping Unit, único por producto                        |
| `unit`         | String   | ✓         | Enum: `piece` \| `board` \| `kg` \| `liter` \| `meter` \| `box` \| `sheet` |
| `currentStock` | Number   | ✓         | Stock actual (integer). Se actualiza con cada Movement        |
| `minimumStock` | Number   | ✓         | Umbral mínimo. Dispara alertas si `currentStock <= minimumStock` |
| `unitPrice`    | Number   | ✓         | Precio unitario en USD (decimal)                              |
| `location`     | String   | ✓         | Ubicación física en almacén. Ej.: `Aisle A-1`                 |
| `imageUrl`     | String   | ✗         | URL de imagen del producto (opcional)                         |
| `createdAt`    | Date     | ✓         |                                                               |
| `updatedAt`    | Date     | ✓         | Se actualiza automáticamente con cada movimiento              |

**Índices:**
```js
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ name: "text", description: "text" })   // búsqueda full-text
db.products.createIndex({ currentStock: 1, minimumStock: 1 })    // para consultas de stock bajo
```

---

### 2.4 `movements` — Movimientos de stock

Registro inmutable de cada entrada o salida de producto. Es el historial de auditoría del inventario.

**Documento ejemplo:**
```json
{
  "_id": ObjectId("..."),
  "productId": ObjectId("..."),
  "productName": "Pine Board 2x4x8",
  "type": "entry",
  "quantity": 50,
  "reason": "purchase",
  "notes": "Monthly restock from supplier",
  "performedBy": ObjectId("..."),
  "performedByName": "Carlos Mendez",
  "createdAt": ISODate("2025-02-22T09:00:00Z")
}
```

**Campos:**

| Campo             | Tipo     | Requerido | Notas                                                             |
|-------------------|----------|-----------|-------------------------------------------------------------------|
| `_id`             | ObjectId | ✓         | Generado por MongoDB                                              |
| `productId`       | ObjectId | ✓         | Referencia a `products._id`                                       |
| `productName`     | String   | ✓         | **Denormalizado** para consultas rápidas sin JOIN                 |
| `type`            | String   | ✓         | Enum: `entry` \| `exit`                                           |
| `quantity`        | Number   | ✓         | Cantidad movida (siempre positivo, el signo lo da `type`)         |
| `reason`          | String   | ✓         | Enum: `purchase` \| `production` \| `sale` \| `adjustment` \| `return` |
| `notes`           | String   | ✗         | Observaciones del operador                                        |
| `performedBy`     | ObjectId | ✓         | Referencia a `users._id`                                          |
| `performedByName` | String   | ✓         | **Denormalizado** para historial legible                          |
| `createdAt`       | Date     | ✓         | Timestamp del movimiento. **No tiene `updatedAt`** (inmutable)    |

> **Regla de negocio:** Al insertar un Movement, el backend debe actualizar atómicamente
> `products.currentStock` usando `$inc`:
> ```js
> // entry
> db.products.updateOne({ _id: productId }, { $inc: { currentStock: +quantity }, $set: { updatedAt: new Date() } })
> // exit
> db.products.updateOne({ _id: productId }, { $inc: { currentStock: -quantity }, $set: { updatedAt: new Date() } })
> ```

**Índices:**
```js
db.movements.createIndex({ productId: 1, createdAt: -1 })   // historial por producto
db.movements.createIndex({ createdAt: -1 })                 // listado general reciente
db.movements.createIndex({ type: 1 })
db.movements.createIndex({ performedBy: 1 })
```

---

### 2.5 `stock_alerts` — Alertas de stock bajo

Colección persistida y actualizada por un **job programado** (Spring `@Scheduled`) que se ejecuta
periódicamente (ej. cada hora o tras cada movimiento). También puede generarse on-demand.

**Documento ejemplo:**
```json
{
  "_id": ObjectId("..."),
  "productId": ObjectId("..."),
  "productName": "Maple Hardwood 1x6x8",
  "currentStock": 3,
  "minimumStock": 12,
  "severity": "critical",
  "acknowledged": false,
  "acknowledgedBy": null,
  "acknowledgedAt": null,
  "createdAt": ISODate("2025-02-23T00:00:00Z"),
  "updatedAt": ISODate("2025-02-23T00:00:00Z")
}
```

**Campos:**

| Campo            | Tipo     | Requerido | Notas                                                      |
|------------------|----------|-----------|------------------------------------------------------------|
| `_id`            | ObjectId | ✓         |                                                            |
| `productId`      | ObjectId | ✓         | Referencia a `products._id`. **Único** (una alerta por producto) |
| `productName`    | String   | ✓         | Denormalizado                                              |
| `currentStock`   | Number   | ✓         | Snapshot del stock al momento de generar la alerta         |
| `minimumStock`   | Number   | ✓         | Snapshot del umbral mínimo                                 |
| `severity`       | String   | ✓         | Enum: `critical` (stock = 0) \| `warning` (stock > 0 pero ≤ minimumStock) |
| `acknowledged`   | Boolean  | ✓         | `false` por defecto. `true` = revisada por un operador     |
| `acknowledgedBy` | ObjectId | ✗         | Referencia a `users._id` que la confirmó                   |
| `acknowledgedAt` | Date     | ✗         | Timestamp del acknowledge                                  |
| `createdAt`      | Date     | ✓         |                                                            |
| `updatedAt`      | Date     | ✓         |                                                            |

> **Lógica de severidad:**
> - `severity = "critical"` → `currentStock === 0`
> - `severity = "warning"` → `currentStock > 0 && currentStock <= minimumStock`

**Índices:**
```js
db.stock_alerts.createIndex({ productId: 1 }, { unique: true })
db.stock_alerts.createIndex({ acknowledged: 1 })
db.stock_alerts.createIndex({ severity: 1 })
```

---

## 3. Diagrama de Relaciones

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│  categories │       │   products   │       │    users     │
│─────────────│       │──────────────│       │──────────────│
│ _id   (PK)  │◄──────│ categoryId   │       │ _id   (PK)   │
│ name        │  1:N  │ _id    (PK)  │       │ name         │
│ description │       │ name         │       │ email        │
│ color       │       │ sku          │       │ passwordHash │
└─────────────┘       │ currentStock │       │ role         │
                      │ minimumStock │       │ isActive     │
                      └──────┬───────┘       └──────┬───────┘
                             │ 1:N                  │
                    ┌────────▼──────────────────────▼────────┐
                    │              movements                  │
                    │────────────────────────────────────────│
                    │ _id            (PK)                     │
                    │ productId      (FK → products)          │
                    │ productName    (denorm.)                │
                    │ performedBy    (FK → users)             │
                    │ performedByName (denorm.)               │
                    │ type, quantity, reason, notes           │
                    └─────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  stock_alerts   │
                    │─────────────────│
                    │ _id       (PK)  │
                    │ productId (FK)  │  ← unique, una por producto
                    │ severity        │
                    │ acknowledged    │
                    └─────────────────┘
```

---

## 4. Estrategia de Referencias vs. Embebido

| Relación                      | Estrategia    | Justificación                                               |
|-------------------------------|---------------|-------------------------------------------------------------|
| `products` → `categories`     | Referencia    | Categorías se actualizan independientemente                 |
| `movements` → `products`      | Referencia + denorm. de `name` | Historial inmutable; necesita nombre legible  |
| `movements` → `users`         | Referencia + denorm. de `name` | Historial inmutable; necesita nombre legible  |
| `stock_alerts` → `products`   | Referencia    | Las alertas se regeneran cuando cambia el stock             |

---

## 5. Mapping con Spring Boot (Spring Data MongoDB)

Las entidades Java usarán `@Document`, `@Id`, y `@Field` de Spring Data MongoDB:

```java
// Ejemplo: Product.java
@Document(collection = "products")
public class Product {
    @Id
    private String id;               // mapeado desde _id (ObjectId → String)

    private String name;
    private String description;

    @Field("categoryId")
    private String categoryId;       // se guarda como ObjectId en Mongo

    private String sku;
    private String unit;
    private int currentStock;
    private int minimumStock;
    private double unitPrice;
    private String location;
    private String imageUrl;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

> Habilitar auditoría automática en `AppConfig.java`:
> ```java
> @Configuration
> @EnableMongoAuditing
> public class AppConfig { }
> ```

---

## 6. Configuración de Conexión (Spring Boot)

```yaml
# backend/src/main/resources/application.properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=inventario
```

O con URI completa:
```yaml
spring.data.mongodb.uri=mongodb://localhost:27017/inventario
```

---

## 7. Script de Inicialización (Mongosh)

```js
// Ejecutar en mongosh para crear la BD e índices
use inventario

// users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// categories
db.categories.createIndex({ name: 1 }, { unique: true })

// products
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ currentStock: 1, minimumStock: 1 })

// movements
db.movements.createIndex({ productId: 1, createdAt: -1 })
db.movements.createIndex({ createdAt: -1 })
db.movements.createIndex({ type: 1 })
db.movements.createIndex({ performedBy: 1 })

// stock_alerts
db.stock_alerts.createIndex({ productId: 1 }, { unique: true })
db.stock_alerts.createIndex({ acknowledged: 1 })
db.stock_alerts.createIndex({ severity: 1 })

print("Índices creados correctamente en BD 'inventario'")
```

---

## 8. Resumen de Colecciones

| Colección      | Documentos estimados | Crecimiento        | Notas                                |
|----------------|---------------------|--------------------|--------------------------------------|
| `users`        | ~20–100             | Muy bajo           | Usuarios internos del sistema        |
| `categories`   | ~10–30              | Muy bajo           | Datos maestros estables              |
| `products`     | ~100–1000           | Bajo               | SKUs únicos del inventario           |
| `movements`    | Ilimitado           | Alto (diario)      | Histórico; candidato a archivado TTL |
| `stock_alerts` | ≤ nº de products    | Variable           | Una por producto activo en alerta    |

> **Archivado de movements:** Considerar TTL index o colección de archivo para movimientos
> mayores a 2 años:
> ```js
> db.movements.createIndex({ createdAt: 1 }, { expireAfterSeconds: 63072000 }) // 2 años
> ```

---

---

# Guía de Integración Frontend — Angular 20
## Cómo consumir la API REST del backend

> **Base URL:** `http://localhost:8080/api`
> **Autenticación:** Bearer JWT en header `Authorization`
> **Formato:** JSON en todos los endpoints
> **Respuesta estándar:**
> ```json
> { "success": true, "message": "OK", "data": { ... } }
> ```

---

## 9. Configuración base en Angular

### 9.1 `environment.ts`

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 9.2 Proveer `HttpClient` en `app.config.ts`

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

### 9.3 Interceptor JWT — `auth.interceptor.ts`

El interceptor lee el token del `localStorage` y lo agrega automáticamente
a cada petición saliente.

```typescript
// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};
```

### 9.4 Modelos TypeScript — alineados con los DTOs del backend

```typescript
// src/app/core/models/auth.model.ts
export interface LoginRequest  { email: string; password: string; }
export interface AuthResponse  { token: string; expiresIn: number; user: User; }

// src/app/core/models/user.model.ts
export type Role = 'admin' | 'warehouse_manager' | 'viewer';
export interface User {
  id: string; name: string; email: string;
  role: Role; isActive: boolean;
  createdAt: string; updatedAt: string;
}

// src/app/core/models/category.model.ts
export interface Category {
  id: string; name: string; description: string; color: string;
  productCount: number; createdAt: string; updatedAt: string;
}

// src/app/core/models/product.model.ts
export type Unit = 'piece' | 'board' | 'kg' | 'liter' | 'meter' | 'box' | 'sheet';
export interface Product {
  id: string; name: string; description: string;
  categoryId: string; categoryName: string;
  sku: string; unit: Unit;
  currentStock: number; minimumStock: number; unitPrice: number;
  location: string; imageUrl?: string;
  createdAt: string; updatedAt: string;
}

// src/app/core/models/movement.model.ts
export type MovementType   = 'entry' | 'exit';
export type MovementReason = 'purchase' | 'production' | 'sale' | 'adjustment' | 'return';
export interface Movement {
  id: string; productId: string; productName: string;
  type: MovementType; quantity: number; reason: MovementReason;
  notes?: string; performedBy: string; performedByName: string;
  createdAt: string;
}

// src/app/core/models/alert.model.ts
export type AlertSeverity = 'critical' | 'warning';
export interface StockAlert {
  id: string; productId: string; productName: string;
  currentStock: number; minimumStock: number;
  severity: AlertSeverity; acknowledged: boolean;
  acknowledgedBy?: string; acknowledgedAt?: string;
  createdAt: string; updatedAt: string;
}

// src/app/core/models/dashboard.model.ts
export interface DashboardStats {
  totalProducts: number; totalCategories: number; totalUsers: number;
  lowStockCount: number; criticalStockCount: number;
  totalMovementsToday: number; totalEntriesToday: number; totalExitsToday: number;
  pendingAlertsCount: number;
}

// src/app/core/models/api.model.ts
export interface ApiResponse<T>  { success: boolean; message: string; data: T; }
export interface PagedResponse<T> {
  content: T[]; page: number; size: number;
  totalElements: number; totalPages: number; last: boolean;
}
```

---

## 10. Auth — `/api/auth`

### 10.1 `AuthService`

```typescript
// src/app/core/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  // POST /api/auth/login
  // Body: { email: string, password: string }
  // Response: ApiResponse<AuthResponse>
  // Acción: guarda el token en localStorage y redirige al dashboard
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.url}/login`, { email, password })
      .pipe(
        map(res => res.data),
        tap(auth => {
          localStorage.setItem('token', auth.token);
          localStorage.setItem('user', JSON.stringify(auth.user));
        })
      );
  }

  // GET /api/auth/me
  // Header: Authorization: Bearer <token>
  // Response: ApiResponse<User>
  getMe(): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.url}/me`)
      .pipe(map(res => res.data));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null        { return localStorage.getItem('token'); }
  getCurrentUser(): User | null    {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  isLoggedIn(): boolean            { return !!this.getToken(); }
  hasRole(role: Role): boolean     { return this.getCurrentUser()?.role === role; }
}
```

**Flujo de login:**
1. Componente llama `authService.login(email, password)`
2. Servicio guarda `token` y `user` en `localStorage`
3. Redirigir con `router.navigate(['/dashboard'])`
4. El interceptor añade el token en todas las peticiones siguientes

**Errores comunes:**
| Código | Causa | Mensaje del backend |
|--------|-------|---------------------|
| 400 | Credenciales incorrectas | `"Credenciales inválidas"` |
| 400 | Cuenta desactivada | `"Cuenta desactivada. Contacta al administrador."` |
| 400 | Validación fallida | `"El email no tiene un formato válido"` |

---

## 11. Usuarios — `/api/users`

> Solo accesible con rol `admin`. El interceptor envía el token automáticamente.

```typescript
// src/app/core/services/user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly url = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  // GET /api/users?page=0&size=10&sort=createdAt,desc
  // Response: ApiResponse<Page<User>>  (Spring Page object)
  // Usar: tabla paginada de usuarios
  getAll(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page).set('size', size).set('sort', 'createdAt,desc');
    return this.http
      .get<ApiResponse<any>>(`${this.url}`, { params })
      .pipe(map(res => res.data));
  }

  // GET /api/users/:id
  // Response: ApiResponse<User>
  getById(id: string): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  // POST /api/users
  // Body: { name, email, password, role }
  // Response: ApiResponse<User>  — 201 Created
  create(data: { name: string; email: string; password: string; role: Role }): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.url, data)
      .pipe(map(res => res.data));
  }

  // PUT /api/users/:id
  // Body: { name, email, password? (omitir si no cambia), role }
  // Response: ApiResponse<User>
  update(id: string, data: { name: string; email: string; password?: string; role: Role }): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.url}/${id}`, data)
      .pipe(map(res => res.data));
  }

  // PATCH /api/users/:id/toggle-active
  // Sin body
  // Response: ApiResponse<User>  — activa o desactiva la cuenta
  toggleActive(id: string): Observable<User> {
    return this.http
      .patch<ApiResponse<User>>(`${this.url}/${id}/toggle-active`, {})
      .pipe(map(res => res.data));
  }

  // DELETE /api/users/:id
  // Sin body
  // Response: ApiResponse<null>
  // IMPORTANTE: el backend impide que un admin se elimine a sí mismo
  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/${id}`)
      .pipe(map(() => void 0));
  }
}
```

**Notas importantes:**
- En `update()`, si el campo `password` es `undefined` o cadena vacía, el backend **no cambia la contraseña**.
- `toggleActive` no necesita body — simplemente invierte el estado actual.
- Si intentas eliminar tu propio usuario → 400 `"No puedes eliminar tu propio usuario"`.

---

## 12. Categorías — `/api/categories`

```typescript
// src/app/core/services/category.service.ts
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = `${environment.apiUrl}/categories`;
  private http = inject(HttpClient);

  // GET /api/categories
  // Response: ApiResponse<Category[]>
  // Incluye productCount calculado en tiempo real
  getAll(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<Category[]>>(this.url)
      .pipe(map(res => res.data));
  }

  // GET /api/categories/:id
  // Response: ApiResponse<Category>
  getById(id: string): Observable<Category> {
    return this.http
      .get<ApiResponse<Category>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  // POST /api/categories  [solo admin]
  // Body: { name: string, description: string, color: string }
  // color debe ser hex válido: "#8B5E3C"
  // Response: ApiResponse<Category>  — 201 Created
  create(data: { name: string; description: string; color: string }): Observable<Category> {
    return this.http
      .post<ApiResponse<Category>>(this.url, data)
      .pipe(map(res => res.data));
  }

  // PUT /api/categories/:id  [solo admin]
  // Body: igual que create
  update(id: string, data: { name: string; description: string; color: string }): Observable<Category> {
    return this.http
      .put<ApiResponse<Category>>(`${this.url}/${id}`, data)
      .pipe(map(res => res.data));
  }

  // DELETE /api/categories/:id  [solo admin]
  // IMPORTANTE: falla con 400 si la categoría tiene productos asociados
  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/${id}`)
      .pipe(map(() => void 0));
  }
}
```

**Errores comunes:**
| Código | Causa |
|--------|-------|
| 409 | Nombre de categoría duplicado |
| 400 | Intentar eliminar categoría con productos |
| 400 | Color no tiene formato hex `#RRGGBB` |

---

## 13. Productos — `/api/products`

```typescript
// src/app/core/services/product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = `${environment.apiUrl}/products`;
  private http = inject(HttpClient);

  // GET /api/products?search=pine&categoryId=abc123&page=0&size=10&sort=createdAt,desc
  // Todos los parámetros son opcionales
  // Response: ApiResponse<PagedResponse<Product>>
  getAll(filters: {
    search?: string;
    categoryId?: string;
    page?: number;
    size?: number;
  } = {}): Observable<PagedResponse<Product>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10)
      .set('sort', 'createdAt,desc');

    if (filters.search)     params = params.set('search', filters.search);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);

    return this.http
      .get<ApiResponse<PagedResponse<Product>>>(this.url, { params })
      .pipe(map(res => res.data));
  }

  // GET /api/products/low-stock
  // Response: ApiResponse<Product[]>
  // Devuelve todos los productos con currentStock <= minimumStock
  getLowStock(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.url}/low-stock`)
      .pipe(map(res => res.data));
  }

  // GET /api/products/:id
  // Response: ApiResponse<Product>
  // Incluye categoryName denormalizado
  getById(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  // POST /api/products  [admin o warehouse_manager]
  // Body: { name, description, categoryId, sku, unit, currentStock,
  //         minimumStock, unitPrice, location, imageUrl? }
  // Response: ApiResponse<Product>  — 201 Created
  create(data: Omit<Product, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.url, data)
      .pipe(map(res => res.data));
  }

  // PUT /api/products/:id  [admin o warehouse_manager]
  // Body: igual que create (incluye currentStock para ajuste directo)
  update(id: string, data: Omit<Product, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.url}/${id}`, data)
      .pipe(map(res => res.data));
  }

  // DELETE /api/products/:id  [solo admin]
  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/${id}`)
      .pipe(map(() => void 0));
  }
}
```

**Paginación — cómo leer la respuesta:**
```typescript
// En el componente:
products = signal<Product[]>([]);
totalPages = signal(0);
currentPage = signal(0);

loadProducts() {
  this.productService.getAll({ page: this.currentPage(), size: 10 })
    .subscribe(paged => {
      this.products.set(paged.content);       // array de productos
      this.totalPages.set(paged.totalPages);  // total de páginas
    });
}
```

**Valores válidos para `unit`:**
`"piece"` · `"board"` · `"kg"` · `"liter"` · `"meter"` · `"box"` · `"sheet"`

---

## 14. Movimientos — `/api/movements`

> Los movimientos son **inmutables** — no hay PUT ni DELETE.

```typescript
// src/app/core/services/movement.service.ts
@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly url = `${environment.apiUrl}/movements`;
  private http = inject(HttpClient);

  // GET /api/movements?type=entry&from=2026-01-01T00:00:00&to=2026-12-31T23:59:59&page=0&size=10
  // Todos los filtros son opcionales
  // Fechas en formato ISO 8601: "2026-02-23T00:00:00"
  getAll(filters: {
    type?: 'entry' | 'exit';
    from?: string;
    to?: string;
    page?: number;
    size?: number;
  } = {}): Observable<PagedResponse<Movement>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10)
      .set('sort', 'createdAt,desc');

    if (filters.type) params = params.set('type', filters.type);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to)   params = params.set('to',   filters.to);

    return this.http
      .get<ApiResponse<PagedResponse<Movement>>>(this.url, { params })
      .pipe(map(res => res.data));
  }

  // GET /api/movements/:id
  getById(id: string): Observable<Movement> {
    return this.http
      .get<ApiResponse<Movement>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  // GET /api/movements/product/:productId?page=0&size=10
  // Historial completo de un producto específico
  getByProduct(productId: string, page = 0, size = 10): Observable<PagedResponse<Movement>> {
    const params = new HttpParams()
      .set('page', page).set('size', size).set('sort', 'createdAt,desc');
    return this.http
      .get<ApiResponse<PagedResponse<Movement>>>(`${this.url}/product/${productId}`, { params })
      .pipe(map(res => res.data));
  }

  // POST /api/movements  [admin o warehouse_manager]
  // Body: { productId, type, quantity, reason, notes? }
  // Al registrar el movimiento, el backend:
  //   1. Valida stock suficiente (en salidas)
  //   2. Actualiza currentStock del producto atómicamente
  //   3. Actualiza/crea alerta de stock si corresponde
  // Response: ApiResponse<Movement>  — 201 Created
  create(data: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: MovementReason;
    notes?: string;
  }): Observable<Movement> {
    return this.http
      .post<ApiResponse<Movement>>(this.url, data)
      .pipe(map(res => res.data));
  }
}
```

**Valores válidos para `reason`:**
- En entradas (`entry`): `"purchase"` · `"return"` · `"adjustment"`
- En salidas (`exit`): `"sale"` · `"production"` · `"adjustment"`

**Error clave — stock insuficiente:**
```json
{ "success": false, "message": "Stock insuficiente. Stock actual: 5, cantidad solicitada: 10" }
```
Código HTTP: `400`. Mostrar este mensaje directamente en la UI.

---

## 15. Alertas de Stock — `/api/alerts`

```typescript
// src/app/core/services/alert.service.ts
@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly url = `${environment.apiUrl}/alerts`;
  private http = inject(HttpClient);

  // GET /api/alerts?acknowledged=false&severity=critical
  // Ambos filtros son opcionales — omitir para obtener todas las alertas
  // acknowledged: true | false
  // severity: "critical" | "warning"
  getAll(filters: { acknowledged?: boolean; severity?: AlertSeverity } = {}): Observable<StockAlert[]> {
    let params = new HttpParams();
    if (filters.acknowledged !== undefined)
      params = params.set('acknowledged', filters.acknowledged);
    if (filters.severity)
      params = params.set('severity', filters.severity);

    return this.http
      .get<ApiResponse<StockAlert[]>>(this.url, { params })
      .pipe(map(res => res.data));
  }

  // PATCH /api/alerts/:id/acknowledge  [admin o warehouse_manager]
  // Sin body — marca la alerta como revisada por el usuario autenticado
  // Response: ApiResponse<StockAlert>
  acknowledge(id: string): Observable<StockAlert> {
    return this.http
      .patch<ApiResponse<StockAlert>>(`${this.url}/${id}/acknowledge`, {})
      .pipe(map(res => res.data));
  }

  // POST /api/alerts/generate  [solo admin]
  // Sin body — regenera todas las alertas de stock manualmente
  // Normalmente el scheduler lo hace cada hora automáticamente
  generateAlerts(): Observable<void> {
    return this.http
      .post<ApiResponse<null>>(`${this.url}/generate`, {})
      .pipe(map(() => void 0));
  }
}
```

**Lógica de severidad (para mostrar colores en la UI):**
| severity | Condición | Color sugerido |
|----------|-----------|---------------|
| `"critical"` | `currentStock === 0` | Rojo `#DC2626` |
| `"warning"` | `currentStock > 0 && currentStock <= minimumStock` | Amarillo `#D97706` |

---

## 16. Dashboard — `/api/dashboard`

```typescript
// src/app/core/services/dashboard.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly url = `${environment.apiUrl}/dashboard`;
  private http = inject(HttpClient);

  // GET /api/dashboard/stats
  // Response: ApiResponse<DashboardStats>
  // Datos calculados en tiempo real — llamar al cargar el componente dashboard
  getStats(): Observable<DashboardStats> {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${this.url}/stats`)
      .pipe(map(res => res.data));
  }
}
```

**Usar en el componente:**
```typescript
export default class DashboardComponent {
  private dashboardService = inject(DashboardService);
  stats = signal<DashboardStats | null>(null);

  ngOnInit() {
    this.dashboardService.getStats().subscribe(s => this.stats.set(s));
  }
}
```

---

## 17. Manejo global de errores HTTP

Agregar un segundo interceptor para manejar errores de forma centralizada:

```typescript
// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token expirado o inválido — redirigir al login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.navigate(['/auth/login']);
          break;
        case 403:
          // Sin permisos — mostrar mensaje
          console.warn('Acceso denegado');
          break;
        case 0:
          // Sin conexión / backend caído
          console.error('No se puede conectar con el servidor');
          break;
      }

      // Extraer el mensaje del backend para mostrarlo en la UI
      const message = error.error?.message ?? 'Error inesperado';
      return throwError(() => ({ status: error.status, message }));
    })
  );
};
```

Registrar en `app.config.ts`:
```typescript
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
```

---

## 18. Guards de ruta

```typescript
// src/app/core/guards/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    inject(Router).navigate(['/auth/login']);
    return false;
  }
  return true;
};

// src/app/core/guards/role.guard.ts
export const roleGuard = (allowedRoles: Role[]): CanActivateFn => () => {
  const user: User | null = JSON.parse(localStorage.getItem('user') ?? 'null');
  if (!user || !allowedRoles.includes(user.role)) {
    inject(Router).navigate(['/dashboard']); // redirigir sin acceso
    return false;
  }
  return true;
};
```

**Uso en rutas:**
```typescript
// src/app/app.routes.ts
{
  path: 'users',
  canActivate: [authGuard, roleGuard(['admin'])],
  loadComponent: () => import('./features/users/user-list')
}
```

---

## 19. Tabla resumen de endpoints

| Método | Endpoint | Servicio Angular | Rol mínimo |
|--------|----------|-----------------|-----------|
| POST | `/auth/login` | `AuthService.login()` | público |
| GET | `/auth/me` | `AuthService.getMe()` | autenticado |
| GET | `/users` | `UserService.getAll()` | admin |
| GET | `/users/:id` | `UserService.getById()` | admin |
| POST | `/users` | `UserService.create()` | admin |
| PUT | `/users/:id` | `UserService.update()` | admin |
| PATCH | `/users/:id/toggle-active` | `UserService.toggleActive()` | admin |
| DELETE | `/users/:id` | `UserService.delete()` | admin |
| GET | `/categories` | `CategoryService.getAll()` | autenticado |
| GET | `/categories/:id` | `CategoryService.getById()` | autenticado |
| POST | `/categories` | `CategoryService.create()` | admin |
| PUT | `/categories/:id` | `CategoryService.update()` | admin |
| DELETE | `/categories/:id` | `CategoryService.delete()` | admin |
| GET | `/products` | `ProductService.getAll()` | autenticado |
| GET | `/products/low-stock` | `ProductService.getLowStock()` | autenticado |
| GET | `/products/:id` | `ProductService.getById()` | autenticado |
| POST | `/products` | `ProductService.create()` | admin/warehouse |
| PUT | `/products/:id` | `ProductService.update()` | admin/warehouse |
| DELETE | `/products/:id` | `ProductService.delete()` | admin |
| GET | `/movements` | `MovementService.getAll()` | autenticado |
| GET | `/movements/:id` | `MovementService.getById()` | autenticado |
| GET | `/movements/product/:id` | `MovementService.getByProduct()` | autenticado |
| POST | `/movements` | `MovementService.create()` | admin/warehouse |
| GET | `/alerts` | `AlertService.getAll()` | autenticado |
| PATCH | `/alerts/:id/acknowledge` | `AlertService.acknowledge()` | admin/warehouse |
| POST | `/alerts/generate` | `AlertService.generateAlerts()` | admin |
| GET | `/dashboard/stats` | `DashboardService.getStats()` | autenticado |

---

## 20. Códigos HTTP de referencia

| Código | Cuándo ocurre | Acción en el frontend |
|--------|--------------|----------------------|
| 200 | Operación exitosa | Usar `res.data` normalmente |
| 201 | Recurso creado | Mostrar confirmación, actualizar lista |
| 400 | Validación o regla de negocio | Mostrar `res.message` al usuario |
| 401 | Sin token o token expirado | Redirigir a `/auth/login` |
| 403 | Sin permisos suficientes | Mostrar "Sin permisos" |
| 404 | Recurso no encontrado | Mostrar "No encontrado" |
| 409 | Valor duplicado (email, SKU, nombre) | Mostrar `res.message` en el campo |
| 500 | Error interno del servidor | Mostrar mensaje genérico de error |
