import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // import icons

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        onLoginSuccess?.();
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
   <form
  onSubmit={handleLogin}
  className="max-w-sm mx-auto mt-24 p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl flex flex-col gap-6 border border-gray-300 dark:border-gray-700"
>
  <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white tracking-wide">
    Welcome Back
  </h2>

  {error && (
    <p className="text-red-500 text-sm text-center font-medium animate-pulse">
      {error}
    </p>
  )}

  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white shadow-inner placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300"
  />

  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white pr-12 shadow-inner placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
    </button>
  </div>

  <button
    type="submit"
    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
  >
    Login
  </button>

  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
    Don't have an account? <span className="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline">Sign up</span>
  </p>
</form>

  );
}
