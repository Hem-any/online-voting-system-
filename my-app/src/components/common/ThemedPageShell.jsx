import heroCards from "../../assets/votesecure-hands-cards.svg";
import BackgroundEffects from "./BackgroundEffects";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

export default function ThemedPageShell({ children, className = "" }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white ${className}`}
      style={{
        backgroundImage: darkMode
          ? `linear-gradient(rgba(2,6,23,0.68), rgba(2,6,23,0.86)), url(${heroCards})`
          : `linear-gradient(rgba(241,245,249,0.62), rgba(15,23,42,0.28)), url(${heroCards})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <BackgroundEffects />

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-slate-950/10 backdrop-blur-[1px] dark:bg-slate-950/15" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
