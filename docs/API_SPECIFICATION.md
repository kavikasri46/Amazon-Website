# Aventra Marketplace — API Specification

## 1. Protocol & RESTful Conventions

- **Base URL:** `/api/v1`
- **Transport:** HTTPS with strict TLS in production; HTTP in local development.
- **Content-Type:** `application/json` for standard requests; `multipart/form-data` for file uploads.
- **Authentication:** Bearer token transmitted in `Authorization: Bearer <accessToken>` header.
- **Cookie Security:** Refresh tokens transmitted via secure, `httpOnly`, `SameSite=Strict` cookies.
- **Monetary Convention:** All prices, discounts, taxes, and shipping fees are formatted as integers in minor units (e.g. `79900` = ₹799.00 or $799.00) to eliminate IEEE 754 floating-point inaccuracies.

---

## 2. Standard Response Envelopes

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2.2 Standard Error Envelope
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted payload contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address format"
      }
    ]
  }
}
```

---

## 3. Complete Endpoint Catalog

### 3.1 System Health & Diagnostics

#### `GET /api/v1/health`
Liveness probe indicating the HTTP process is running.
- **Auth:** Public
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "status": "UP",
      "timestamp": "2026-10-22T13:00:00.000Z",
      "uptime": 128.4
    }
  }
  ```

#### `GET /api/v1/ready`
Readiness probe confirming database and dependency connectivity.
- **Auth:** Public
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "database": "CONNECTED",
      "services": "HEALTHY"
    }
  }
  ```

---

### 3.2 Authentication & Profile (`/api/v1/auth`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new customer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user, return access token & set refresh cookie |
| `POST` | `/api/v1/auth/refresh` | Public (Cookie) | Issue new access token using refresh token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate refresh token cookie and session |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile and roles |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password-reset email token |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password using short-lived single-use token |

#### Register Payload (`POST /api/v1/auth/register`):
```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "password": "SecurePassword#2026",
  "phone": "+919876543210"
}
```

---

### 3.3 Addresses (`/api/v1/addresses`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/addresses` | Authenticated | List all saved addresses for user |
| `POST` | `/api/v1/addresses` | Authenticated | Create a new delivery address |
| `PUT` | `/api/v1/addresses/:id` | Authenticated | Update an existing address |
| `DELETE` | `/api/v1/addresses/:id` | Authenticated | Delete an address |
| `PATCH` | `/api/v1/addresses/:id/default`| Authenticated | Mark address as default shipping or billing |

---

### 3.4 Categories & Brands (`/api/v1/categories`, `/api/v1/brands`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | Get category tree taxonomy |
| `GET` | `/api/v1/categories/:slug`| Public | Get category details and subcategories |
| `GET` | `/api/v1/brands` | Public | List active product brands |

---

### 3.5 Product Catalogue (`/api/v1/products`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Public | Filtered, sorted, paginated product list |
| `GET` | `/api/v1/products/:slugOrId`| Public | Full product detail with variants and stock |
| `GET` | `/api/v1/products/featured` | Public | Top deals and featured promotional products |
| `GET` | `/api/v1/products/deals` | Public | Deal-of-the-day and discounted inventory |

#### Query Parameters (`GET /api/v1/products`):
- `category`: Category slug or ObjectId
- `brand`: Brand slug or ObjectId
- `minPrice`, `maxPrice`: Price range in minor units
- `rating`: Minimum star rating (e.g. `4`)
- `inStock`: `true` | `false`
- `sort`: `relevance` | `price_asc` | `price_desc` | `rating_desc` | `newest`
- `page`: Page index (default: `1`)
- `limit`: Items per page (default: `24`, max: `48`)

---

### 3.6 Search & Discovery (`/api/v1/search`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/search` | Public | Full-text keyword search across catalogue |
| `GET` | `/api/v1/search/autocomplete`| Public | Debounced suggestions for header search bar |

---

### 3.7 Shopping Cart (`/api/v1/cart`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/cart` | Auth / Guest | Retrieve cart contents with current prices |
| `POST` | `/api/v1/cart/items` | Auth / Guest | Add SKU item to cart with quantity validation |
| `PUT` | `/api/v1/cart/items/:sku` | Auth / Guest | Update item quantity in cart |
| `DELETE` | `/api/v1/cart/items/:sku` | Auth / Guest | Remove single item from cart |
| `DELETE` | `/api/v1/cart` | Auth / Guest | Clear all items in cart |
| `POST` | `/api/v1/cart/merge` | Authenticated | Merge anonymous guest cart into user cart |

#### Cart Response Payload (`GET /api/v1/cart`):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "651f8a...",
        "sku": "IPH15-BLK-128",
        "title": "Smartphone Aventra Pro 15",
        "selectedVariant": "Black / 128 GB",
        "thumbnail": "https://img.cdn/iphone.jpg",
        "unitPrice": 7990000,
        "quantity": 1,
        "maxAvailableStock": 14,
        "lineTotal": 7990000,
        "isAvailable": true
      }
    ],
    "itemCount": 1,
    "subtotal": 7990000,
    "estimatedTax": 1438200,
    "estimatedShipping": 0,
    "estimatedTotal": 9428200
  }
}
```

---

### 3.8 Wishlist (`/api/v1/wishlist`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/wishlist` | Authenticated | Get all saved wishlist items |
| `POST` | `/api/v1/wishlist/items` | Authenticated | Add product to customer wishlist |
| `DELETE` | `/api/v1/wishlist/items/:id` | Authenticated | Remove product from wishlist |
| `POST` | `/api/v1/wishlist/move-to-cart`| Authenticated | Transfer item from wishlist into active cart |

---

