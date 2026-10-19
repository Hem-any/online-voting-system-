import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Vote } from "lucide-react";

import { useVoteAuth } from "../../context/VoteAuthContext";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-slate-950 text-white dark:bg-white/15 dark:text-white"
      : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

export default function Navbar() {
  const { user, logout, isAuthenticated } = useVoteAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/vote/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-emerald-300">
            <Vote className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black leading-5 text-slate-950 dark:text-white">
              VoteSecure
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-1">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/vote/results" className={linkClass}>
            Results
          </NavLink>

          {isAuthenticated ? (
            <>
              <span className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300 sm:flex">
                <ShieldCheck className="h-4 w-4" />
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-400/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/vote/login" className={linkClass}>
                Login
              </NavLink>
              <Link
                to="/vote/register"
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
