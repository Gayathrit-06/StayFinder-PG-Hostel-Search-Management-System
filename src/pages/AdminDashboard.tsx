import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, Building2, Package, Trash2, MapPin } from "lucide-react";

export default function AdminDashboard() {
  const { users, hostels, bookings, deleteHostel } = useApp();

  const stats = [
    { label: "Users", value: users.filter(u => u.role === "user").length, icon: Users },
    { label: "Owners", value: users.filter(u => u.role === "owner").length, icon: Users },
    { label: "Hostels", value: hostels.length, icon: Building2 },
    { label: "Bookings", value: bookings.length, icon: Package },
  ];

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8">
        <h1 className="text-3xl font-bold mb-6">Super Admin <span className="gradient-text">Panel</span></h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-5 text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users */}
        <h2 className="text-xl font-bold text-foreground mb-4">All Users</h2>
        <div className="glass-card overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Name</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Email</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-5 py-3 text-sm text-foreground">{u.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize font-semibold">{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hostels */}
        <h2 className="text-xl font-bold text-foreground mb-4">All Hostels</h2>
        <div className="grid gap-3 mb-8">
          {hostels.map(h => (
            <div key={h.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={h.images[0]} alt={h.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{h.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {h.location} · ₹{h.rent} · {h.gender}
                  </div>
                </div>
              </div>
              <button onClick={() => { if(confirm("Remove this hostel?")) deleteHostel(h.id); }}
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 className="text-xl font-bold text-foreground mb-4">All Bookings</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">User</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Hostel</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Amount</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-3 text-sm text-foreground">{b.userName}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{b.hostelName}</td>
                  <td className="px-5 py-3 text-sm text-foreground">₹{b.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      b.status === "Approved" ? "bg-success/10 text-success" :
                      b.status === "Rejected" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
