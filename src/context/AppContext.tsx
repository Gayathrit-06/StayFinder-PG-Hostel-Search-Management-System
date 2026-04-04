import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, UserRole, Hostel, Booking, BookingStatus } from "@/types";
import { mockHostels, mockBookings } from "@/data/mockData";

const ADMIN_ACCOUNTS: User[] = [
  { id: "a1", name: "Admin One", email: "admin1@gmail.com", password: "admin123", role: "admin" },
  { id: "a2", name: "Admin Two", email: "admin2@gmail.com", password: "admin456", role: "admin" },
  { id: "a3", name: "Admin Three", email: "admin3@gmail.com", password: "admin789", role: "admin" },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  hostels: Hostel[];
  bookings: Booking[];
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  addHostel: (hostel: Omit<Hostel, "id">) => void;
  updateHostel: (id: string, hostel: Partial<Hostel>) => void;
  deleteHostel: (id: string) => void;
  createBooking: (hostelId: string, duration: number) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    loadFromStorage("currentUser", null)
  );
  const [users, setUsers] = useState<User[]>(
    loadFromStorage("users", [])
  );
  const [hostels, setHostels] = useState<Hostel[]>(() => {
    const stored = loadFromStorage<Hostel[]>("hostels", []);
    return stored.length > 0 ? stored : mockHostels;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = loadFromStorage<Booking[]>("bookings", []);
    return stored.length > 0 ? stored : mockBookings;
  });

  // Sync to localStorage whenever state changes
  useEffect(() => { localStorage.setItem("users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("hostels", JSON.stringify(hostels)); }, [hostels]);
  useEffect(() => { localStorage.setItem("bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hostels" && e.newValue) {
        setHostels(JSON.parse(e.newValue));
      }
      if (e.key === "bookings" && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback((email: string, password: string, role: UserRole) => {
    // Admin login: check predefined accounts only
    if (role === "admin") {
      const admin = ADMIN_ACCOUNTS.find(a => a.email === email && a.password === password);
      if (admin) { setCurrentUser(admin); return true; }
      return false;
    }
    // Customer/Owner: check registered users in localStorage
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }, [users]);

  const register = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (role === "admin") return false; // no admin registration
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, name, email, password, role };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const addHostel = useCallback((hostel: Omit<Hostel, "id">) => {
    setHostels(prev => [...prev, { ...hostel, id: `h${Date.now()}` }]);
  }, []);

  const updateHostel = useCallback((id: string, data: Partial<Hostel>) => {
    setHostels(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  }, []);

  const deleteHostel = useCallback((id: string) => {
    setHostels(prev => prev.filter(h => h.id !== id));
    setBookings(prev => prev.filter(b => b.hostelId !== id));
  }, []);

  const createBooking = useCallback((hostelId: string, duration: number) => {
    if (!currentUser) return;
    const hostel = hostels.find(h => h.id === hostelId);
    if (!hostel) return;
    const booking: Booking = {
      id: `b${Date.now()}`, userId: currentUser.id, userName: currentUser.name,
      hostelId, hostelName: hostel.name, duration,
      totalAmount: hostel.rent * duration, status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings(prev => [...prev, booking]);
  }, [currentUser, hostels]);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users: [...users, ...ADMIN_ACCOUNTS], hostels, bookings,
      login, register, logout,
      addHostel, updateHostel, deleteHostel,
      createBooking, updateBookingStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
