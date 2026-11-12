"use client";

import toast, { Toaster } from "react-hot-toast";
import { authClient } from "../lib/auth-client";


// API Function
const addProduct = async (productData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add product!");
  }

  return response.text();
};

const AddDataPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = e.currentTarget;
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData.entries());

    try {
      await addProduct(productData);

      toast.success("Product added successfully!");
      form.reset();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            name="productName"
            placeholder="Enter product name"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Image URL</label>
          <input
            type="url"
            name="image"
            placeholder="Enter image URL"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            rows={4}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddDataPage;