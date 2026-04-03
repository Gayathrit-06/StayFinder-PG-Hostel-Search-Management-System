import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { locationTrie } from "@/lib/trie";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, IndianRupee, BedDouble, Users } from "lucide-react";
import { Gender, RoomType } from "@/types";

export default function CustomerSearch() {
  const { hostels } = useApp();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [gender, setGender] = useState<Gender | "">("");
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const handleLocationChange = (val: string) => {
    setLocation(val);
    setSuggestions(val.length > 0 ? locationTrie.search(val).slice(0, 6) : []);
  };

  const filtered = useMemo(() => {
    return hostels.filter(h => {
      if (location && !h.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (gender && h.gender !== gender && h.gender !== "Any") return false;
      if (roomType && h.roomType !== roomType) return false;
      if (minRent && h.rent < Number(minRent)) return false;
      if (maxRent && h.rent > Number(maxRent)) return false;
      return true;
    });
  }, [hostels, location, gender, roomType, minRent, maxRent]);

  return (
    <div className="page-container bg-background">
      <Navbar />
      <div className="content-container py-8">
        <h1 className="text-3xl font-bold mb-6">
          Find Your <span className="gradient-text">Perfect Stay</span>
        </h1>

        {/* Search Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={location} onChange={e => handleLocationChange(e.target.value)}
                placeholder="Location" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm text-foreground"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => { setLocation(s); setSuggestions([]); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select value={gender} onChange={e => setGender(e.target.value as Gender | "")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm appearance-none text-foreground">
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="relative">
              <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select value={roomType} onChange={e => setRoomType(e.target.value as RoomType | "")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm appearance-none text-foreground">
                <option value="">All Room Types</option>
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={minRent} onChange={e => setMinRent(e.target.value)}
                placeholder="Min Rent" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm text-foreground" />
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="number" value={maxRent} onChange={e => setMaxRent(e.target.value)}
                placeholder="Max Rent" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm text-foreground" />
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} hostels found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <div key={h.id} className="glass-card-hover overflow-hidden group cursor-pointer" onClick={() => navigate(`/customer/hostel/${h.id}`)}>
              <div className="relative h-48 overflow-hidden">
                <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  {h.gender}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-foreground mb-1">{h.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {h.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">₹{h.rent.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/month</span></span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{h.roomType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hostels match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
