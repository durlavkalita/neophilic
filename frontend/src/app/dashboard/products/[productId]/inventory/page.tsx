"use client";

import { humanReadableDate } from "@/lib/utils";
import { getInventoryHistory } from "@/services/dashboardServices";
import { getProductById } from "@/services/productServices";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaChevronLeft } from "react-icons/fa";

export default function Page() {
  const params = useParams();
  const productId = String(params.productId);
  const [product, setProduct] = useState<Product>();
  const [inventory, setInventory] = useState<Inventory[]>();

  useEffect(() => {
    const controller = new AbortController();
    const fetchProductById = async () => {
      try {
        const data = await getProductById(productId!);
        console.log(data);

        const productData = data.data;
        setProduct(productData);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchInventoryHistory = async () => {
      try {
        const data = await getInventoryHistory(productId!);
        console.log(data);

        const inventoryData = data.data;
        setInventory(inventoryData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductById();
    fetchInventoryHistory();
    return function () {
      controller.abort();
    };
  }, [productId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PURCHASE":
      case "RETURN":
        return "bg-green-100 text-green-800";
      case "SALE":
        return "bg-blue-100 text-blue-700";
      case "STOCK_ADJUSTMENT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-xl font-semibold mb-4 sm:mb-0 text-gray-700">
          <span className="text-gray-900 font-bold">Inventory History:</span>{" "}
          {product?.name}
        </h1>
        <Link
          href={`/dashboard/products/${params.productId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaChevronLeft className="mr-2 h-4 w-4" />
          Back to Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg mb-8 p-6">
        <h2 className="text-xl font-semibold mb-2">Current Inventory</h2>
        <div className="text-4xl font-bold">{product?.stock}</div>
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
                >
                  Date
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
                >
                  Quantity Changed
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
              {inventory?.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      {item.type == "PURCHASE" || item.type == "RETURN" ? (
                        <FaArrowUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <FaArrowDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      {Math.abs(item.quantityChanged)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item?.notes}
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
