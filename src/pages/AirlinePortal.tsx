
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plane } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AIRLINES = [
  "Emirates", "Lufthansa", "Qatar Airways", "Singapore Airlines", 
  "Delta", "United", "British Airways", "Air France"
];

const AIRPORTS = [
  "JFK - New York", "LHR - London", "CDG - Paris", "DXB - Dubai", 
  "SIN - Singapore", "LAX - Los Angeles", "FRA - Frankfurt", "HND - Tokyo"
];

const generateFlights = () => {
  const flights = [];
  for (let i = 0; i < 50; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    const departure = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    
    let arrival;
    do {
      arrival = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    } while (arrival === departure);
    
    const departureTime = new Date();
    departureTime.setHours(Math.floor(Math.random() * 24));
    departureTime.setMinutes(Math.floor(Math.random() * 60));
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + Math.floor(1 + Math.random() * 14));
    
    const status = Math.random() > 0.8 ? "Delayed" : "On Time";
    const price = Math.floor(300 + Math.random() * 1500);
    
    flights.push({
      id: i,
      airline,
      flightNumber,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      status,
      gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1 + Math.random() * 20)}`,
      terminal: Math.floor(1 + Math.random() * 5),
      price,
      currency: "USD"
    });
  }
  return flights;
};

const FLIGHTS = generateFlights();

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const AirlinePortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [flights, setFlights] = useState(FLIGHTS);
  const [filteredFlights, setFilteredFlights] = useState(FLIGHTS);
  const [selectedAirline, setSelectedAirline] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  useEffect(() => {
    let result = [...flights];
    
    if (selectedAirline) {
      result = result.filter(flight => flight.airline === selectedAirline);
    }
    
    if (selectedDate) {
      result = result.filter(flight => {
        const flightDate = new Date(flight.departureTime);
        return (
          flightDate.getDate() === selectedDate.getDate() &&
          flightDate.getMonth() === selectedDate.getMonth() &&
          flightDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        flight =>
          flight.flightNumber.toLowerCase().includes(query) ||
          flight.departure.toLowerCase().includes(query) ||
          flight.arrival.toLowerCase().includes(query)
      );
    }
    
    setFilteredFlights(result);
  }, [flights, selectedAirline, selectedDate, searchQuery]);

  const handleBooking = (flight: any) => {
    if (!isLoggedIn) {
      toast.error("Please log in to book a flight");
      navigate("/login");
      return;
    }
    
    if (userRole === "admin") {
      toast.info("As an admin, you can manage schedules instead of booking");
      navigate("/schedule-management");
      return;
    }
    
    navigate(`/book-flight/${flight.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl gemini-gradient-text animate-gradient-x">
              Airline Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              View real-time flight schedules and book your next journey
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div className="space-y-6">
              <Card className="gemini-card">
                <CardHeader>
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                    Filter Flights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Airline</label>
                    <Select 
                      value={selectedAirline} 
                      onValueChange={(value) => setSelectedAirline(value)}
                    >
                      <SelectTrigger className="border-primary/20 focus:ring-primary/30">
                        <SelectValue placeholder="All Airlines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Airlines</SelectItem>
                        {AIRLINES.map((airline) => (
                          <SelectItem key={airline} value={airline}>
                            {airline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-primary/20 focus:ring-primary/30"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setSelectedDate(date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Flight number, airport..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-primary/20 focus:ring-primary/30"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/20 hover:bg-primary/5 transition-all duration-300" 
                    onClick={() => {
                      setSelectedAirline(undefined);
                      setSelectedDate(new Date());
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Tabs defaultValue="departures">
                <div className="flex justify-between items-center">
                  <TabsList className="bg-secondary">
                    <TabsTrigger value="departures" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Departures
                    </TabsTrigger>
                    <TabsTrigger value="arrivals" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Arrivals
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredFlights.length} flights
                  </div>
                </div>
                
                <TabsContent value="departures" className="animate-fade-in">
                  <Card className="gemini-card">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead>Flight</TableHead>
                            <TableHead>Airline</TableHead>
                            <TableHead>Departure</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFlights.length > 0 ? (
                            filteredFlights.map((flight) => (
                              <TableRow key={flight.id} className="group hover:bg-muted/50 transition-colors cursor-default gemini-hover-effect">
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Plane className="h-4 w-4 mr-2 text-primary" />
                                    {flight.flightNumber}
                                  </div>
                                </TableCell>
                                <TableCell>{flight.airline}</TableCell>
                                <TableCell>
                                  <div className="font-medium">{flight.departure.split(" - ")[0]}</div>
                                  <div className="text-xs text-muted-foreground">{flight.departure.split(" - ")[1]}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{flight.arrival.split(" - ")[0]}</div>
                                  <div className="text-xs text-muted-foreground">{flight.arrival.split(" - ")[1]}</div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {formatTime(flight.departureTime)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Terminal {flight.terminal}, Gate {flight.gate}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    flight.status === "On Time" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {flight.status}
                                  </span>
                                </TableCell>
                                <TableCell className="font-medium text-primary">
                                  ${flight.price}
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleBooking(flight)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-md"
                                  >
                                    Book
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="h-24 text-center">
                                No flights found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="arrivals" className="animate-fade-in">
                  <Card className="gemini-card">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead>Flight</TableHead>
                            <TableHead>Airline</TableHead>
                            <TableHead>Origin</TableHead>
                            <TableHead>Arrival</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFlights.length > 0 ? (
                            filteredFlights.map((flight) => (
                              <TableRow key={flight.id} className="group hover:bg-muted/50 transition-colors cursor-default gemini-hover-effect">
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Plane className="h-4 w-4 mr-2 text-primary" />
                                    {flight.flightNumber}
                                  </div>
                                </TableCell>
                                <TableCell>{flight.airline}</TableCell>
                                <TableCell>
                                  <div className="font-medium">{flight.departure.split(" - ")[0]}</div>
                                  <div className="text-xs text-muted-foreground">{flight.departure.split(" - ")[1]}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{flight.arrival.split(" - ")[0]}</div>
                                  <div className="text-xs text-muted-foreground">{flight.arrival.split(" - ")[1]}</div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {formatTime(flight.arrivalTime)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Terminal {flight.terminal}, Gate {flight.gate}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    flight.status === "On Time" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {flight.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleBooking(flight)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-md"
                                  >
                                    Book
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No flights found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card className="gemini-card overflow-hidden animate-float">
                <CardHeader className="bg-gradient-to-r from-[#9b87f5]/10 to-[#33C3F0]/10">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                    Matrix Flight Network
                  </CardTitle>
                  <CardDescription>
                    Interactive visualization of global flight connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] rounded-md border bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] text-green-500 p-4 font-mono text-sm overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="grid grid-cols-12 gap-1 w-full h-full">
                        {Array.from({ length: 12 * 20 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="animate-matrix-rain" 
                            style={{ 
                              animationDelay: `${Math.random() * 3}s`,
                              animationDuration: `${2 + Math.random() * 4}s`
                            }}
                          >
                            {Math.random() > 0.5 ? '1' : '0'}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div>GLOBAL FLIGHT NETWORK // ACTIVE NODES: {AIRLINES.length}</div>
                      <div>TRACKING FLIGHTS: {filteredFlights.length} / {flights.length}</div>
                      <div>SYSTEM STATUS: ONLINE</div>
                      <div className="mt-4">
                        {AIRLINES.map((airline, i) => (
                          <div key={i} className="flex items-center text-xs my-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                            <span className="mr-2">{airline}</span>
                            <span className="text-green-300">
                              {Math.floor(Math.random() * 100)}% CAPACITY
                            </span>
                            <span className="ml-auto">
                              {Math.floor(Math.random() * 50)} ACTIVE FLIGHTS
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-green-900 pt-2">
                        NEXUS TERMINAL CONNECTED // DATA STREAM ACTIVE
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <Plane className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">AIRCARGO</p>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 AIRCARGO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AirlinePortal;
