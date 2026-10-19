import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={logo}
        alt="VoteSecure Logo"
        className="w-8 h-8"
      />

      <span className="text-blue-400 font-bold text-xl">
        VoteSecure
      </span>
    </Link>
  );
}