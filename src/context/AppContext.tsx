import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole, Hostel, Booking, BookingStatus } from "@/types";
import { mockUsers, mockHostels, mockBookings } from "@/data/mockData";

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const user = users.find(u => u.email === email && u.role === role);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }, [users]);

  const register = useCallback((name: string, email: string, _password: string, role: UserRole) => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: `u${Date.now()}`, name, email, role };
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
      id: `b${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      hostelId,
      hostelName: hostel.name,
      duration,
      totalAmount: hostel.rent * duration,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBookings(prev => [...prev, booking]);
  }, [currentUser, hostels]);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, hostels, bookings,
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
