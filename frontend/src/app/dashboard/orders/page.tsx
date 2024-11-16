"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { humanReadableDate } from "@/lib/utils";
import { getAllOrders } from "@/services/orderServices";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchOrders = async (currentPage: number, itemsPerPage: number) => {
    try {
      const data = await getAllOrders(
        String(currentPage),
        String(itemsPerPage)
      );
      console.log(data);

      setOrders(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const controller = new AbortController();

    fetchOrders(currentPage, itemsPerPage);

    return function () {
      controller.abort();
    };
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="py-2 px-4 border-b text-left">Order Number</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Customer Email</th>
              <th className="py-2 px-4 border-b text-left">Order Status</th>
              <th className="py-2 px-4 border-b text-left">Payment Status</th>
              <th className="py-2 px-4 border-b text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={`hover:bg-blue-200 ${
                  index % 2 == 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    className="hover:underline capitalize text-blue-700"
                  >
                    #{order._id}
                  </Link>
                </td>

                <td className="py-2 px-4 border-b">
                  {humanReadableDate(order.createdAt)}
                </td>
                <td className="py-2 px-4 border-b">{order?.userId?.email}</td>
                <td className="py-2 px-4 border-b capitalize">
                  {order.currentStatus.toLocaleLowerCase()}
                </td>
                <td className="py-2 px-4 border-b capitalize">
                  {order.paymentStatus.toLocaleLowerCase()}
                </td>
                <td className="py-2 px-4 border-b">₹{order.totalAmount}</td>
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
