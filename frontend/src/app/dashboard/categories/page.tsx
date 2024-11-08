"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { getAllProducts, getSearchedProduct } from "@/services/productServices";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    if (searchTerm == "") return;
    await fetchSearchedProducts(searchTerm, currentPage, itemsPerPage);
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const fetchSearchedProducts = async (
    searchTerm: string,
    currentPage: number,
    itemsPerPage: number
  ) => {
    try {
      const data = await getSearchedProduct(
        searchTerm,
        String(currentPage),
        String(itemsPerPage)
      );
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProducts = async (currentPage: number, itemsPerPage: number) => {
    try {
      const data = await getAllProducts(
        String(currentPage),
        String(itemsPerPage)
      );
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const controller = new AbortController();

    if (searchTerm == "") {
      fetchProducts(currentPage, itemsPerPage);
    } else {
      fetchSearchedProducts(searchTerm, currentPage, itemsPerPage);
    }

    return function () {
      controller.abort();
    };
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href={"/dashboard/products/new"}>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <FaPlus />
            <span className="ml-2 font-medium">Add Product</span>
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

        {/* <div className="flex items-center">
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
        </div> */}
        <span
          onClick={() => {
            setSearchTerm("");
            setCurrentPage(1);
            setItemsPerPage(10);
            // fetchProducts(currentPage, itemsPerPage);
          }}
          className="text-blue-500 hover:underline text-sm cursor-pointer"
        >
          Clear filter
        </span>
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
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  <Image
                    // src={`http://localhost:5000/uploads/products/${product.images[0]}`}
                    src={`/logo.jpeg`}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    width={50}
                    height={50}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/dashboard/products/${product._id}`}
                    className="hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">₹{product.basePrice}</td>
                <td className="py-2 px-4 border-b">{product.sku}</td>
                <td className="py-2 px-4 border-b">{product.currentStock}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`ml-4 inline-block w-3 h-3 rounded-full ${
                      product.status === "ENABLED"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
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
              className={`px-3 py-1 border rounded hover:bg-gray-300 ${
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
