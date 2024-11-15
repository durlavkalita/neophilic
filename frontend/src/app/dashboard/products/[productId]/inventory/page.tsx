"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaChevronLeft } from "react-icons/fa";

// This would typically come from your API or database
const mockProductData = {
  id: "123",
  name: "Widget X",
  currentStock: 150,
};

// This would typically come from your API or database
const mockInventoryHistory = [
  {
    id: "1",
    type: "PURCHASE",
    quantityChanged: 100,
    created_at: "2023-06-01T10:00:00Z",
    notes: "Initial stock",
  },
  {
    id: "2",
    type: "SALE",
    quantityChanged: -10,
    created_at: "2023-06-02T14:30:00Z",
    notes: "Online order #1234",
  },
  {
    id: "3",
    type: "STOCK_ADJUSTMENT",
    quantityChanged: -5,
    created_at: "2023-06-03T09:15:00Z",
    notes: "Damaged goods",
  },
  {
    id: "4",
    type: "RETURN",
    quantityChanged: 2,
    created_at: "2023-06-04T11:45:00Z",
    notes: "Customer return",
  },
  {
    id: "5",
    type: "PURCHASE",
    quantityChanged: 50,
    created_at: "2023-06-05T16:00:00Z",
    notes: "Restocking",
  },
];

export default function Page() {
  const params = useParams();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PURCHASE":
      case "RETURN":
        return "bg-green-100 text-green-800";
      case "SALE":
        return "bg-blue-100 text-blue-800";
      case "STOCK_ADJUSTMENT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedHistory = [...mockInventoryHistory].sort((a, b) => {
    if (!sortColumn) return 0;
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortColumn === "quantity") {
      return sortDirection === "asc"
        ? a.quantityChanged - b.quantityChanged
        : b.quantityChanged - a.quantityChanged;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          Inventory History: {mockProductData.name}
        </h1>
        <Link
          href={`/dashboard/products/${params.productId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaChevronLeft className="mr-2 h-4 w-4" />
          Back to Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg mb-8 p-6">
        <h2 className="text-xl font-semibold mb-2">Current Inventory</h2>
        <div className="text-4xl font-bold">{mockProductData.currentStock}</div>
        <p className="text-gray-600">units in stock</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Inventory Changes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortColumn === "date" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity Changed
                  {sortColumn === "quantity" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedHistory.map((change) => (
                <tr key={change.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(change.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                        change.type
                      )}`}
                    >
                      {change.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      {change.quantityChanged > 0 ? (
                        <FaArrowUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <FaArrowDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      {Math.abs(change.quantityChanged)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {change.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
