"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdPeopleAlt } from "react-icons/md";
import { FaBox, FaHashtag, FaHome, FaLink, FaTag } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";

const navigationItems = [
  {
    link: "/dashboard/overview",
    name: "dashboard",
  },
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
    link: "/dashboard/collections",
    name: "collections",
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
      return <FaBoxArchive className={className} />;
    case "attributes":
      return <FaHashtag className={className} />;
    case "collections":
      return <FaTag className={className} />;
    case "categories":
      return <FaLink className={className} />;
    case "orders":
      return <FaBox className={className} />;
    case "customers":
      return <MdPeopleAlt className={className} />;
  }
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100 h-full border-r-2">
      <div className="py-6">
        <div className="space-y-2">
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
                    pathname.includes(item.link)
                      ? "text-blue-500"
                      : "text-black"
                  }`}
                />
                <span
                  className={`ml-2 font-medium capitalize text-md ${
                    pathname.includes(item.link)
                      ? "text-blue-500"
                      : "text-black"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
