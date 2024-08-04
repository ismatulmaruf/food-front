import React, { useState, useEffect } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    // Optimistic update
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: "completed" } : order
      )
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Optionally re-fetch orders or handle success
    } catch (err) {
      // Revert optimistic update if needed
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "pending" } : order
        )
      );
      setError("Failed to complete order.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      // Optimistic update
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Optionally re-fetch orders or handle success
      } catch (err) {
        // Revert optimistic update if needed
        setOrders((prevOrders) => [
          ...prevOrders,
          { _id: orderId, status: "pending" /* other default values */ },
        ]);
        setError("Failed to delete order.");
      }
    }
  };

  // Calculate total amount and pending amount
  const totalAmount = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      ),
    0
  );

  const pendingAmount = orders.reduce(
    (sum, order) =>
      order.status === "pending"
        ? sum +
          order.items.reduce(
            (total, item) => total + item.quantity * item.price,
            0
          )
        : sum,
    0
  );

  const completedAmount = orders.reduce(
    (sum, order) =>
      order.status === "completed"
        ? sum +
          order.items.reduce(
            (total, item) => total + item.quantity * item.price,
            0
          )
        : sum,
    0
  );

  // Log data to debug
  // console.log("Orders:", orders);
  // console.log("Total Amount:", totalAmount);
  // console.log("Pending Amount:", pendingAmount);
  // console.log("Completed Amount:", completedAmount);

  if (loading)
    return <p className="text-center text-gray-600">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Orders
        </h1>
        <div className="mb-8">
          <p className="text-lg text-black font-medium">
            Total Amount: BDT {totalAmount.toFixed(2)}
          </p>
          <p className="text-lg text-black font-medium">
            Pending Amount: BDT {pendingAmount.toFixed(2)}
          </p>
          <p className="text- text-black font-medium">
            Completed Amount: BDT {completedAmount.toFixed(2)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Street
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Postal Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const orderTotalAmount = order.items.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0
                );
                return (
                  <tr
                    key={order._id}
                    className={
                      order.status === "completed"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer.street}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer["postal-code"]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - {item.quantity} @ bdt {item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      BDT {orderTotalAmount.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.status === "completed" ? (
                        <span className="text-green-500">Completed</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button
                        onClick={() => handleCompleteOrder(order._id)}
                        disabled={order.status === "completed"}
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {order.status === "completed"
                          ? "Completed"
                          : "Complete Order"}
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
