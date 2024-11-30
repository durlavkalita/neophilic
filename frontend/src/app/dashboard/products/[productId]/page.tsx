"use client";

import TitleWithBackButton from "@/components/title-with-back-button";
import { getAllAttributes } from "@/services/attributeServices";
import { getAllCategories } from "@/services/categoryServices";
import {
  createProduct,
  getProductById,
  updateProductById,
} from "@/services/productServices";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AwaitedReactNode,
  Key,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiUpload } from "react-icons/fi";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const productId = String(params.productId);

  const [categories, setCategories] = useState<Category[] | null>();
  const [attributes, setAttributes] = useState<Attribute[] | null>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [status, setStatus] = useState<"ENABLED" | "DISABLED">("ENABLED");
  const [stock, setStock] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productAttributes, setProductAttributes] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any>([]);
  const [productPhotos, setProductPhotos] = useState<string[]>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: { target: { files: any } }) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("sku", sku);
    formData.append("basePrice", price);
    formData.append("currentPrice", price);
    formData.append("description", description);
    formData.append("categoryId", productCategory);
    formData.append("stock", String(stock));
    formData.append("attributes", JSON.stringify(productAttributes));
    formData.append("status", status);
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    if (productId == "new") {
      const res = await createProduct(formData);
      console.log(res);
    } else {
      const res = await updateProductById(productId, formData);
      console.log(res);
    }

    router.push("/dashboard/products");
  };

  const handleAttributeSelect = (
    attributeName: string,
    attributeValue: string
  ) => {
    setProductAttributes({
      ...productAttributes,
      [attributeName]: attributeValue,
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAttributes = async () => {
      try {
        const data = await getAllAttributes();
        setAttributes(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchProductById = async () => {
      try {
        const data = await getProductById(productId!);
        console.log(data);

        const productData = data.data;
        setProductName(productData.name);
        setSku(productData.sku);
        setPrice(productData.basePrice);
        setDescription(productData.description);
        setStatus(productData.status);
        setStock(productData.stock);
        setProductCategory(productData.categoryId);
        if ("attributes" in productData) {
          setProductAttributes(productData.attributes);
        }
        setProductPhotos(productData.images);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
    fetchAttributes();
    if (productId != "new") {
      fetchProductById();
    }
    return function () {
      controller.abort();
    };
  }, [productId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <TitleWithBackButton
          title={productId == "new" ? "Create New Product" : "Update Product"}
          url={"/dashboard/products"}
        />
        <Link
          href={`/dashboard/products/${productId}/inventory`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Inventory History
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - 2/3 width on larger screens */}
        <div className="lg:w-2/3 space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                onChange={(e) => setProductName(e.target.value)}
                type="text"
                id="productName"
                name="productName"
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={productName}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700"
                >
                  SKU
                </label>
                <input
                  onChange={(e) => setSku(e.target.value)}
                  type="text"
                  id="sku"
                  name="sku"
                  className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={sku}
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={price}
                />
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
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                Drag and drop an image here, or click to select a file
              </p>
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="file-feedback">
              {files.length > 0 ? (
                <ul>
                  {files.map(
                    (
                      file: {
                        name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<AwaitedReactNode>
                          | null
                          | undefined;
                        size: number;
                      },
                      index: Key | null | undefined
                    ) => (
                      <li key={index}>
                        <p>
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                ""
              )}
            </div>
            {productPhotos && productPhotos.length > 0 ? (
              <div className="mt-4">
                <h1 className="text-sm">Uploaded Photos</h1>
                <ul>
                  {productPhotos.map((photoUrl, index) => (
                    <li key={index}>
                      <a
                        href={photoUrl}
                        target="_blank"
                        className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer"
                      >{`Image ${index + 1}`}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Sidebar - 1/3 width on larger screens */}
        <div className="lg:w-1/3 space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Info</h2>
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
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setProductCategory(e.target.value)}
                value={productCategory}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setStock(Number(e.target.value))}
                value={stock}
              />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Attributes</h2>
            {attributes?.map((attribute, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                <h3 className="font-medium mb-2">{attribute.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attribute.values.map((option, optionIndex) => (
                    <span
                      key={optionIndex}
                      className={`bg-gray-200 px-2 py-1 rounded text-sm cursor-pointer capitalize ${
                        productAttributes[attribute.name] == option
                          ? "text-blue-700 border-blue-500 border-2"
                          : ""
                      } `}
                      onClick={() =>
                        handleAttributeSelect(attribute.name, option)
                      }
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          {productId == "new" ? "Create Product" : "Update Product"}
        </button>
      </div>
    </div>
  );
}
