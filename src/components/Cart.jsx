function Cart({ cart, setCart }) {

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    setCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
    } else {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.qty;
  }, 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">

      <h2 className="text-xl font-bold mb-4">Cart 🛒</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">

            <div>
              <p className="font-semibold">{item.name}</p>
              <p>₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(index)}
                className="bg-gray-300 px-2 rounded"
              >
                -
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() => increaseQty(index)}
                className="bg-gray-300 px-2 rounded"
              >
                +
              </button>
            </div>

          </div>
        ))
      )}

      <hr className="my-3" />

      <h3 className="font-bold">Total: ₹{total}</h3>

    </div>
  );
}

export default Cart;