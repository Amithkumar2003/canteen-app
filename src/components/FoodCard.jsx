import { useState } from "react";

function FoodCard({ item, addToCart }) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(item);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">

      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-3">

        <h3 className="font-semibold text-gray-800">
          {item.name}
        </h3>

        <p className="text-gray-500 text-sm mb-2">
          ₹{item.price}
        </p>

        <button
          onClick={handleClick}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded 
                     active:scale-95 transition"
        >
          {added ? "Added" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}

export default FoodCard;