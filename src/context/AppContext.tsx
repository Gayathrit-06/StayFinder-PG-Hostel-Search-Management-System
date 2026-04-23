import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { User, UserRole, Hostel, Booking, BookingStatus } from "@/types";
import { mockHostels, mockBookings } from "@/data/mockData";
import { HostelBST } from "@/lib/bst";
import { HostelAVL } from "@/lib/avl";
import { HostelHashMap } from "@/lib/hashmap";
import { Trie } from "@/lib/trie";

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
  // Data structure accessors
  getHostelById: (id: string) => Hostel | undefined;
  getHostelsByRentRange: (min: number, max: number) => Hostel[];
  getHostelsSortedByRent: () => Hostel[];
  searchLocations: (prefix: string) => string[];
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

  // === DATA STRUCTURES (rebuilt whenever hostels change) ===
  const bstRef = useRef<HostelBST>(HostelBST.fromArray(hostels));
  const avlRef = useRef<HostelAVL>(HostelAVL.fromArray(hostels));
  const hashMapRef = useRef<HostelHashMap>(HostelHashMap.fromArray(hostels));
  const locationTrieRef = useRef<Trie>(new Trie());

  // Rebuild all data structures when hostels change
  useEffect(() => {
    bstRef.current = HostelBST.fromArray(hostels);
    avlRef.current = HostelAVL.fromArray(hostels);
    hashMapRef.current = HostelHashMap.fromArray(hostels);

    // Rebuild location trie from current hostel locations
    const trie = new Trie();
    const seen = new Set<string>();
    hostels.forEach(h => {
      if (!seen.has(h.location)) {
        trie.insert(h.location);
        seen.add(h.location);
      }
    });
    locationTrieRef.current = trie;
  }, [hostels]);

  // Data structure accessor functions
  const getHostelById = useCallback((id: string): Hostel | undefined => {
    return hashMapRef.current.get(id); // O(1) HashMap lookup
  }, []);

  const getHostelsByRentRange = useCallback((min: number, max: number): Hostel[] => {
    return bstRef.current.filterByRent(min, max); // BST range search
  }, []);

  const getHostelsSortedByRent = useCallback((): Hostel[] => {
    return avlRef.current.getSortedByRent(); // AVL in-order traversal
  }, []);

  const searchLocations = useCallback((prefix: string): string[] => {
    return locationTrieRef.current.search(prefix); // Trie prefix search
  }, []);

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
    if (role === "admin") {
      const admin = ADMIN_ACCOUNTS.find(a => a.email === email && a.password === password);
      if (admin) { setCurrentUser(admin); return true; }
      return false;
    }
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }, [users]);

  const register = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (role === "admin") return false;
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, name, email, password, role };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }, []);

  const addHostel = useCallback((hostel: Omit<Hostel, "id">) => {
    const newHostel = { ...hostel, id: `h${Date.now()}` } as Hostel;
    setHostels(prev => {
      const next = [...prev, newHostel];
      localStorage.setItem("hostels", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateHostel = useCallback((id: string, data: Partial<Hostel>) => {
    setHostels(prev => {
      const next = prev.map(h => h.id === id ? { ...h, ...data } : h);
      localStorage.setItem("hostels", JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteHostel = useCallback((id: string) => {
    setHostels(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem("hostels", JSON.stringify(next));
      return next;
    });
    setBookings(prev => {
      const next = prev.filter(b => b.hostelId !== id);
      localStorage.setItem("bookings", JSON.stringify(next));
      return next;
    });
  }, []);

  const createBooking = useCallback((hostelId: string, duration: number) => {
    if (!currentUser) return;
    // Use HashMap for O(1) hostel lookup instead of array.find
    const hostel = hashMapRef.current.get(hostelId);
    if (!hostel) return;
    const booking: Booking = {
      id: `b${Date.now()}`, userId: currentUser.id, userName: currentUser.name,
      hostelId, hostelName: hostel.name, duration,
      totalAmount: hostel.rent * duration, status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings(prev => {
      const next = [...prev, booking];
      localStorage.setItem("bookings", JSON.stringify(next));
      return next;
    });
  }, [currentUser]);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === bookingId ? { ...b, status } : b);
      localStorage.setItem("bookings", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users: [...users, ...ADMIN_ACCOUNTS], hostels, bookings,
      login, register, logout,
      addHostel, updateHostel, deleteHostel,
      createBooking, updateBookingStatus,
      getHostelById, getHostelsByRentRange, getHostelsSortedByRent, searchLocations,
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
