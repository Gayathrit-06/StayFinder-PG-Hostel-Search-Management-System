import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./pages/AuthPage";
import CustomerSearch from "./pages/CustomerSearch";
import HostelDetails from "./pages/HostelDetails";
import CustomerBookings from "./pages/CustomerBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import HostelForm from "./pages/HostelForm";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login/:role" element={<AuthPage />} />
            <Route path="/customer/search" element={<CustomerSearch />} />
            <Route path="/customer/hostel/:id" element={<HostelDetails />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/add-hostel" element={<HostelForm />} />
            <Route path="/owner/edit-hostel/:id" element={<HostelForm />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
