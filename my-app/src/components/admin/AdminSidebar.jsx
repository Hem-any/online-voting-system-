import {
  BarChart3,
  Settings,
  Trophy,
  UserRound,
  UsersRound,
  Vote,
} from "lucide-react";

import Logo from "../common/Logo";

const menus = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "elections",
    name: "Elections",
    icon: Vote,
  },
  {
    id: "candidates",
    name: "Candidates",
    icon: UserRound,
  },
  {
    id: "users",
    name: "Users",
    icon: UsersRound,
  },
  {
    id: "results",
    name: "Results",
    icon: Trophy,
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  currentPage,
  setCurrentPage,
  theme = "dark",
}) {
  const isLight = theme === "light";

  return (
    <aside
      className={`w-72 shrink-0 border-r p-5 ${
        isLight
          ? "border-slate-200 bg-white text-slate-950"
          : "border-white/10 bg-slate-950 text-white"
      }`}
    >
      <Logo />

      <div className="mt-10 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = currentPage === menu.id;

          return (
            <button
              key={menu.id}
              type="button"
              onClick={() => setCurrentPage(menu.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                  : isLight
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{menu.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
