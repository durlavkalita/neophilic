"use client";

import TitleWithBackButton from "@/components/title-with-back-button";
import {
  createAttribute,
  getAttributeById,
  updateAttributeById,
} from "@/services/attributeServices";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const attributeId = String(params.attributeId);

  const [attributeName, setAttributeName] = useState("");
  const [values, setValues] = useState([""]);

  const handleSubmit = async () => {
    const reqBody = {
      name: attributeName,
      values: values.filter((v) => v.length != 0),
    };
    console.log(reqBody.values);

    if (attributeId == "new") {
      const res = await createAttribute(reqBody);
      console.log(res);
    } else {
      const res = await updateAttributeById(attributeId, reqBody);
      console.log(res);
    }

    router.push("/dashboard/attributes");
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchAttributeById = async () => {
      try {
        const data = await getAttributeById(attributeId!);
        console.log(data);

        const attributeData = data.data;
        setAttributeName(attributeData.name);
        setValues(attributeData.values);
      } catch (error) {
        console.log(error);
      }
    };
    if (attributeId != "new") {
      fetchAttributeById();
    }
    return function () {
      controller.abort();
    };
  }, [attributeId]);

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
  };
  const handleAddField = () => {
    setValues([...values, ""]);
  };
  const handleDeleteField = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <TitleWithBackButton
          title={
            attributeId == "new" ? "Create New Attribute" : "Update Attribute"
          }
          url={"/dashboard/attributes"}
        />
      </div>
      <div className="flex">
        {/* Main content - 2/3 width on larger screens */}
        <div className="w-full space-y-6">
          <div className="border-2 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div>
              <label
                htmlFor="attributeName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                onChange={(e) => setAttributeName(e.target.value)}
                type="text"
                id="attributeName"
                name="attributeName"
                className="mt-1 block w-full border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={attributeName}
              />
            </div>
            <div>
              <label
                htmlFor="values"
                className="block text-sm font-medium text-gray-700"
              >
                Values
              </label>
              {values.map((value, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => handleInputChange(index, event)}
                    placeholder={`Input ${index + 1}`}
                    className="mt-1 block w-1/2 border-2 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <FaTrashAlt
                    className="text-red-300 ml-2"
                    onClick={() => handleDeleteField(index)}
                  />
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="text-blue-700 text-sm"
              >
                Add More
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          {attributeId == "new" ? "Create Attribute" : "Update Attribute"}
        </button>
      </div>
    </div>
  );
}
