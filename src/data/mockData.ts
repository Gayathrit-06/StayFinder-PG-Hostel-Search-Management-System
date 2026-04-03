import { Hostel, User, Booking } from "@/types";

const HOSTEL_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
];

export const mockUsers: User[] = [
  { id: "u1", name: "Rahul Kumar", email: "rahul@test.com", password: "rahul123", role: "user" },
  { id: "u2", name: "Priya Sharma", email: "priya@test.com", password: "priya123", role: "user" },
  { id: "o1", name: "Suresh Reddy", email: "suresh@owner.com", password: "suresh123", role: "owner" },
  { id: "o2", name: "Meena Devi", email: "meena@owner.com", password: "meena123", role: "owner" },
  { id: "a1", name: "Admin One", email: "admin1@gmail.com", password: "admin123", role: "admin" },
  { id: "a2", name: "Admin Two", email: "admin2@gmail.com", password: "admin456", role: "admin" },
  { id: "a3", name: "Admin Three", email: "admin3@gmail.com", password: "admin789", role: "admin" },
];

export const mockHostels: Hostel[] = [
  {
    id: "h1", name: "Sunrise PG for Men", location: "Guindy", latitude: 13.0067, longitude: 80.2206,
    rent: 7500, roomType: "Shared", gender: "Male", foodAvailable: true,
    facilities: ["Gym", "Parking", "Study Room", "CCTV"], images: [HOSTEL_IMAGES[0], HOSTEL_IMAGES[1]],
    ownerId: "o1", availableRooms: 5, ac: true, wifi: true, laundry: true,
  },
  {
    id: "h2", name: "Blossom Ladies Hostel", location: "Anna Nagar", latitude: 13.0850, longitude: 80.2101,
    rent: 8500, roomType: "Single", gender: "Female", foodAvailable: true,
    facilities: ["Library", "Rooftop Garden", "CCTV", "Power Backup"], images: [HOSTEL_IMAGES[2], HOSTEL_IMAGES[3]],
    ownerId: "o1", availableRooms: 3, ac: true, wifi: true, laundry: false,
  },
  {
    id: "h3", name: "Green Valley PG", location: "Velachery", latitude: 12.9815, longitude: 80.2180,
    rent: 5500, roomType: "Shared", gender: "Male", foodAvailable: false,
    facilities: ["Parking", "Water Purifier"], images: [HOSTEL_IMAGES[4], HOSTEL_IMAGES[5]],
    ownerId: "o2", availableRooms: 8, ac: false, wifi: true, laundry: true,
  },
  {
    id: "h4", name: "Elite Women's Hostel", location: "T. Nagar", latitude: 13.0418, longitude: 80.2341,
    rent: 9500, roomType: "Single", gender: "Female", foodAvailable: true,
    facilities: ["Gym", "Library", "Terrace", "CCTV", "Laundry"], images: [HOSTEL_IMAGES[6], HOSTEL_IMAGES[7]],
    ownerId: "o2", availableRooms: 2, ac: true, wifi: true, laundry: true,
  },
  {
    id: "h5", name: "Metro Stay PG", location: "Koramangala", latitude: 12.9352, longitude: 77.6245,
    rent: 6500, roomType: "Shared", gender: "Male", foodAvailable: true,
    facilities: ["Parking", "TV Room", "Kitchen"], images: [HOSTEL_IMAGES[0], HOSTEL_IMAGES[6]],
    ownerId: "o1", availableRooms: 6, ac: false, wifi: true, laundry: false,
  },
  {
    id: "h6", name: "Sakura Women's PG", location: "Adyar", latitude: 13.0012, longitude: 80.2565,
    rent: 10000, roomType: "Single", gender: "Female", foodAvailable: true,
    facilities: ["Swimming Pool", "Gym", "Library", "CCTV"], images: [HOSTEL_IMAGES[2], HOSTEL_IMAGES[4]],
    ownerId: "o2", availableRooms: 4, ac: true, wifi: true, laundry: true,
  },
];

export const mockBookings: Booking[] = [
  { id: "b1", userId: "u1", userName: "Rahul Kumar", hostelId: "h1", hostelName: "Sunrise PG for Men", duration: 3, totalAmount: 22500, status: "Approved", createdAt: "2025-12-01" },
  { id: "b2", userId: "u2", userName: "Priya Sharma", hostelId: "h2", hostelName: "Blossom Ladies Hostel", duration: 6, totalAmount: 51000, status: "Pending", createdAt: "2026-01-15" },
  { id: "b3", userId: "u1", userName: "Rahul Kumar", hostelId: "h3", hostelName: "Green Valley PG", duration: 1, totalAmount: 5500, status: "Rejected", createdAt: "2026-02-10" },
];
