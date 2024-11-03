# Auth & User Management

POST /api/auth/register
POST /api/auth/login
POST /api/auth/login/{provider} # For OAuth (Google, Facebook etc.)
POST /api/auth/refresh-token
POST /api/auth/logout
GET /api/auth/me # Get current user profile
PUT /api/auth/me # Update profile
GET /api/users/{id} # Admin only
PUT /api/users/{id}/role # Admin only

# Categories

GET /api/categories
GET /api/categories/{id}
POST /api/categories # Admin only
PUT /api/categories/{id} # Admin only
DELETE /api/categories/{id} # Admin only

# Attributes

GET /api/attributes
GET /api/attributes/{id}
POST /api/attributes # Admin only
PUT /api/attributes/{id} # Admin only
DELETE /api/attributes/{id}# Admin only

# Collections

GET /api/collections
GET /api/collections/{id}
POST /api/collections # Admin only
PUT /api/collections/{id} # Admin only
DELETE /api/collections/{id}# Admin only

# Products

GET /api/products
GET /api/products/{id}
GET /api/products/search
GET /api/products/category/{categoryId}
GET /api/products/collection/{collectionId}
POST /api/products # Admin only
PUT /api/products/{id} # Admin only
DELETE /api/products/{id} # Admin only
PATCH /api/products/{id}/status

# Cart

GET /api/cart
POST /api/cart/items # Add item to cart
PUT /api/cart/items/{id} # Update quantity
DELETE /api/cart/items/{id}
DELETE /api/cart # Clear cart

# Orders

POST /api/orders # Create order (from cart or direct)
GET /api/orders
GET /api/orders/{id}
GET /api/orders/{id}/track # Get tracking details
GET /api/orders/{id}/invoice
PATCH /api/orders/{id}/cancel

# Order Status Updates

PUT /api/orders/{id}/status # Update order status (admin/vendor only)
POST /api/orders/{id}/verify-delivery # OTP verification endpoint

# Inventory

GET /api/inventory/products/{productId}
PUT /api/inventory/products/{productId} # Update stock (admin only)

# Payment

POST /api/payments/initialize # Initialize payment gateway
POST /api/payments/verify # Verify payment
POST /api/payments/cod # Create COD order
GET /api/payments/history
POST /api/payments/retry

# Customer Support

POST /api/support/ticket
GET /api/support/tickets
PATCH /api/support/tickets/{id}

# how to use

- git clone https://github.com/durlavkalita/neophilic.git
- cd neophilic
- docker-compose up -d
- docker-compose down (to stop)
