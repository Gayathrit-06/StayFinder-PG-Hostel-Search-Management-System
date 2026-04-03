import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const statusConfig = {
  Pending: { icon: Clock, className: "bg-warning/10 text-warning" },
  Approved: { icon: CheckCircle, className: "bg-success/10 text-success" },
  Rejected: { icon: XCircle, className: "bg-destructive/10 text-destructive" },
};

export default function CustomerBookings() {
  const { bookings, currentUser } = useApp();
  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">My <span className="gradient-text">Bookings</span></h1>
        {myBookings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myBookings.map(b => {
              const { icon: StatusIcon, className } = statusConfig[b.status];
              return (
                <div key={b.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{b.hostelName}</h3>
                    <p className="text-sm text-muted-foreground">{b.duration} month{b.duration > 1 ? "s" : ""} · Booked {b.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-primary">₹{b.totalAmount.toLocaleString()}</span>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${className}`}>
                      <StatusIcon className="w-4 h-4" /> {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