### 3.9 Checkout & Coupons (`/api/v1/checkout`, `/api/v1/coupons`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/coupons/validate` | Authenticated | Validate promo coupon against cart items |
| `POST` | `/api/v1/checkout/prepare` | Authenticated | Calculate final bill (shipping, taxes, coupon) |
| `POST` | `/api/v1/checkout/reserve` | Authenticated | Atomically reserve inventory with 15-min TTL |

---

### 3.10 Payments (`/api/v1/payments`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments/create-intent`| Authenticated | Initialize payment session with provider |
| `POST` | `/api/v1/payments/verify` | Authenticated | Client confirmation payload verification |
| `POST` | `/api/v1/payments/webhook` | Gateway Public | Cryptographically verified gateway webhook |
| `POST` | `/api/v1/payments/simulate` | Dev Sandbox | Simulated payment outcome for local testing |

---

### 3.11 Orders (`/api/v1/orders`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/orders` | Authenticated | View authenticated customer order history |
| `GET` | `/api/v1/orders/:id` | Authenticated | View full order detail and tracking timeline |
| `POST` | `/api/v1/orders` | Authenticated | Finalize and create order upon verified payment |
| `POST` | `/api/v1/orders/:id/cancel` | Authenticated | Cancel eligible order & trigger refund workflow |
| `GET` | `/api/v1/orders/:id/invoice` | Authenticated | Generate or download PDF/HTML tax invoice |

---

### 3.12 Reviews (`/api/v1/reviews`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reviews/product/:id` | Public | Paginated list of reviews with rating breakdown |
| `POST` | `/api/v1/reviews` | Authenticated | Submit verified review for purchased product |
| `POST` | `/api/v1/reviews/:id/vote` | Authenticated | Upvote review as helpful (deduplicated) |

---

### 3.13 Returns & Customer Support (`/api/v1/returns`, `/api/v1/support`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/returns` | Authenticated | Submit return/replacement request for order item |
| `GET` | `/api/v1/returns/:id` | Authenticated | Track return pickup, inspection, refund state |
| `GET` | `/api/v1/support/tickets` | Authenticated | List customer support tickets |
| `POST` | `/api/v1/support/tickets` | Authenticated | Open new support ticket with subject & message |
| `POST` | `/api/v1/support/tickets/:id/messages`| Authenticated | Reply to existing support ticket thread |

---

### 3.14 Multi-Vendor Seller Portal (`/api/v1/sellers`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/sellers/apply` | Authenticated | Submit vendor onboarding application |
| `GET` | `/api/v1/sellers/me` | Seller Only | Get current seller business status & profile |
| `GET` | `/api/v1/sellers/products` | Seller Only | Manage seller's own product listings |
| `POST` | `/api/v1/sellers/products` | Seller Only | Submit new product listing for approval |
| `PUT` | `/api/v1/sellers/inventory/:sku` | Seller Only | Update SKU stock quantities |
| `GET` | `/api/v1/sellers/orders` | Seller Only | View order line items belonging to this vendor |
| `PATCH`| `/api/v1/sellers/orders/:id/ship`| Seller Only | Provide shipment tracking number & carrier |
| `GET` | `/api/v1/sellers/reports` | Seller Only | View earnings, commissions, and settlements |

---

### 3.15 Administrator Portal (`/api/v1/admin`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/analytics/overview`| Admin Only | Platform GMV, orders, user counts, top products |
| `GET` | `/api/v1/admin/users` | Admin Only | Search & manage all platform users |
| `PATCH`| `/api/v1/admin/users/:id/status` | Admin Only | Suspend or ban a user account |
| `GET` | `/api/v1/admin/sellers` | Admin Only | List seller applications |
| `PATCH`| `/api/v1/admin/sellers/:id/approval`| Admin Only | Approve or reject seller registration |
| `POST` | `/api/v1/admin/categories` | Admin Only | Create, update, or remove categories |
| `PATCH`| `/api/v1/admin/products/:id/publish`| Admin Only | Approve or moderate product listings |
| `GET` | `/api/v1/admin/orders` | Admin Only | Global order management and tracking override |
| `PATCH`| `/api/v1/admin/returns/:id` | Admin Only | Approve/reject returns and authorize refunds |
| `GET` | `/api/v1/admin/audit-logs` | Admin Only | Inspect system audit trail |

---

### 3.16 Notifications (`/api/v1/notifications`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/notifications` | Authenticated | List in-app alerts and notifications |
| `PATCH`| `/api/v1/notifications/:id/read` | Authenticated | Mark alert as read |
| `PATCH`| `/api/v1/notifications/read-all`| Authenticated | Mark all customer alerts as read |

---

## 4. Error Code Registry

| Error Code | HTTP Status | Meaning |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient role permissions (e.g. non-admin accessing admin route) |
| `RESOURCE_NOT_FOUND` | 404 | Requested entity does not exist |
| `VALIDATION_ERROR` | 422 | Zod schema validation failed on request body/params |
| `INSUFFICIENT_STOCK` | 409 | Requested SKU stock is exhausted or unavailable |
| `RESERVATION_EXPIRED`| 410 | Checkout stock reservation window (15m) has lapsed |
| `COUPON_INVALID` | 400 | Coupon code is invalid, expired, or spend threshold unmet |
| `PAYMENT_FAILED` | 402 | Gateway declined transaction or signature mismatch |
| `REVIEW_NOT_ELIGIBLE`| 403 | Customer has not purchased product or already submitted review |
| `RATE_LIMIT_EXCEEDED`| 429 | Too many requests sent within rate limit window |
| `INTERNAL_SERVER_ERROR`| 500 | Unhandled exception trapped by centralized error middleware |
