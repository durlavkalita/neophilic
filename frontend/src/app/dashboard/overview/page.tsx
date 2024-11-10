"use client";

import React from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";

// Types
type Product = {
  id: number;
  name: string;
  price: number;
  sales: number;
};

type Order = {
  id: number;
  total: number;
  date: string;
};

type Customer = {
  id: number;
  name: string;
};

// Mock data
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, sales: 50 },
  { id: 2, name: "Smartphone", price: 699, sales: 100 },
  { id: 3, name: "Headphones", price: 199, sales: 75 },
  { id: 4, name: "Tablet", price: 499, sales: 30 },
  { id: 5, name: "Smartwatch", price: 299, sales: 45 },
];

const orders: Order[] = [
  { id: 1, total: 1299, date: "2023-05-01" },
  { id: 2, total: 899, date: "2023-05-02" },
  { id: 3, total: 1499, date: "2023-05-03" },
  { id: 4, total: 699, date: "2023-05-04" },
  { id: 5, total: 999, date: "2023-05-05" },
];

const customers: Customer[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

// Components
const Header: React.FC = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
    </div>
  </header>
);

const StatsOverview: React.FC = () => (
  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {[
      {
        title: "Total Products",
        value: products.length,
        icon: FiPackage,
        color: "bg-blue-500",
      },
      {
        title: "Total Orders",
        value: orders.length,
        icon: FiShoppingBag,
        color: "bg-green-500",
      },
      {
        title: "Total Customers",
        value: customers.length,
        icon: FiUsers,
        color: "bg-yellow-500",
      },
      {
        title: "Total Revenue",
        value: `$${orders.reduce((sum, order) => sum + order.total, 0)}`,
        icon: FiDollarSign,
        color: "bg-red-500",
      },
    ].map((item, index) => (
      <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon
                className={`h-6 w-6 text-white ${item.color} rounded-full p-1`}
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.title}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {item.value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Charts: React.FC = () => {
  const revenueData = orders.map((order) => ({
    date: order.date,
    revenue: order.total,
  }));
  const productData = products.map((product) => ({
    name: product.name,
    value: product.sales,
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
        <div className="p-5">
          <h2 className="text-lg font-medium text-gray-900">
            Revenue Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h2 className="text-lg font-medium text-gray-900">
            Product Sales Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {productData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const BestSellers: React.FC = () => {
  const sortedProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Best Sellers</h2>
        <ul className="divide-y divide-gray-200">
          {sortedProducts.map((product) => (
            <li
              key={product.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <FiPackage className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  {product.name}
                </span>
              </div>
              <div>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {product.sales} sold
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <StatsOverview />
        <Charts />
        <BestSellers />
      </main>
    </div>
  );
}
