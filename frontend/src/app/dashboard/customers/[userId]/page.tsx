"use client";
import TitleWithBackButton from "@/components/title-with-back-button";
import { humanReadableDate } from "@/lib/utils";
import { getUserById } from "@/services/authServices";
import { getOrdersByUser } from "@/services/orderServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const userId = String(params.userId);

  const [user, setUser] = useState<User | null>();
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserById = async () => {
      try {
        const data = await getUserById(userId!);
        setUser(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchUserOrders = async () => {
      try {
        const data = await getOrdersByUser(userId!);
        setOrders(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserById();
    fetchUserOrders();
    return function () {
      controller.abort();
    };
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <TitleWithBackButton
          title={"Customer Details"}
          url={"/dashboard/customers"}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - 2/3 width on larger screens */}
        <div className="lg:w-2/3 space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Order History</h2>
            <div>
              {orders?.map((order) => (
                <div key={order._id}>
                  <div className="flex justify-between items-center space-y-2">
                    <span className="text-blue-700 text-md cursor-pointer">
                      #{order._id}
                    </span>
                    <span className="text-gray-700 text-md">
                      {humanReadableDate(order.createdAt)}
                    </span>
                    <span className="text-gray-700 text-md capitalize">
                      {order.paymentStatus.toLocaleLowerCase()}
                    </span>
                    <span className="text-gray-700 text-md capitalize">
                      {order.currentStatus.toLocaleLowerCase()}
                    </span>
                    <span className="text-gray-700 text-md">
                      ₹{order.totalAmount}
                    </span>
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
              {user?.firstName + " " + user?.lastName}
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
              {user?.email}
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
              {user?.phoneNumber}
            </span>
          </div>
          <div className="p-4 border-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {user?.role}
            </span>
          </div>
          <div className="p-4 border-2">
            <label
              htmlFor="createdAt"
              className="block text-sm font-medium text-gray-700"
            >
              Joined
            </label>
            <span className="mt-1 block w-full text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {user?.createdAt ? humanReadableDate(user?.createdAt) : "NN"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
