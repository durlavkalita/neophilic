"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {} from "react-icons/md";
import { FaHashtag, FaHome, FaLink, FaTag } from "react-icons/fa";
import { FiPackage, FiShoppingBag, FiUsers } from "react-icons/fi";

const navigationItems = [
  {
    link: "/dashboard/products",
    name: "products",
  },
  {
    link: "/dashboard/categories",
    name: "categories",
  },
  {
    link: "/dashboard/attributes",
    name: "attributes",
  },
  {
    link: "/dashboard/orders",
    name: "orders",
  },
  {
    link: "/dashboard/customers",
    name: "customers",
  },
];

const ReturnIcon = ({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) => {
  switch (icon) {
    case "dashboard":
      return <FaHome className={className} />;
    case "products":
      return <FiPackage className={className} />;
    case "attributes":
      return <FaHashtag className={className} />;
    case "collections":
      return <FaTag className={className} />;
    case "categories":
      return <FaLink className={className} />;
    case "orders":
      return <FiShoppingBag className={className} />;
    case "customers":
      return <FiUsers className={className} />;
  }
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 h-full border-r-2">
      <div className="py-6">
        <div className="">
          <div>
            <div className="text-xs font-medium text-gray-700 ml-8 mb-4 uppercase">
              Quick links
            </div>
            <Link
              href={"/dashboard/overview"}
              className={`flex items-center py-2 border-l-4 pl-8 text-gray-700 hover:bg-gray-200 rounded ${
                pathname.includes("/dashboard/overview")
                  ? " border-blue-500 bg-gray-100 "
                  : "border-white "
              }`}
            >
              <FaHome
                className={`${
                  pathname.includes("/dashboard/overview")
                    ? "text-blue-500"
                    : ""
                }`}
              />
              <span
                className={`ml-2 font-medium capitalize text-sm ${
                  pathname.includes("/dashboard/overview")
                    ? "text-blue-500"
                    : ""
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link
              href={"/dashboard/products/new"}
              className={`flex items-center py-2 border-l-4 pl-8 text-gray-700 hover:bg-gray-200 rounded `}
            >
              <FiPackage className={``} />
              <span className={`ml-2 font-medium capitalize text-sm `}>
                New Product
              </span>
            </Link>
          </div>
          <div className="mt-8">
            <div className="text-xs font-medium text-gray-700 ml-8 mb-4 uppercase">
              Catalog
            </div>
            {navigationItems.map((item, index) => (
              <div key={index}>
                <Link
                  href={item.link}
                  className={`flex items-center py-2 border-l-4 pl-8 text-gray-700 hover:bg-gray-200 rounded ${
                    pathname.includes(item.link)
                      ? " border-blue-500 bg-gray-100"
                      : "border-white"
                  }`}
                >
                  <ReturnIcon
                    icon={item.name}
                    className={`${
                      pathname.includes(item.link) ? "text-blue-500" : ""
                    }`}
                  />
                  <span
                    className={`ml-2 font-medium capitalize text-sm ${
                      pathname.includes(item.link) ? "text-blue-500" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
