import { useState, useEffect } from "react";
import foodItems from "./data/foodData";
import FoodCard from "./components/FoodCard";
import Cart from "./components/Cart";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from "./assets/logo.png";

function UserApp({ logout }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [userOrder, setUserOrder] = useState(null);

  const categories = ["All", "Snacks", "Meals", "Drinks"];

  // Add to cart
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Filter
  const filteredItems = foodItems.filter((item) => {
    const matchCategory =
      category === "All" || item.category === category;

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Add items to cart");
      return;
    }

    if (!tableNumber) {
      toast.error("Select table number");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart,
        table: tableNumber,
        time: new Date().toLocaleString(),
      };

      const res = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      setLoading(false);

      if (res.ok) {
        toast.success("Order placed");

        // ✅ SAFE ORDER SET
        setUserOrder({
          ...orderData,
          status: "Pending",
        });

        setCart([]);
        setTableNumber("");
      } else {
        toast.error("Order failed");
      }
    } catch {
      setLoading(false);
      toast.error("Server error");
    }
  };

  // Live status update + notification
  useEffect(() => {
    if (!userOrder) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/orders");
        const data = await res.json();

        const found = data.find(
          (o) =>
            o.table === userOrder.table &&
            o.time === userOrder.time
        );

        if (found) {
          // 🔔 Notification when ready
          if (
            userOrder.status !== "Ready" &&
            found.status === "Ready"
          ) {
            toast.success("Your order is ready");
          }

          setUserOrder(found);
        }
      } catch (err) {
        console.log(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userOrder]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">

    <img
      src={logo}
      alt="logo"
      className="w-10 h-10 rounded-full object-cover"
    />

    <div>
      <h1 className="text-xl font-bold">
        Sahyadri Canteen
      </h1>
      <p className="text-gray-500 text-sm">
        Campus Food Ordering System
      </p>
    </div>

  </div>

  {/* RIGHT SIDE */}
  <button
    onClick={logout}
    className="bg-red-500 px-4 py-2 rounded text-white"
  >
    Logout
  </button>

</div>
      {/* Search */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {search && (
          <IoClose
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-black"
            size={20}
          />
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded ${
              category === c
                ? "bg-black text-white"
                : "bg-white border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* MENU */}
        <div className="md:col-span-2">

          <h2 className="text-lg font-semibold mb-3">Menu</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>

        </div>

        {/* CART */}
        <div className="md:sticky md:top-6 h-fit">

          <div className="bg-white p-4 rounded shadow">

            <h2 className="font-semibold mb-2">Your Cart</h2>

            <Cart cart={cart} setCart={setCart} />

            <p className="mt-4 font-bold">
              Total: ₹{total}
            </p>

            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="mt-4 w-full p-3 border rounded"
            >
              <option value="">Select Table</option>
              {[1,2,3,4,5,6,7,8,9,10].map((t) => (
                <option key={t} value={t}>
                  Table {t}
                </option>
              ))}
            </select>

            <button
              onClick={placeOrder}
              disabled={loading || cart.length === 0}
              className={`mt-4 w-full py-3 rounded text-white ${
                cart.length === 0
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

          </div>

        </div>

      </div>

      {/* USER ORDER */}
      {userOrder && userOrder.items && (
        <div className="mt-6 bg-white p-4 rounded shadow">

          <h2 className="font-semibold mb-2">Your Order</h2>

          {userOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name}</span>
              <span>x{item.qty}</span>
            </div>
          ))}

          <p className="mt-2 font-bold">
            Total: ₹
            {userOrder.items.reduce(
              (sum, item) => sum + item.price * item.qty,
              0
            )}
          </p>

          <p className="mt-2">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded text-white ${
                userOrder.status === "Pending"
                  ? "bg-gray-500"
                  : userOrder.status === "Preparing"
                  ? "bg-yellow-500"
                  : userOrder.status === "Ready"
                  ? "bg-blue-500"
                  : "bg-green-600"
              }`}
            >
              {userOrder.status || "Pending"}
            </span>
          </p>

        </div>
      )}

    </div>
  );
}

export default UserApp;