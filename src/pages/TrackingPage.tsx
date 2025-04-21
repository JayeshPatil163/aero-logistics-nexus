
import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, CheckCircle, Truck, Plane, Ship, LocateFixed, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<null | boolean>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setTrackingResult(true);
      toast.success("Shipment found!");
    }, 1500);
  };

  const renderTrackingTimeline = () => {
    const steps = [
      { 
        title: "Order Placed", 
        date: "April 15, 2025 - 10:23 AM",
        location: "New York, USA",
        description: "Shipping label created",
        icon: Package,
        status: "completed" 
      },
      { 
        title: "Order Processed", 
        date: "April 15, 2025 - 3:45 PM",
        location: "New York, USA",
        description: "Package has been processed",
        icon: CheckCircle,
        status: "completed" 
      },
      { 
        title: "Pickup", 
        date: "April 16, 2025 - 9:30 AM",
        location: "New York Distribution Center, USA",
        description: "Package picked up by carrier",
        icon: Truck,
        status: "completed" 
      },
      { 
        title: "International Departure", 
        date: "April 17, 2025 - 11:45 AM",
        location: "JFK International Airport, USA",
        description: "Package departed from origin country",
        icon: Plane,
        status: "completed" 
      },
      { 
        title: "International Arrival", 
        date: "April 18, 2025 - 2:15 PM",
        location: "Heathrow Airport, UK",
        description: "Package arrived in destination country",
        icon: Plane,
        status: "completed" 
      },
      { 
        title: "Customs Clearance", 
        date: "April 19, 2025 - 8:30 AM",
        location: "London, UK",
        description: "Package cleared customs",
        icon: CheckCircle,
        status: "in-progress" 
      },
      { 
        title: "Local Shipment", 
        date: "Pending",
        location: "United Kingdom",
        description: "Package in transit to delivery center",
        icon: Truck,
        status: "upcoming" 
      },
      { 
        title: "Out for Delivery", 
        date: "Pending",
        location: "London, UK",
        description: "Package is out for delivery",
        icon: Truck,
        status: "upcoming" 
      },
      { 
        title: "Delivered", 
        date: "Pending",
        location: "London, UK",
        description: "Package has been delivered",
        icon: CheckCircle,
        status: "upcoming" 
      }
    ];

    return (
      <div className="relative space-y-8 p-4 overflow-hidden">
        {/* Timeline connector */}
        <div className="absolute top-10 bottom-0 left-[22px] w-0.5 bg-muted" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-4 group">
            <div 
              className={`z-10 flex items-center justify-center w-11 h-11 rounded-full shrink-0 
                ${step.status === 'completed' ? 'bg-primary text-primary-foreground' : 
                  step.status === 'in-progress' ? 'bg-accent text-accent-foreground animate-pulse' : 
                  'bg-muted text-muted-foreground'}`}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <div className={`flex flex-col gap-1 p-2 rounded-md transition-all duration-300 
              ${step.status === 'completed' ? 'opacity-100' : 
                step.status === 'in-progress' ? 'opacity-100 bg-secondary/50' : 
                'opacity-60 group-hover:opacity-100'}`}
            >
              <div className="flex flex-wrap items-center gap-1">
                <h4 className="font-medium">{step.title}</h4>
                <span className="text-xs text-muted-foreground ml-auto">{step.date}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{step.location}</span>
              </div>
              <p className="text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderShipmentDetails = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Package Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p>5.2 kg</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dimensions</p>
              <p>30 × 25 × 15 cm</p>
            </div>
            <div>
              <p className="text-muted-foreground">Service</p>
              <p>Express Air</p>
            </div>
            <div>
              <p className="text-muted-foreground">Items</p>
              <p>2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Delivery Information
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Estimated Delivery</p>
              <p>April 22, 2025</p>
            </div>
            <div>
              <p className="text-muted-foreground">Shipping Method</p>
              <p>International Air</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Status</p>
              <p className="text-accent font-medium">Customs Clearance</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p>1 hour ago</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-secondary/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <LocateFixed className="h-4 w-4 mr-2" />
            Route Information
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">From</p>
              <p className="font-medium">New York, USA</p>
              <p>123 Shipping Ave, NY 10001</p>
            </div>
            <div>
              <p className="text-muted-foreground">To</p>
              <p className="font-medium">London, UK</p>
              <p>456 Delivery St, London EC2A 4EU</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <Card className="shadow-lg animate-fade-in mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold inline-flex items-center justify-center">
                <LocateFixed className="h-6 w-6 mr-2 text-primary" />
                Track Your Shipment
              </CardTitle>
              <CardDescription>
                Enter your tracking number to get real-time updates on your shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tracking"
                      placeholder="e.g., CARGO-1234567890"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Tracking
                        </span>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Track
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a valid tracking number (For demo, any number works)
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {trackingResult && (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Shipment CARGO-{trackingNumber || "1234567890"}
                  </CardTitle>
                  <CardDescription>
                    International Express Shipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderShipmentDetails()}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Tracking Timeline
                  </CardTitle>
                  <CardDescription>
                    Real-time updates on your shipment's journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTrackingTimeline()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
