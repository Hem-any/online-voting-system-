import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import ThemedPageShell from "../components/common/ThemedPageShell";
import { useVoteAuth } from "../context/VoteAuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useVoteAuth();

  const [role, setRole] = useState("voter");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      if (!user) {
        throw new Error("Invalid login response.");
      }

      if (role === "admin" && user.role !== "ADMIN") {
        setError("This account is not an administrator.");
        setLoading(false);
        return;
      }

      if (role === "voter" && user.role === "ADMIN") {
        setError("Please select Admin to login with this account.");
        setLoading(false);
        return;
      }

      if (user.role === "ADMIN") {
        navigate("/vote/admin");
      } else {
        navigate("/vote/dashboard");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedPageShell>
      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/50 bg-white/85 text-slate-700 shadow-lg backdrop-blur transition hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-emerald-600">
              VoteSecure
            </h1>

            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
              <ShieldCheck size={16} />
              Protected Login
            </p>

            <h2 className="mt-6 text-3xl font-black">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Login to access your secure voting account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />

                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border p-3 pl-11"
                />
              </div>
            </div>

            <div>
              <label className="font-medium">
                Password
              </label>

              <div className="relative mt-1">
                <LockKeyhole
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border p-3 pl-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="font-medium">
                Login As
              </label>

              <div className="relative mt-1">
                <UserRound
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border p-3 pl-11"
                >
                  <option value="voter">Voter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/vote/register"
              className="font-bold text-emerald-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </ThemedPageShell>
  );
}