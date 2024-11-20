"use client";

import TitleWithBackButton from "@/components/title-with-back-button";
import {
  createCategory,
  getCategoryById,
  updateCategoryById,
} from "@/services/categoryServices";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const categoryId = String(params.categoryId);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"ENABLED" | "DISABLED">("ENABLED");

  const handleSubmit = async () => {
    const reqBody = {
      name: categoryName,
      description,
      status: status,
    };

    if (categoryId == "new") {
      const res = await createCategory(reqBody);
      console.log(res);
    } else {
      const res = await updateCategoryById(categoryId, reqBody);
      console.log(res);
    }

    router.push("/dashboard/categories");
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategoryById = async () => {
      try {
        const data = await getCategoryById(categoryId!);
        console.log(data);

        const categoryData = data.data;
        setCategoryName(categoryData.name);
        setDescription(categoryData.description);
        setStatus(categoryData.status);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId != "new") {
      fetchCategoryById();
    }
    return function () {
      controller.abort();
    };
  }, [categoryId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <TitleWithBackButton
          title={
            categoryId == "new" ? "Create New Category" : "Update Category"
          }
          url={"/dashboard/categories"}
        />
      </div>
      <div className="flex">
        {/* Main content - 2/3 width on larger screens */}
        <div className="w-full space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                onChange={(e) => setCategoryName(e.target.value)}
                type="text"
                id="categoryName"
                name="categoryName"
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={categoryName}
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="flex flex-col justify-around items-start">
                <div className="flex items-center my-1">
                  <input
                    type="radio"
                    id="enabled"
                    value="enabled"
                    checked={status === "ENABLED"}
                    onChange={() => setStatus("ENABLED")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm ml-2">Enabled</span>
                </div>
                <div className="flex items-center my-1">
                  <input
                    type="radio"
                    id="disabled"
                    value="disabled"
                    checked={status === "DISABLED"}
                    onChange={() => setStatus("DISABLED")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm ml-2">Disabled</span>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          {categoryId == "new" ? "Create Category" : "Update Category"}
        </button>
      </div>
    </div>
  );
}
