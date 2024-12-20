declare interface Category {
  _id: string;
  name: string;
  description: string;
  status: "ENABLED" | "DISABLED";
}

declare interface Attribute {
  _id: string;
  name: string;
  values: string[];
  status: "ENABLED" | "DISABLED";
}

declare interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: string;
  currentPrice: string;
  sku: string;
  stock: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  attributes: object;
  status: "ENABLED" | "DISABLED";
}

declare interface User {
  _id: string;
  email: string;
  role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  images: string;
  createdAt: string;
  updatedAt: string;
}

declare interface Order {
  _id: string;
  userId: User;
  totalAmount: number;
  orderItems: {
    productId: string;
    quantity: number;
    priceAtTime: number;
  }[];
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "CREDIT_CARD" | "UPI" | "COD";
  currentStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  deliveryAddress: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

declare interface OrderWithProduct {
  _id: string;
  userId: User;
  totalAmount: number;
  orderItems: {
    productId: Product;
    quantity: number;
    priceAtTime: number;
  }[];
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "CREDIT_CARD" | "UPI" | "COD";
  currentStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  deliveryAddress: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

declare interface Inventory {
  _id: string;
  productId: string;
  quantityChanged: number;
  type: "STOCK_ADJUSTMENT" | "SALE" | "PURCHASE" | "RETURN";
  referenceId?: string;
  notes?: string;
  createdAt: string;
}
