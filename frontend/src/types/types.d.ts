declare interface Category {
  _id: string;
  name: string;
  description: string;
}

declare interface Attribute {
  _id: string;
  name: string;
  values: string[];
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

declare interface CollectionItem {
  _id: string;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  products: Product[];
}

declare interface User {
  _id: string;
  email: string;
  role: "USER" | "USER_PRO" | "VENDOR" | "ADMIN";
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  image: string;
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
