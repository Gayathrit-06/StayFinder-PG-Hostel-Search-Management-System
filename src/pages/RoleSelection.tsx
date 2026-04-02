import { useNavigate } from "react-router-dom";
import { Users, Building2, Shield } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      label: "Login as Customer",
      description: "Search and book hostels & PGs",
      icon: Users,
      path: "/login/user",
      gradient: "from-[hsl(260,70%,58%)] to-[hsl(210,80%,55%)]",
    },
    {
      label: "Login as Owner",
      description: "Manage your hostels & bookings",
      icon: Building2,
      path: "/login/owner",
      gradient: "from-[hsl(210,80%,55%)] to-[hsl(170,70%,45%)]",
    },
    {
      label: "Login as Super Admin",
      description: "Monitor the entire platform",
      icon: Shield,
      path: "/login/admin",
      gradient: "from-[hsl(330,75%,60%)] to-[hsl(260,70%,58%)]",
    },
  ];

  return (
    <div className="page-container gradient-bg flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-3 text-primary-foreground">
          Stay<span className="opacity-80">Finder</span>
        </h1>
        <p className="text-primary-foreground/70 text-lg mb-12 max-w-md mx-auto">
          Find your perfect PG & Hostel accommodation
        </p>
        <div className="grid gap-5 max-w-sm mx-auto">
          {roles.map((role, i) => (
            <button
              key={role.path}
              onClick={() => navigate(role.path)}
              className="group relative overflow-hidden rounded-2xl p-[2px] transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative flex items-center gap-4 bg-card/10 backdrop-blur-sm rounded-2xl px-6 py-5">
                <div className="p-3 rounded-xl bg-primary-foreground/20">
                  <role.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-primary-foreground text-lg">{role.label}</div>
                  <div className="text-primary-foreground/60 text-sm">{role.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
