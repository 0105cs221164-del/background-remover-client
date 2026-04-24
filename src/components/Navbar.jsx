import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const Navbar = () => {
  const { user, credits, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setOpen(false); };

  const linkClass = ({ isActive }) =>
    "text-sm transition-colors " +
    (isActive ? "text-white font-medium" : "text-white/50 hover:text-white");

  return (
    <nav className="border-b border-white/10 sticky top-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-tight">
          Bg<span className="text-brand-500">Eraser</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <NavLink to="/dashboard"   className={linkClass}>Dashboard</NavLink>
              <NavLink to="/history"     className={linkClass}>History</NavLink>
              <NavLink to="/buy-credits" className={linkClass}>
                Credits: <span className="text-brand-500 font-semibold ml-0.5">{credits}</span>
              </NavLink>
              <button onClick={handleLogout} className="btn-outline text-xs py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className={linkClass}>Login</NavLink>
              <Link    to="/register" className="btn-primary text-xs py-1.5 px-4">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="sm:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-white/10 bg-black/90 px-4 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link to="/dashboard"   onClick={() => setOpen(false)} className="text-sm text-white/70">Dashboard</Link>
              <Link to="/history"     onClick={() => setOpen(false)} className="text-sm text-white/70">History</Link>
              <Link to="/buy-credits" onClick={() => setOpen(false)} className="text-sm text-white/70">
                Credits: <span className="text-brand-500">{credits}</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm py-2 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setOpen(false)} className="text-sm text-white/70">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 text-center">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
