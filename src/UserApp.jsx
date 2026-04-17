import { useState, useEffect } from "react";
import foodItems from "./data/foodData";
import FoodCard from "./components/FoodCard";
import Cart from "./components/Cart";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from "./assets/logo.png";
import BASE_URL from "./api";

function UserApp({ logout }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [userOrder, setUserOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["All", "Snacks", "Meals", "Drinks"];

  // ADD TO CART
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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // FILTER ITEMS
  const filteredItems = foodItems.filter((item) => {
    const matchCategory =
      category === "All" || item.category === category;

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // PLACE ORDER
  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Add items");
      return;
    }

    if (!tableNumber) {
      toast.error("Select table");
      return;
    }

    setLoading(true);

    const orderData = {
      items: cart,
      table: tableNumber,
      time: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Order placed");

        setUserOrder({
          ...orderData,
          _id: data.orderId,
          status: "Pending",
        });

        setCart([]);
        setTableNumber("");
      }
    } catch {
      setLoading(false);
      toast.error("Server error");
    }
  };

  // 🔥 LIVE STATUS UPDATE
  useEffect(() => {
    if (!userOrder) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();

      const found = data.find(
        (o) => o._id === userOrder._id
      );

      if (found) setUserOrder(found);
    }, 3000);

    return () => clearInterval(interval);
  }, [userOrder]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">
              Sahyadri Canteen
            </h1>
            <p className="text-gray-500 text-sm">
              Campus Food Ordering
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

      {/* SEARCH */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food..."
          className="w-full pl-10 pr-10 py-3 border rounded"
        />
        {search && (
          <IoClose
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 cursor-pointer"
          />
        )}
      </div>

      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* FOOD */}
        <div className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>

        {/* CART (STICKY) */}
        <div className="bg-white p-4 rounded shadow sticky top-4 h-fit">
          <Cart cart={cart} setCart={setCart} />

          <p className="font-bold mt-2">Total: ₹{total}</p>

          <select
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="mt-2 w-full p-2 border rounded"
          >
            <option value="">Select Table</option>
            {[1,2,3,4,5,6,7,8,9,10].map((t) => (
              <option key={t}>Table {t}</option>
            ))}
          </select>

          <button
            onClick={placeOrder}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>

          {/* ORDER STATUS */}
          {userOrder && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="font-semibold">Status:</p>
              <p className="text-lg font-bold">
                {userOrder.status}
              </p>

              <div className="mt-2">
                {userOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserApp;