
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Navbar } from "@/components/ui/navbar";
import { Plane, Calendar, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([
    { id: 1, flight: "AA123", date: "2025-05-01", status: "Confirmed", destination: "London", origin: "New York", departureTime: "08:30 AM" },
    { id: 2, flight: "BA456", date: "2025-05-15", status: "Confirmed", destination: "Paris", origin: "Berlin", departureTime: "12:45 PM" }
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleCancel = (id: number) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast.success("Booking cancelled successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] animate-gradient-x">
          Manage Your Bookings
        </h1>
        {bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-2 border-t-primary/20 hover:border-t-primary">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-xl">
                      <Plane className="mr-2 h-5 w-5 text-primary" />
                      Flight {booking.flight}
                    </CardTitle>
                    <Badge className={`px-3 py-1 ${booking.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {booking.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">From</p>
                      <p className="font-medium">{booking.origin}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">To</p>
                      <p className="font-medium">{booking.destination}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Departure Time</p>
                      <p className="font-medium">{booking.departureTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="transition-all duration-300 hover:scale-105 group-hover:shadow-md">
                          <X className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently cancel your booking for flight {booking.flight}.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleCancel(booking.id)}
                            className="bg-gradient-to-r from-[#ff719A] to-[#ff4455] hover:shadow-lg transition-all duration-300"
                          >
                            Confirm Cancellation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="transition-all duration-300 hover:scale-105 hover:border-primary group-hover:shadow-md">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plane className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground">
                You don't have any active bookings at the moment.
              </p>
              <Button className="mt-4 bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-lg transition-all duration-300">
                Book a Flight
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
