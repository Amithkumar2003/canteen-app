import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./Login";
import Admin from "./Admin";
import UserApp from "./UserApp";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      {!user ? (
        <Login setUser={handleLogin} />
      ) : user.role === "admin" ? (
        <Admin logout={handleLogout} />
      ) : (
        <UserApp logout={handleLogout} />
      )}
    </>
  );
}

export default App;