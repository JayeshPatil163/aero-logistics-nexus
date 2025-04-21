
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarPlus, Plane, Clock, User, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setBookingComplete(true);
        toast.success("Booking confirmed successfully!");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    navigate("/airline");
  };

  const renderStep = () => {
    if (bookingComplete) {
      return (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
          <p className="text-muted-foreground">
            Your booking has been confirmed. Booking reference: <span className="font-bold text-primary">ABC123456</span>
          </p>
          <div className="p-4 bg-secondary/50 rounded-lg w-full max-w-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flight</p>
                <p className="font-medium">LH 723</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">May 15, 2025</p>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">New York (JFK)</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">London (LHR)</p>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Passenger</p>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">Economy</p>
              </div>
            </div>
          </div>
          <Button onClick={handleFinish} className="mt-4 w-full max-w-md bg-primary hover:bg-primary/90">
            Return to Airline Portal
          </Button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Select defaultValue="jfk">
                  <SelectTrigger id="from">
                    <SelectValue placeholder="Select airport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jfk">New York (JFK)</SelectItem>
                    <SelectItem value="lax">Los Angeles (LAX)</SelectItem>
                    <SelectItem value="sfo">San Francisco (SFO)</SelectItem>
                    <SelectItem value="ord">Chicago (ORD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Select defaultValue="lhr">
                  <SelectTrigger id="to">
                    <SelectValue placeholder="Select airport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lhr">London (LHR)</SelectItem>
                    <SelectItem value="cdg">Paris (CDG)</SelectItem>
                    <SelectItem value="fra">Frankfurt (FRA)</SelectItem>
                    <SelectItem value="ams">Amsterdam (AMS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure">Departure Date</Label>
                <div className="relative">
                  <Input id="departure" type="date" defaultValue="2025-05-15" />
                  <CalendarPlus className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="return">Return Date (Optional)</Label>
                <div className="relative">
                  <Input id="return" type="date" defaultValue="2025-05-22" />
                  <CalendarPlus className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select defaultValue="economy">
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="passengers">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Passenger</SelectItem>
                    <SelectItem value="2">2 Passengers</SelectItem>
                    <SelectItem value="3">3 Passengers</SelectItem>
                    <SelectItem value="4">4+ Passengers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Lufthansa</span>
                    <span className="text-sm text-muted-foreground">LH 723</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">$789</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Departure</p>
                    <p className="font-medium">08:15 AM</p>
                    <p className="text-xs text-muted-foreground">May 15, JFK</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full border-t border-dashed border-muted-foreground relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">7h 35m</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Arrival</p>
                    <p className="font-medium">03:50 PM</p>
                    <p className="text-xs text-muted-foreground">May 15, LHR</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      Economy
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Flight Details
                  </Button>
                </div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <span className="font-semibold">British Airways</span>
                    <span className="text-sm text-muted-foreground">BA 112</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">$815</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Departure</p>
                    <p className="font-medium">10:30 AM</p>
                    <p className="text-xs text-muted-foreground">May 15, JFK</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full border-t border-dashed border-muted-foreground relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">7h 10m</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Arrival</p>
                    <p className="font-medium">05:40 PM</p>
                    <p className="text-xs text-muted-foreground">May 15, LHR</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      Economy
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Flight Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input id="name" placeholder="John Doe" />
                <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card">Credit Card Number</Label>
              <div className="relative">
                <Input id="card" placeholder="4111 1111 1111 1111" />
                <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>$700.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & fees</span>
                  <span>$89.00</span>
                </div>
                <div className="border-t border-muted-foreground/20 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$789.00</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Airline Ticket Booking</CardTitle>
                <CardDescription className="text-center">
                  {!bookingComplete && `Step ${step} of 3: ${
                    step === 1 ? "Flight Details" : step === 2 ? "Select Flight" : "Passenger Information"
                  }`}
                </CardDescription>
                {!bookingComplete && (
                  <div className="flex justify-center space-x-2 mt-4">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`w-12 h-1 rounded-full ${
                          s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
                        }`}
                      ></div>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>{renderStep()}</CardContent>
              {!bookingComplete && (
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1 || loading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : step < 3 ? (
                      "Next"
                    ) : (
                      "Complete Booking"
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
