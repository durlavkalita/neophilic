"use client";
import { getOrderById, orderStatusChange } from "@/services/orderServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const orderId = String(params.orderId);

  const [order, setOrder] = useState<OrderWithProduct>();

  const orderStatusNextStep = () => {
    if (order?.currentStatus == "PENDING") {
      return "SHIPPED";
    } else if (order?.currentStatus == "SHIPPED") {
      return "DELIVERED";
    } else {
      return "";
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserOrder = async () => {
      try {
        const data = await getOrderById(orderId!);
        console.log(data);

        setOrder(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserOrder();
    return function () {
      controller.abort();
    };
  }, [orderId]);

  const handleOrderStatusChange = async () => {
    let newStatus: "SHIPPED" | "DELIVERED";
    if (order?.currentStatus == "PENDING") {
      newStatus = "SHIPPED";
    } else if (order?.currentStatus == "SHIPPED") {
      newStatus = "DELIVERED";
    } else {
      return;
    }
    try {
      const data = await orderStatusChange(orderId, { status: newStatus });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Order Details</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - 2/3 width on larger screens */}
        <div className="lg:w-2/3 space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Delivery details</h2>
            <div className="pt-4">
              {order?.orderItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {item.productId.name}
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">SKU:</span>{" "}
                        {item.productId.sku}
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm">
                      ₹{item.priceAtTime} x {item.quantity}
                    </span>
                    <span className="text-gray-700 text-sm">
                      ₹{Number(item.priceAtTime) * Number(item.quantity)}
                    </span>
                  </div>
                  <div className="mt-8 border-t-2 py-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Status:</span>
                        <span className="ml-1 capitalize">
                          {order.currentStatus.toLowerCase()}
                        </span>
                      </div>
                      <button
                        className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 capitalize"
                        onClick={handleOrderStatusChange}
                      >
                        Change to {orderStatusNextStep().toLowerCase()}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width on larger screens */}
        <div className="lg:w-1/3">
          {/* <h2 className="text-lg font-semibold mb-4">Info</h2> */}

          <div className="p-4 border-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {order?.userId?.firstName + " " + order?.userId?.lastName}
            </span>
          </div>
          <div className="p-4 border-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {order?.userId?.email}
            </span>
          </div>
          <div className="p-4 border-2">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {order?.userId?.phoneNumber}
            </span>
          </div>
          <div className="p-4 border-2">
            <label
              htmlFor="deliveryAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Address
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {order?.deliveryAddress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
