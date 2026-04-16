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
  const [loading, setLoading] = useState(false);
  const [userOrder, setUserOrder] = useState(null);

  const categories = ["All", "Snacks", "Meals", "Drinks"];

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

  const filteredItems = foodItems.filter((item) => {
    const matchCategory =
      category === "All" || item.category === category;

    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

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

      setLoading(false);

      if (res.ok) {
        toast.success("Order placed");

        setUserOrder({
          ...orderData,
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

  useEffect(() => {
    if (!userOrder) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${BASE_URL}/orders`);
      const data = await res.json();

      const found = data.find(
        (o) =>
          o.table === userOrder.table &&
          o.time === userOrder.time
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
            <h1 className="text-xl font-bold">Sahyadri Canteen</h1>
            <p className="text-gray-500 text-sm">
              Campus Food Ordering System
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

      {/* MENU */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>

        {/* CART */}
        <div className="bg-white p-4 rounded shadow">
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
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserApp;