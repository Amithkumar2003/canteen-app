import { useState } from "react";
import toast from "react-hot-toast";
import logo from "./assets/logo.png";
import BASE_URL from "./api";

function Register({ setShowLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!username || !password) {
      toast.error("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      setLoading(false);

      if (res.ok) {
        toast.success("Account created");
        setShowLogin(false);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-600 via-teal-600 to-blue-600">

      {/* MOBILE HEADER */}
      <div className="md:hidden text-center text-white mt-10 px-4">
        <img
          src={logo}
          alt="logo"
          className="w-20 h-20 mx-auto mb-3 rounded-full shadow"
        />
        <h1 className="text-2xl font-bold">
          Sahyadri Canteen
        </h1>
        <p className="text-sm text-white/80">
          Create your account
        </p>
      </div>

      {/* DESKTOP LEFT */}
      <div className="hidden md:flex w-1/2 items-center justify-center text-white p-10">
        <div className="text-center">
          <img
            src={logo}
            alt="logo"
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-4">
            Join Sahyadri Canteen
          </h1>
          <p className="text-lg text-white/80">
            Create your account and start ordering
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">

          <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-6">
            Register
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
          />

          <button
            onClick={register}
            disabled={loading}
            className="w-full py-3 rounded bg-white text-green-600 font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-white/80 mt-4 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setShowLogin(false)}
              className="underline cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;