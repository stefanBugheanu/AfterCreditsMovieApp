import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/movieApis";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
      });

      // Store token and username if provided
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      const savedUsername = response.username || formData.username;
      if (savedUsername) {
        localStorage.setItem("username", savedUsername);
      }
      // Dispatch custom event to update navbar immediately
      window.dispatchEvent(new Event("authChange"));

      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-16 w-full max-w-md">
      <div className="rounded-lg bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-6 text-center font-serif text-3xl text-white">
          Login
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded bg-zinc-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded bg-zinc-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </section>
  );
}
