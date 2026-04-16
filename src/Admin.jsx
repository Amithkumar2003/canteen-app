import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import logo from "./assets/logo.png";
import BASE_URL from "./api";

function Admin({ logout }) {
  const [orders, setOrders] = useState([]);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    await fetch(`${BASE_URL}/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchOrders();
  };

  // DELETE ORDER
  const deleteOrder = async (id) => {
    await fetch(`${BASE_URL}/order/${id}`, {
      method: "DELETE",
    });

    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">
              Sahyadri Canteen - Admin
            </h1>
            <p className="text-gray-500 text-sm">
              Manage Orders
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No orders available
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {orders.map((order) => {

            const total = order.items.reduce(
              (sum, item) => sum + item.price * item.qty,
              0
            );

            return (
              <div
                key={order._id}
                className="bg-white p-4 rounded shadow"
              >
                <h2 className="font-semibold mb-2">
                  Order ID: {order._id.slice(-5)}
                </h2>

                <p className="text-gray-600">
                  Table: {order.table || "N/A"}
                </p>

                <p className="text-gray-500 text-sm mb-2">
                  {order.time}
                </p>

                {/* Items */}
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>x{item.qty}</span>
                  </div>
                ))}

                {/* Total */}
                <p className="mt-2 font-semibold">
                  Total: ₹{total}
                </p>

                {/* Status */}
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "Pending"
                        ? "bg-gray-500"
                        : order.status === "Preparing"
                        ? "bg-yellow-500"
                        : order.status === "Ready"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(order._id, "Preparing")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Ready")}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "Completed")}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Completed
                  </button>
                </div>

                {/* Delete */}
                {order.status === "Completed" && (
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded"
                  >
                    Clear Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Admin;