
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AirlinePortal from "./pages/AirlinePortal";
import CargoPortal from "./pages/CargoPortal";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import BookingPage from "./pages/BookingPage"; 
import TrackingPage from "./pages/TrackingPage";
import ScheduleManagement from "./pages/ScheduleManagement";
import ManageBookings from "./pages/ManageBookings";
import BookFlightPage from "./pages/BookFlightPage";
import CargoTrackingDetailPage from "./pages/CargoTrackingDetailPage";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/airline" element={<AirlinePortal />} />
            <Route path="/cargo" element={<CargoPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/schedule-management" element={<ScheduleManagement />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/book-flight/:flightId" element={<BookFlightPage />} />
            <Route path="/cargo-tracking/:trackingId" element={<CargoTrackingDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
