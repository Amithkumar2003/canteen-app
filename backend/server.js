const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


// ================= MONGODB CONNECTION =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    setupAdmin();
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });


// ================= MODELS =================

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", UserSchema);

const OrderSchema = new mongoose.Schema({
  items: Array,
  table: String,
  time: String,
  status: String,
});

const Order = mongoose.model("Order", OrderSchema);


// ================= ADMIN SETUP =================

async function setupAdmin() {
  try {
    await User.deleteMany({ username: "admin" });

    await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin ready");
  } catch (err) {
    console.log("Admin setup error:", err);
  }
}


// ================= USERS =================

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    await User.create({
      username,
      password,
      role: "user",
    });

    res.json({ message: "User registered" });
  } catch {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Login error" });
  }
});


// ================= ORDERS =================

// ✅ PLACE ORDER (FIXED)
app.post("/order", async (req, res) => {
  try {
    const order = req.body;

    const newOrder = await Order.create({
      ...order,
      status: "Pending",
    });

    res.json({
      message: "Order saved",
      orderId: newOrder._id.toString(), // 🔥 IMPORTANT
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Order error" });
  }
});

// Get Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Fetch error" });
  }
});

// Update Status
app.put("/order/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Order.findByIdAndUpdate(req.params.id, {
      status,
    });

    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ message: "Update error" });
  }
});

// Delete Order
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted" });
  } catch {
    res.status(500).json({ message: "Delete error" });
  }
});


// ================= START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});