"use client";

import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TopBar() {
  const [showDetails, setShowDetails] = useState(false);
  const { user, logout } = useAuth();
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };
  return (
    <header className="bg-white shadow-md border-b-4 sticky top-0 z-10">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={"/dashboard"} className="flex items-center">
            <Image
              className="h-12 w-12 mr-2"
              src={`/logo.jpeg`}
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="font-bold text-xl text-blue-500">Neophilic</span>
          </Link>
          <div className="flex items-center">
            <div
              className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {getInitials()}
            </div>
            {showDetails && (
              <div className="absolute top-14 right-8 bg-white border border-gray-300 rounded shadow-lg p-4 w-48">
                <div className="mb-2">
                  <p className="font-medium">
                    <span className="font-light">Hello</span> {user?.firstName}{" "}
                    {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
