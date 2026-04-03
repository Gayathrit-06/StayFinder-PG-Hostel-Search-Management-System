import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { MapPin, Utensils, Wifi, Wind, WashingMachine, BedDouble, Users, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function HostelDetails() {
  const { id } = useParams<{ id: string }>();
  const { hostels, createBooking, currentUser } = useApp();
  const navigate = useNavigate();
  const hostel = hostels.find(h => h.id === id);
  const [duration, setDuration] = useState(1);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!hostel) return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8">
        <BackButton />
        <p className="text-center text-muted-foreground py-20">Hostel not found</p>
      </div>
    </div>
  );

  const handleBook = () => {
    if (!currentUser) return;
    createBooking(hostel.id, duration);
    toast.success("Booking request sent! Wait until owner approval.");
    setShowBooking(false);
    navigate("/customer/bookings");
  };

  const openMap = () => {
    window.open(`https://www.google.com/maps?q=${hostel.latitude},${hostel.longitude}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8 animate-fade-in">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden h-80 mb-3">
              <img src={hostel.images[selectedImg]} alt={hostel.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {hostel.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImg ? "border-primary" : "border-transparent opacity-60"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{hostel.name}</h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" /> {hostel.location}
            </div>
            <div className="text-3xl font-bold text-primary mb-6">
              ₹{hostel.rent.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/month</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: BedDouble, label: hostel.roomType + " Room" },
                { icon: Users, label: hostel.gender },
                { icon: Utensils, label: hostel.foodAvailable ? "Food Available" : "No Food" },
                { icon: Wind, label: hostel.ac ? "AC" : "Non-AC" },
                { icon: Wifi, label: hostel.wifi ? "WiFi" : "No WiFi" },
                { icon: WashingMachine, label: hostel.laundry ? "Laundry" : "No Laundry" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-muted">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {hostel.facilities.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-success">{hostel.availableRooms}</span> rooms available
            </p>

            <div className="flex gap-3">
              <button onClick={openMap} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-200">
                <MapPin className="w-5 h-5" /> View on Map
              </button>
              <button onClick={() => setShowBooking(true)} className="gradient-btn flex-1 py-3.5 text-lg">
                Book Now
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Opens Google Maps in a new tab with live directions
            </p>

            {/* Booking modal */}
            <Dialog open={showBooking} onOpenChange={setShowBooking}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Book {hostel.name}</DialogTitle>
                </DialogHeader>
                <label className="text-sm text-muted-foreground">Duration (months)</label>
                <input type="number" min={1} max={24} value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="w-full mt-1 mb-3 px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-foreground" />
                <div className="flex justify-between items-center mb-4 p-3 rounded-xl bg-muted">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{(hostel.rent * duration).toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowBooking(false)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleBook} className="flex-1 gradient-btn text-center">Confirm Booking</button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
