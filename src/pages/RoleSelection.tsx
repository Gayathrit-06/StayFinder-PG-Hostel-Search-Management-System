import { useNavigate } from "react-router-dom";
import { Users, Building2, Shield, MapPin, Star } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
];

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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Images */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
          {HERO_IMAGES.map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={img}
                alt="Hostel"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground">
              Stay<span className="text-primary">Finder</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-lg">
            Discover and book the best PG & Hostel accommodations near you
          </p>
          <div className="flex items-center gap-4 mt-4">
            {[
              { num: "500+", text: "Hostels" },
              { num: "10K+", text: "Students" },
              { num: "4.8", text: "Rating", icon: Star },
            ].map((s) => (
              <div key={s.text} className="flex items-center gap-1 text-sm text-muted-foreground">
                {s.icon && <Star className="w-4 h-4 text-primary fill-primary" />}
                <span className="font-bold text-foreground">{s.num}</span> {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col items-center px-4 -mt-8 pb-12 relative z-10">
        <div className="grid gap-5 max-w-sm w-full">
          {roles.map((role, i) => (
            <button
              key={role.path}
              onClick={() => navigate(role.path)}
              className="group relative overflow-hidden rounded-2xl p-[2px] transition-all duration-300 hover:scale-105 animate-slide-up shadow-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative flex items-center gap-4 bg-card/80 backdrop-blur-md rounded-2xl px-6 py-5">
                <div className="p-3 rounded-xl bg-primary/20">
                  <role.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground text-lg">{role.label}</div>
                  <div className="text-muted-foreground text-sm">{role.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
