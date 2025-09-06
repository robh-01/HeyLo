import { Link } from "react-router-dom";
import { Globe, Send, Users, Search } from "lucide-react";

export default function Sidebar() {
  return (
    <nav className="sidebar flex flex-col gap-2">
      <div>
        <Link to="/">
          <Globe size={26} />
        </Link>
      </div>
      <div>
        <Link to="/direct">
          <Send size={26} />
        </Link>
      </div>
      <div>
        <Link to="/group">
          <Users size={26} />
        </Link>
      </div>
      <div>
        <Link to="/search">
          <Search size={26} />
        </Link>
      </div>
    </nav>
  );
}
