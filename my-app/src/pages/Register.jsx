import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, IdCard, LockKeyhole, Mail, UserRound, Vote } from "lucide-react";

import { register } from "../Api/authApi";
import ThemedPageShell from "../components/common/ThemedPageShell";

const fields = [
  {
    label: "Full name",
    key: "name",
    type: "text",
    placeholder: "John Doe",
    icon: UserRound,
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    placeholder: "you@example.com",
    icon: Mail,
  },
  {
    label: "Voter ID",
    key: "voterId",
    type: "text",
    placeholder: "VID-123456",
    icon: IdCard,
  },
  {
    label: "Password",
    key: "password",
    type: "password",
    placeholder: "Create password",
    icon: LockKeyhole,
  },
  {
    label: "Confirm password",
    key: "confirm",
    type: "password",
    placeholder: "Confirm password",
    icon: LockKeyhole,
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    voterId: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        voterId: form.voterId,
        password: form.password,
      });

      navigate("/vote/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedPageShell>
      <div className="flex min-h-screen items-center px-4 py-10">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-lg border border-white/50 bg-white/90 shadow-xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="bg-slate-950 p-8 text-white lg:p-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                <Vote className="h-6 w-6" />
              </span>
              <span className="text-2xl font-black">VoteSecure</span>
            </Link>

            <div className="mt-16">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Voter enrollment
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal">
                Build a verified profile before entering the ballot room.
              </h1>
              <p className="mt-5 leading-8 text-slate-300">
                Registration collects the essentials a real voting portal needs:
                identity, voter ID, account security, and a clear route back to
                the election dashboard.
              </p>
            </div>
          </aside>

          <main className="p-6 sm:p-8 lg:p-10">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>

            <div className="mb-7">
              <h2 className="text-3xl font-black tracking-normal text-slate-900 dark:text-white">
                Create voter account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Complete your profile to access active elections.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <label
                    key={field.key}
                    className={field.key === "email" ? "block sm:col-span-2" : "block"}
                  >
                    <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </span>
                    <span className="relative block">
                      <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={field.type}
                        required
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-emerald-500/20"
                        placeholder={field.placeholder}
                      />
                    </span>
                  </label>
                );
              })}

              <button
                type="submit"
                disabled={loading}
                className="min-h-12 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:col-span-2"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/vote/login" className="font-bold text-emerald-700 hover:underline dark:text-emerald-300">
                Sign in
              </Link>
            </p>
          </main>
        </div>
      </div>
    </ThemedPageShell>
  );
}
