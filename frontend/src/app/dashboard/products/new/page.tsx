"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";

export default function CreateProductPage() {
  const [attributes, setAttributes] = useState([
    { name: "Color", options: ["Red", "Blue", "Green"] },
    { name: "Size", options: ["Small", "Medium", "Large"] },
  ]);

  const addAttributeOption = (attributeIndex: number, option: string) => {
    setAttributes((prevAttributes) => {
      const newAttributes = [...prevAttributes];
      newAttributes[attributeIndex] = {
        ...newAttributes[attributeIndex],
        options: [...newAttributes[attributeIndex].options, option],
      };
      return newAttributes;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - 2/3 width on larger screens */}
        <div className="lg:w-2/3 space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700"
              >
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                Drag and drop an image here, or click to select a file
              </p>
              <input type="file" className="hidden" />
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width on larger screens */}
        <div className="lg:w-1/3 space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
                <option>Home & Garden</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Attributes</h2>
            {attributes.map((attribute, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                <h3 className="font-medium mb-2">{attribute.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attribute.options.map((option, optionIndex) => (
                    <span
                      key={optionIndex}
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      {option}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex">
                  <input
                    type="text"
                    placeholder={`Add ${attribute.name.toLowerCase()}`}
                    className="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={() => addAttributeOption(index, "New Option")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create Product
        </button>
      </div>
    </div>
  );
}
