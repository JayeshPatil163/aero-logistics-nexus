
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ManageBookings = () => {
  const [bookings] = useState([
    { id: 1, flight: "AA123", date: "2025-05-01", status: "Confirmed" },
    { id: 2, flight: "BA456", date: "2025-05-15", status: "Confirmed" }
  ]);

  const handleCancel = (id: number) => {
    toast.success("Booking cancelled successfully");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
        Manage Your Bookings
      </h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Flight {booking.flight}</CardTitle>
              <CardDescription>Date: {booking.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                {booking.status}
              </span>
              <Button 
                variant="destructive"
                onClick={() => handleCancel(booking.id)}
                className="transition-all duration-300 hover:scale-105"
              >
                Cancel Booking
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;
