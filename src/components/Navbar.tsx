import { useApp } from "@/context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Search, Package } from "lucide-react";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  if (!currentUser) return null;

  const dashboardPath = currentUser.role === "user" ? "/customer/search" :
    currentUser.role === "owner" ? "/owner/dashboard" : "/admin/dashboard";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50">
      <div className="content-container flex items-center justify-between h-16">
        <Link to={dashboardPath} className="text-xl font-bold gradient-text">
          StayFinder
        </Link>
        {currentUser.role === "user" && (
          <div className="flex items-center gap-1">
            <Link to="/customer/search" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="w-4 h-4" /> Search
            </Link>
            <Link to="/customer/bookings" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Package className="w-4 h-4" /> Bookings
            </Link>
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground capitalize">
              {currentUser.role}
            </span>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
