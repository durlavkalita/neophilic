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
  currentStock: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  attributes: object;
  status: "ENABLED" | "DISABLED";
}
