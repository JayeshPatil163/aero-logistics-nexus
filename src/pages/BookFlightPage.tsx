
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plane, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Check, 
  Info, 
  Users 
} from "lucide-react";

// Form schema
const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().min(5, "Passport number is required"),
  passportExpiry: z.string().min(1, "Passport expiry date is required"),
  seatPreference: z.string().optional(),
  mealPreference: z.string().optional(),
  addBaggage: z.boolean().default(false),
  insurance: z.boolean().default(false),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

const BookFlightPage = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Flight details from state or mock if not provided
  const flightDetails = location.state?.flight || {
    id: flightId || "FL123",
    airline: "Emirates",
    flightNumber: "EK203",
    departure: "JFK - New York",
    arrival: "DXB - Dubai",
    departureTime: new Date(),
    arrivalTime: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
    price: 1250,
    currency: "USD",
    duration: "12h 15m",
    class: "Economy",
    aircraft: "Boeing 777-300ER",
    status: "On Time",
  };

  // Form setup
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      nationality: "",
      passportNumber: "",
      passportExpiry: "",
      seatPreference: "window",
      mealPreference: "standard",
      addBaggage: false,
      insurance: false,
      acceptTerms: false,
    },
  });

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const onSubmit = (data: z.infer<typeof bookingFormSchema>) => {
    setIsProcessing(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Booking successful! Your e-ticket has been sent to your email.");
      navigate("/manage-bookings");
    }, 2000);
  };

  const renderSeatMap = () => (
    <div className="border rounded-md p-4 bg-background/50">
      <h3 className="text-lg font-semibold mb-4">Select Your Seat</h3>
      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-16">
          <div className="flex flex-col">
            <span className="text-sm text-center mb-2">Window</span>
            <div className="grid grid-rows-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(row => (
                <button 
                  key={`A${row}`}
                  className="w-10 h-10 rounded-md border border-gray-300 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  A{row}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-center mb-2">Middle</span>
            <div className="grid grid-rows-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(row => (
                <button 
                  key={`B${row}`}
                  className="w-10 h-10 rounded-md border border-gray-300 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  B{row}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-center mb-2">Aisle</span>
            <div className="grid grid-rows-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(row => (
                <button 
                  key={`C${row}`}
                  className={`w-10 h-10 rounded-md border ${row === 3 ? 'bg-gray-200 cursor-not-allowed' : 'border-gray-300 hover:bg-primary/20'} focus:outline-none focus:ring-2 focus:ring-primary transition-colors`}
                  disabled={row === 3}
                >
                  C{row}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-gray-300 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary/20 border border-primary rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] animate-gradient-x">
              Book Your Flight
            </h1>
            <p className="text-muted-foreground mb-6">
              Complete your booking for {flightDetails.airline} flight {flightDetails.flightNumber}
            </p>

            <div className="mb-8">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    1
                  </div>
                  <span className={`font-medium ${currentStep === 1 ? 'text-primary' : ''}`}>Flight Details</span>
                  <div className="flex-grow border-t border-border"></div>
                  
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    2
                  </div>
                  <span className={`font-medium ${currentStep === 2 ? 'text-primary' : ''}`}>Passenger Information</span>
                  <div className="flex-grow border-t border-border"></div>
                  
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    3
                  </div>
                  <span className={`font-medium ${currentStep === 3 ? 'text-primary' : ''}`}>Payment</span>
                </div>
              </div>

              {currentStep === 1 && (
                <Card className="mb-6 overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl font-bold flex items-center">
                          <Plane className="mr-2 h-5 w-5 text-primary" />
                          {flightDetails.airline} {flightDetails.flightNumber}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(flightDetails.departureTime)} • {flightDetails.class} Class
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {flightDetails.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-9 items-center">
                      <div className="col-span-4">
                        <div className="space-y-1">
                          <p className="text-2xl font-semibold">{formatTime(flightDetails.departureTime)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(flightDetails.departureTime)}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <p className="font-medium">{flightDetails.departure}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center">
                        <div className="w-full border-t border-dashed border-primary/40 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-full p-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{flightDetails.duration}</span>
                      </div>
                      
                      <div className="col-span-4">
                        <div className="space-y-1">
                          <p className="text-2xl font-semibold">{formatTime(flightDetails.arrivalTime)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(flightDetails.arrivalTime)}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <p className="font-medium">{flightDetails.arrival}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Aircraft</p>
                        <p className="font-medium">{flightDetails.aircraft}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Flight Duration</p>
                        <p className="font-medium">{flightDetails.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Class</p>
                        <p className="font-medium">{flightDetails.class}</p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="mt-6">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Flight Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Baggage Allowance</p>
                              <p className="text-sm">Checked: 1 x 23kg, Carry-on: 1 x 7kg</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">In-flight Services</p>
                              <p className="text-sm">Complimentary meals, Wi-Fi available</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Check-in</p>
                              <p className="text-sm">Online check-in available 48 hours before departure</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Fare Conditions</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Date change allowed (fee applies)</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm">Cancellation allowed (fee applies)</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Info className="h-4 w-4 text-primary" />
                              <p className="text-sm">Non-refundable fare</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="bg-muted/30 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Fare per passenger:</p>
                      <p className="text-xl font-bold">{flightDetails.currency} {flightDetails.price.toFixed(2)}</p>
                    </div>
                    <Button onClick={handleNextStep} className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-lg transition-all duration-300">
                      Continue to Passenger Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {currentStep === 2 && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
                    <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="mr-2 h-5 w-5 text-primary" />
                          Passenger Information
                        </CardTitle>
                        <CardDescription>
                          Enter details as they appear on your passport or ID
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your nationality" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                    <SelectItem value="fr">France</SelectItem>
                                    <SelectItem value="de">Germany</SelectItem>
                                    <SelectItem value="in">India</SelectItem>
                                    <SelectItem value="jp">Japan</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="passportNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Passport Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="AB1234567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="passportExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Passport Expiry Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Travel Preferences</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="seatPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Seat Preference</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your seat preference" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="window">Window</SelectItem>
                                      <SelectItem value="aisle">Aisle</SelectItem>
                                      <SelectItem value="middle">Middle</SelectItem>
                                      <SelectItem value="no-preference">No Preference</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mealPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meal Preference</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your meal preference" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="standard">Standard</SelectItem>
                                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                      <SelectItem value="vegan">Vegan</SelectItem>
                                      <SelectItem value="diabetic">Diabetic</SelectItem>
                                      <SelectItem value="gluten-free">Gluten Free</SelectItem>
                                      <SelectItem value="kosher">Kosher</SelectItem>
                                      <SelectItem value="halal">Halal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {renderSeatMap()}

                          <div className="space-y-4 mt-6">
                            <h3 className="text-lg font-medium">Add-ons</h3>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="addBaggage"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Extra Baggage</FormLabel>
                                      <FormDescription>
                                        Add an extra 23kg checked baggage (+$50)
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="insurance"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Travel Insurance</FormLabel>
                                      <FormDescription>
                                        Comprehensive travel insurance coverage (+$35)
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I accept the <a href="#" className="text-primary underline">terms and conditions</a>
                                  </FormLabel>
                                  <FormDescription>
                                    By checking this box, you agree to our Terms of Service and Privacy Policy.
                                  </FormDescription>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/30">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handlePreviousStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-lg transition-all duration-300"
                        >
                          Continue to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              )}

              {currentStep === 3 && (
                <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      Payment
                    </CardTitle>
                    <CardDescription>
                      Complete your payment to finalize your booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="card" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="card">Credit Card</TabsTrigger>
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                        <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="p-4 space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" placeholder="John Doe" />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input id="expiryDate" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="paypal" className="p-4 text-center">
                        <div className="py-8">
                          <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                          <Button className="bg-[#0070BA] hover:bg-[#003087] transition-colors">
                            Pay with PayPal
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="apple" className="p-4 text-center">
                        <div className="py-8">
                          <p className="mb-4">Complete your payment securely with Apple Pay.</p>
                          <Button className="bg-black hover:bg-gray-800 transition-colors">
                            Pay with Apple Pay
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-secondary/30">
                        <h3 className="font-medium">Order Summary</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Base Fare</span>
                            <span>{flightDetails.currency} {flightDetails.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>{flightDetails.currency} {(flightDetails.price * 0.12).toFixed(2)}</span>
                          </div>
                          {form.getValues().addBaggage && (
                            <div className="flex justify-between">
                              <span>Extra Baggage</span>
                              <span>{flightDetails.currency} 50.00</span>
                            </div>
                          )}
                          {form.getValues().insurance && (
                            <div className="flex justify-between">
                              <span>Travel Insurance</span>
                              <span>{flightDetails.currency} 35.00</span>
                            </div>
                          )}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-primary">{flightDetails.currency} {(
                                flightDetails.price + 
                                (flightDetails.price * 0.12) + 
                                (form.getValues().addBaggage ? 50 : 0) + 
                                (form.getValues().insurance ? 35 : 0)
                              ).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/30">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousStep}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={onSubmit}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-lg transition-all duration-300"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Booking
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24 border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="text-lg">Your Booking</CardTitle>
                <CardDescription>
                  {flightDetails.airline} {flightDetails.flightNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Plane className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">{flightDetails.departure.split(" - ")[0]}</span>
                      </div>
                      <span className="text-sm">{formatTime(flightDetails.departureTime)}</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-12 bg-primary/20"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Plane className="h-4 w-4 mr-2 text-primary transform rotate-90" />
                        <span className="font-medium">{flightDetails.arrival.split(" - ")[0]}</span>
                      </div>
                      <span className="text-sm">{formatTime(flightDetails.arrivalTime)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Date</span>
                        <span>{formatDate(flightDetails.departureTime)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Duration</span>
                        <span>{flightDetails.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Passengers</span>
                        <span>1 Adult</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Class</span>
                        <span>{flightDetails.class}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Total Price</span>
                        <span className="font-bold text-xl">{flightDetails.currency} {(
                          flightDetails.price + 
                          (flightDetails.price * 0.12) + 
                          (form.getValues().addBaggage ? 50 : 0) + 
                          (form.getValues().insurance ? 35 : 0)
                        ).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Includes taxes and all applicable fees
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex flex-col items-start px-4 py-4 space-y-4">
                <div className="bg-primary/5 rounded-md p-3 text-sm w-full">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Need Help?
                  </h4>
                  <p className="text-muted-foreground">
                    Our customer service is available 24/7 to assist you with your booking.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary mt-2">
                    Contact Support
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlightPage;
