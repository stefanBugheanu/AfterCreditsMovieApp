import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/movieApis";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Store token if provided
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-16 w-full max-w-md">
      <div className="rounded-lg bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-6 text-center font-serif text-3xl text-white">
          Register
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
            <label className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded bg-zinc-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
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

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded bg-zinc-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </section>
  );
}
