import React, { useState, useEffect } from "react";

const ManageMeals = () => {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  // console.log(import.meta.env.VITE_BACKEND_URL);

  const Spinner = () => (
    <div className="flex justify-center items-center">
      <svg
        className="animate-spin h-5 w-5 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V1a10 10 0 00-10 10h2zm0 0a8 8 0 008 8v-2a6 6 0 01-6-6H4z"
        />
      </svg>
    </div>
  );

  const uploadImageToCloudinary = async (file) => {
    const CLOUD_NAME = "dj5vexpr2"; // Replace with your Cloudinary Cloud Name
    const UPLOAD_PRESET = "lakjas"; // Replace with your Cloudinary Upload Preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setLoading(true); // Set loading to true when starting the upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudinary API error: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(`Error uploading image: ${error.message}`);
      return null;
    } finally {
      setLoading(false); // Set loading to false after upload is complete
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setForm((prevForm) => ({
          ...prevForm,
          image: url,
        }));
      }
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/meals`);
      if (!response.ok) throw new Error("Failed to fetch meals");
      const data = await response.json();
      setMeals(data);
    } catch (error) {
      setMessage("Failed to fetch meals");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();

    const mealData = {
      name: form.name,
      description: form.description,
      price: form.price,
      image: form.image,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/meals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(mealData), // Ensure this is a string
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchMeals();
        closeModal();
        setForm((prevForm) => ({
          ...prevForm,
          image: "",
        }));
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Add Meal Error:", error);
      setMessage("Failed to add meal");
    }
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();

    const mealData = {
      name: form.name,
      description: form.description,
      price: form.price,
      image: form.image,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/meals/${selectedMealId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(mealData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchMeals();
        closeModal();
        setForm((prevForm) => ({
          ...prevForm,
          image: "",
        }));
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to update meal");
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/meals/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchMeals();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to delete meal");
    }
  };

  const openModal = (meal = null) => {
    if (meal) {
      setForm({
        name: meal.name,
        description: meal.description,
        price: meal.price,
        image: meal.image, // Set the image URL if available
      });
      setSelectedMealId(meal._id);
    } else {
      setForm({ name: "", description: "", price: "", image: "" });
      setSelectedMealId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center text-red-700">
          Manage Meals
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Add New Meal
        </button>
        {message && (
          <div className="mt-6 text-center text-red-600 font-medium">
            {message}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center text-red-700">
          Existing Meals
        </h2>
        <div className="flex flex-wrap -mx-4">
          {meals.map((meal) => (
            <div key={meal._id} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center">
                {meal.image && (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-96 object-cover rounded mb-4"
                  />
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {meal.name}
                  </h3>
                  <p className="text-gray-700 mb-2">{meal.description}</p>
                  <p className="text-red-600 font-bold mb-4">
                    BDT {meal.price}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(meal)}
                    className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl mx-4 flex">
            {/* Image Uploader Section */}
            <div className="flex-shrink-0 w-1/3 p-4">
              <h1 className="text-2xl font-semibold mb-4 text-center">
                Cloudinary Image Uploader
              </h1>
              <input
                type="file"
                onChange={handleImageUpload}
                className="mb-4 p-2 border border-gray-300 rounded-lg"
                accept="image/*"
              />
              {loading && <Spinner />} {/* Show spinner while loading */}
              {uploadError && <p className="text-red-600">{uploadError}</p>}
              {form.image && (
                <div className="text-center mt-4">
                  <h2 className="text-lg font-medium">Uploaded Image</h2>
                  <img
                    src={form.image}
                    alt="Uploaded"
                    className="mt-2 max-w-full h-auto"
                  />
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="w-2/3 p-4">
              <h2 className="text-2xl font-semibold mb-4 text-center text-red-700">
                {selectedMealId ? "Edit Meal" : "Add Meal"}
              </h2>
              <form
                onSubmit={selectedMealId ? handleUpdateMeal : handleAddMeal}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    placeholder="Enter meal name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    placeholder="Enter meal description"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    placeholder="Enter meal price"
                    required
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    {selectedMealId ? "Update Meal" : "Add Meal"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMeals;
