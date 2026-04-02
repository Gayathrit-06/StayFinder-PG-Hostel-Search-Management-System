import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, MapPin, Building2, Package } from "lucide-react";

export default function OwnerDashboard() {
  const { hostels, bookings, deleteHostel, currentUser } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"hostels" | "bookings">("hostels");

  const myHostels = hostels.filter(h => h.ownerId === currentUser?.id);
  const myHostelIds = new Set(myHostels.map(h => h.id));
  const myBookings = bookings.filter(b => myHostelIds.has(b.hostelId));

  const stats = [
    { label: "Hostels", value: myHostels.length, icon: Building2 },
    { label: "Bookings", value: myBookings.length, icon: Package },
    { label: "Pending", value: myBookings.filter(b => b.status === "Pending").length, icon: Package },
  ];

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Owner <span className="gradient-text">Dashboard</span></h1>
          <button onClick={() => navigate("/owner/add-hostel")} className="gradient-btn flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Hostel
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-5 text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {(["hostels", "bookings"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${tab === t ? "gradient-btn" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "hostels" && (
          <div className="grid gap-4">
            {myHostels.map(h => (
              <div key={h.id} className="glass-card p-5 flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-4">
                  <img src={h.images[0]} alt={h.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-foreground">{h.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {h.location} · ₹{h.rent}/mo · {h.gender}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/owner/edit-hostel/${h.id}`)}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if(confirm("Delete this hostel?")) deleteHostel(h.id); }}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {myHostels.length === 0 && <p className="text-center py-10 text-muted-foreground">No hostels yet. Add your first!</p>}
          </div>
        )}

        {tab === "bookings" && (
          <div className="grid gap-4">
            {myBookings.map(b => (
              <OwnerBookingCard key={b.id} booking={b} />
            ))}
            {myBookings.length === 0 && <p className="text-center py-10 text-muted-foreground">No bookings yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function OwnerBookingCard({ booking }: { booking: import("@/types").Booking }) {
  const { updateBookingStatus } = useApp();
  return (
    <div className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
      <div>
        <h3 className="font-bold text-foreground">{booking.hostelName}</h3>
        <p className="text-sm text-muted-foreground">By {booking.userName} · {booking.duration} months · ₹{booking.totalAmount.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        {booking.status === "Pending" ? (
          <>
            <button onClick={() => updateBookingStatus(booking.id, "Approved")}
              className="px-4 py-2 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Approve
            </button>
            <button onClick={() => updateBookingStatus(booking.id, "Rejected")}
              className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Reject
            </button>
          </>
        ) : (
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
            booking.status === "Approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            {booking.status}
          </span>
        )}
      </div>
    </div>
  );
}
