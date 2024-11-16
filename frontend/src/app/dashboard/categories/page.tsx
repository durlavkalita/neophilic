"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { getAllCategories } from "@/services/categoryServices";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchCategories = async (currentPage: number, itemsPerPage: number) => {
    try {
      const data = await getAllCategories(
        String(currentPage),
        String(itemsPerPage)
      );
      setCategories(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(currentPage, itemsPerPage);

    return function () {
      controller.abort();
    };
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href={"/dashboard/categories/new"}>
          <div className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center">
            <FaPlus />
            <span className="ml-2 font-medium">Add Category</span>
          </div>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="py-2 px-4 border-b text-left"></th>
              <th className="py-2 px-4 border-b text-left">Category Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category._id}
                className={`hover:bg-blue-200 ${
                  index % 2 == 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="py-2 px-4 border-b"></td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/dashboard/categories/${category._id}`}
                    className="hover:underline capitalize text-blue-700"
                  >
                    {category.name}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">
                  {category.description.slice(0, 40)}...
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
                currentPage === number ? "bg-blue-700 text-white" : ""
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
