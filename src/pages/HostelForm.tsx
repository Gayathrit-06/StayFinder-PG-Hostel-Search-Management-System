import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Hostel, Gender, RoomType } from "@/types";
import { toast } from "sonner";

export default function HostelForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { hostels, addHostel, updateHostel, currentUser } = useApp();
  const navigate = useNavigate();

  const existing = isEdit ? hostels.find(h => h.id === id) : null;

  const [form, setForm] = useState({
    name: "", location: "", latitude: "13.0827", longitude: "80.2707",
    rent: "", roomType: "Shared" as RoomType, gender: "Male" as Gender,
    foodAvailable: false, facilities: "", images: "",
    availableRooms: "5", ac: false, wifi: true, laundry: false,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name, location: existing.location,
        latitude: String(existing.latitude), longitude: String(existing.longitude),
        rent: String(existing.rent), roomType: existing.roomType, gender: existing.gender,
        foodAvailable: existing.foodAvailable, facilities: existing.facilities.join(", "),
        images: existing.images.join(", "), availableRooms: String(existing.availableRooms),
        ac: existing.ac, wifi: existing.wifi, laundry: existing.laundry,
      });
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.rent) {
      toast.error("Please fill required fields");
      return;
    }
    const hostelData: Omit<Hostel, "id"> = {
      name: form.name, location: form.location,
      latitude: Number(form.latitude), longitude: Number(form.longitude),
      rent: Number(form.rent), roomType: form.roomType, gender: form.gender,
      foodAvailable: form.foodAvailable,
      facilities: form.facilities.split(",").map(f => f.trim()).filter(Boolean),
      images: form.images ? form.images.split(",").map(i => i.trim()).filter(Boolean) : [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80"
      ],
      ownerId: currentUser?.id || "",
      availableRooms: Number(form.availableRooms), ac: form.ac, wifi: form.wifi, laundry: form.laundry,
    };

    if (isEdit && id) {
      updateHostel(id, hostelData);
      toast.success("Hostel updated!");
    } else {
      addHostel(hostelData);
      toast.success("Hostel added!");
    }
    navigate("/owner/dashboard");
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm text-foreground";

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8 max-w-2xl">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? "Edit" : "Add"} <span className="gradient-text">Hostel</span>
        </h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="Hostel name" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Location *</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} placeholder="Location" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Latitude</label>
              <input value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Longitude</label>
              <input value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Rent (₹/month) *</label>
              <input type="number" value={form.rent} onChange={e => setForm({...form, rent: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Available Rooms</label>
              <input type="number" value={form.availableRooms} onChange={e => setForm({...form, availableRooms: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Room Type</label>
              <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value as RoomType})} className={inputClass}>
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as Gender})} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Facilities (comma-separated)</label>
            <input value={form.facilities} onChange={e => setForm({...form, facilities: e.target.value})} className={inputClass} placeholder="Gym, Parking, CCTV" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Image URLs (comma-separated)</label>
            <input value={form.images} onChange={e => setForm({...form, images: e.target.value})} className={inputClass} placeholder="https://..." />
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { key: "foodAvailable" as const, label: "Food Available" },
              { key: "ac" as const, label: "AC" },
              { key: "wifi" as const, label: "WiFi" },
              { key: "laundry" as const, label: "Laundry" },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[item.key]} onChange={e => setForm({...form, [item.key]: e.target.checked})}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-foreground">{item.label}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="w-full gradient-btn text-center">
            {isEdit ? "Update Hostel" : "Add Hostel"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
