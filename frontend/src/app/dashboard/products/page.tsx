"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

// Mock product data
const initialProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    sku: "SKU001",
    stock: 100,
    status: "enabled",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    sku: "SKU002",
    stock: 75,
    status: "disabled",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Product 3",
    price: 39.99,
    sku: "SKU003",
    stock: 50,
    status: "enabled",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Product 4",
    price: 49.99,
    sku: "SKU004",
    stock: 25,
    status: "enabled",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Product 5",
    price: 59.99,
    sku: "SKU005",
    stock: 0,
    status: "disabled",
    image: "/placeholder.svg?height=50&width=50",
  },
  // Add more products to test pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    name: `Product ${i + 6}`,
    price: Math.round(Math.random() * 100 + 10),
    sku: `SKU00${i + 6}`,
    stock: Math.round(Math.random() * 100),
    status: Math.random() > 0.5 ? "enabled" : "disabled",
    image: "/placeholder.svg?height=50&width=50",
  })),
];

export default function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = initialProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      setProducts(initialProducts);
    } else {
      const filtered = initialProducts.filter(
        (product) => product.status === status
      );
      setProducts(filtered);
    }
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href={"/dashboard/products/new"}>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <FaPlus />
            Add Product
          </div>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <form onSubmit={handleSearch} className="flex-grow w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-md pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <FaSearch />
            </button>
          </div>
        </form>

        <div className="flex items-center">
          <FaFilter />
          <select
            className="border rounded-md px-2 py-1"
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Thumbnail</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">SKU</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    width={50}
                    height={50}
                  />
                </td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{product.sku}</td>
                <td className="py-2 px-4 border-b">{product.stock}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded ${
                      product.status === "enabled"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                currentPage === number ? "bg-blue-500 text-white" : ""
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>items per page</span>
        </div>
      </div>
    </div>
  );
}
