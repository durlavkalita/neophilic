"use client";

import {
  createCollection,
  getCollectionById,
  updateCollectionById,
} from "@/services/collectionServices";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const collectionId = String(params.collectionId);

  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    const reqBody = {
      name: collectionName,
      description: description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    if (collectionId == "new") {
      const res = await createCollection(reqBody);
      console.log(res);
    } else {
      const res = await updateCollectionById(collectionId, reqBody);
      console.log(res);
    }

    router.push("/dashboard/collections");
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCollectionById = async () => {
      try {
        const data = await getCollectionById(collectionId!);
        console.log(data);

        const collectionData = data.data;
        setCollectionName(collectionData.name);
        setDescription(collectionData.description);
        setStartDate(collectionData?.startDate.slice(0, 10));
        setEndDate(collectionData?.endDate.slice(0, 10));
      } catch (error) {
        console.log(error);
      }
    };
    if (collectionId != "new") {
      fetchCollectionById();
    }
    return function () {
      controller.abort();
    };
  }, [collectionId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Create New Collection</h1>
      <div className="flex">
        {/* Main content - 2/3 width on larger screens */}
        <div className="w-full space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div>
              <label
                htmlFor="collectionName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                onChange={(e) => setCollectionName(e.target.value)}
                type="text"
                id="collectionName"
                name="collectionName"
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={collectionName}
              />
            </div>
            <div className="flex items-center justify-start space-x-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={startDate}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={endDate}
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
        </div>
      </div>
      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          {collectionId == "new" ? "Create Collection" : "Update Collection"}
        </button>
      </div>
    </div>
  );
}
