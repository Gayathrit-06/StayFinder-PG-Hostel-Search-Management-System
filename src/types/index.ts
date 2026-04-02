export type UserRole = "user" | "owner" | "admin";
export type BookingStatus = "Pending" | "Approved" | "Rejected";
export type RoomType = "Single" | "Shared";
export type Gender = "Male" | "Female" | "Any";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rent: number;
  roomType: RoomType;
  gender: Gender;
  foodAvailable: boolean;
  facilities: string[];
  images: string[];
  ownerId: string;
  availableRooms: number;
  ac: boolean;
  wifi: boolean;
  laundry: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  hostelId: string;
  hostelName: string;
  duration: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}
