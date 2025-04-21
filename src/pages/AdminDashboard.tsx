
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
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Plane, Truck, Plus, Calendar, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

// Reusing the mock data from both portals
const AIRLINES = [
  "Emirates", "Lufthansa", "Qatar Airways", "Singapore Airlines", 
  "Delta", "United", "British Airways", "Air France"
];

const AIRPORTS = [
  "JFK - New York", "LHR - London", "CDG - Paris", "DXB - Dubai", 
  "SIN - Singapore", "LAX - Los Angeles", "FRA - Frankfurt", "HND - Tokyo"
];

const CARGO_COMPANIES = [
  "DHL", "FedEx", "UPS", "Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"
];

const LOCATIONS = [
  "New York, USA", "Shanghai, China", "Rotterdam, Netherlands", "Singapore", 
  "Dubai, UAE", "Los Angeles, USA", "Hamburg, Germany", "Tokyo, Japan"
];

const CARGO_TYPES = [
  "General Cargo", "Container", "Bulk", "Refrigerated", "Hazardous", "Vehicles", "Electronics", "Perishables"
];

// Generate flights for the table
const generateFlights = () => {
  const flights = [];
  for (let i = 0; i < 20; i++) {
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
      terminal: Math.floor(1 + Math.random() * 5)
    });
  }
  return flights;
};

// Generate shipments for the table
const generateShipments = () => {
  const shipments = [];
  
  for (let i = 0; i < 20; i++) {
    const company = CARGO_COMPANIES[Math.floor(Math.random() * CARGO_COMPANIES.length)];
    const trackingNumber = `${company.substring(0, 3).toUpperCase()}${Math.floor(1000000 + Math.random() * 9000000)}`;
    const origin = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    
    let destination;
    do {
      destination = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    } while (destination === origin);
    
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() - Math.floor(Math.random() * 10));
    
    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(arrivalDate.getDate() + Math.floor(3 + Math.random() * 28));
    
    const weight = Math.floor(100 + Math.random() * 20000) / 10;
    const volume = Math.floor(10 + Math.random() * 100);
    const cargoType = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
    
    const statuses = ["Scheduled", "In Transit", "Customs Clearance", "Delivered"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    shipments.push({
      id: i,
      company,
      trackingNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
      status,
      weight,
      volume,
      cargoType,
      vessel: `${company} ${Math.floor(100 + Math.random() * 900)}`,
      containerId: `CONT${Math.floor(1000000 + Math.random() * 9000000)}`
    });
  }
  
  return shipments;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  return format(date, "dd MMM yyyy");
};

const AdminDashboard = () => {
  const [flights, setFlights] = useState(generateFlights());
  const [shipments, setShipments] = useState(generateShipments());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // New flight/shipment form state
  const [newFlight, setNewFlight] = useState({
    airline: AIRLINES[0],
    flightNumber: "",
    departure: AIRPORTS[0],
    arrival: AIRPORTS[1],
    departureTime: "",
    arrivalTime: "",
    status: "On Time",
    gate: "A1",
    terminal: "1"
  });
  
  const [newShipment, setNewShipment] = useState({
    company: CARGO_COMPANIES[0],
    trackingNumber: "",
    origin: LOCATIONS[0],
    destination: LOCATIONS[1],
    departureDate: "",
    arrivalDate: "",
    status: "Scheduled",
    weight: "1000",
    volume: "10",
    cargoType: CARGO_TYPES[0],
    vessel: "",
    containerId: ""
  });

  useEffect(() => {
    // Check if user is logged in and is admin
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    
    setIsLoggedIn(loggedIn);
    setUserRole(role);
    
    // Redirect if not admin
    if (!loggedIn || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Handle adding a new flight
  const handleAddFlight = () => {
    // Generate a random ID
    const id = flights.length > 0 ? Math.max(...flights.map(f => f.id)) + 1 : 0;
    
    // Create departure and arrival times
    const departureTime = new Date();
    const [departHours, departMinutes] = newFlight.departureTime.split(":").map(Number);
    departureTime.setHours(departHours, departMinutes);
    
    const arrivalTime = new Date();
    const [arriveHours, arriveMinutes] = newFlight.arrivalTime.split(":").map(Number);
    arrivalTime.setHours(arriveHours, arriveMinutes);
    
    // Create new flight object
    const flight = {
      id,
      airline: newFlight.airline,
      flightNumber: newFlight.flightNumber,
      departure: newFlight.departure,
      arrival: newFlight.arrival,
      departureTime,
      arrivalTime,
      status: newFlight.status,
      gate: newFlight.gate,
      terminal: parseInt(newFlight.terminal)
    };
    
    // Add to flights array
    setFlights([flight, ...flights]);
    
    // Reset form
    setNewFlight({
      airline: AIRLINES[0],
      flightNumber: "",
      departure: AIRPORTS[0],
      arrival: AIRPORTS[1],
      departureTime: "",
      arrivalTime: "",
      status: "On Time",
      gate: "A1",
      terminal: "1"
    });
  };
  
  // Handle adding a new shipment
  const handleAddShipment = () => {
    // Generate a random ID
    const id = shipments.length > 0 ? Math.max(...shipments.map(s => s.id)) + 1 : 0;
    
    // Create departure and arrival dates
    const departureDate = new Date(newShipment.departureDate);
    const arrivalDate = new Date(newShipment.arrivalDate);
    
    // Create new shipment object
    const shipment = {
      id,
      company: newShipment.company,
      trackingNumber: newShipment.trackingNumber,
      origin: newShipment.origin,
      destination: newShipment.destination,
      departureDate,
      arrivalDate,
      status: newShipment.status,
      weight: parseFloat(newShipment.weight),
      volume: parseFloat(newShipment.volume),
      cargoType: newShipment.cargoType,
      vessel: newShipment.vessel,
      containerId: newShipment.containerId
    };
    
    // Add to shipments array
    setShipments([shipment, ...shipments]);
    
    // Reset form
    setNewShipment({
      company: CARGO_COMPANIES[0],
      trackingNumber: "",
      origin: LOCATIONS[0],
      destination: LOCATIONS[1],
      departureDate: "",
      arrivalDate: "",
      status: "Scheduled",
      weight: "1000",
      volume: "10",
      cargoType: CARGO_TYPES[0],
      vessel: "",
      containerId: ""
    });
  };
  
  // Handle updating flight status
  const updateFlightStatus = (id: number, newStatus: string) => {
    setFlights(
      flights.map(flight => 
        flight.id === id ? { ...flight, status: newStatus } : flight
      )
    );
  };
  
  // Handle updating shipment status
  const updateShipmentStatus = (id: number, newStatus: string) => {
    setShipments(
      shipments.map(shipment => 
        shipment.id === id ? { ...shipment, status: newStatus } : shipment
      )
    );
  };
  
  // Handle deleting a flight
  const deleteFlight = (id: number) => {
    setFlights(flights.filter(flight => flight.id !== id));
  };
  
  // Handle deleting a shipment
  const deleteShipment = (id: number) => {
    setShipments(shipments.filter(shipment => shipment.id !== id));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage airline and cargo schedules
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-800">
                Admin Mode
              </Badge>
            </div>
          </div>
          
          <Tabs defaultValue="airline">
            <TabsList>
              <TabsTrigger value="airline" className="flex items-center gap-1">
                <Plane className="h-4 w-4" />
                Airline Management
              </TabsTrigger>
              <TabsTrigger value="cargo" className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Cargo Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="airline" className="space-y-4 animate-fade-in animation-fill-mode-forwards">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Flight Schedules</CardTitle>
                    <CardDescription>
                      Add, edit and manage airline schedules
                    </CardDescription>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-8 gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Add Flight
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Flight</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new flight schedule.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="airline">Airline</Label>
                            <Select 
                              value={newFlight.airline}
                              onValueChange={(value) => setNewFlight({...newFlight, airline: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AIRLINES.map((airline) => (
                                  <SelectItem key={airline} value={airline}>
                                    {airline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="flightNumber">Flight Number</Label>
                            <Input 
                              id="flightNumber" 
                              value={newFlight.flightNumber}
                              onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                              placeholder="e.g. EK101"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="departure">Departure Airport</Label>
                            <Select 
                              value={newFlight.departure}
                              onValueChange={(value) => setNewFlight({...newFlight, departure: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AIRPORTS.map((airport) => (
                                  <SelectItem key={airport} value={airport}>
                                    {airport}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arrival">Arrival Airport</Label>
                            <Select 
                              value={newFlight.arrival}
                              onValueChange={(value) => setNewFlight({...newFlight, arrival: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AIRPORTS.map((airport) => (
                                  <SelectItem key={airport} value={airport}>
                                    {airport}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="departureTime">Departure Time</Label>
                            <Input 
                              id="departureTime" 
                              type="time"
                              value={newFlight.departureTime}
                              onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arrivalTime">Arrival Time</Label>
                            <Input 
                              id="arrivalTime" 
                              type="time"
                              value={newFlight.arrivalTime}
                              onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gate">Gate</Label>
                            <Input 
                              id="gate" 
                              value={newFlight.gate}
                              onChange={(e) => setNewFlight({...newFlight, gate: e.target.value})}
                              placeholder="e.g. A1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="terminal">Terminal</Label>
                            <Input 
                              id="terminal" 
                              value={newFlight.terminal}
                              onChange={(e) => setNewFlight({...newFlight, terminal: e.target.value})}
                              placeholder="e.g. 1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                              value={newFlight.status}
                              onValueChange={(value) => setNewFlight({...newFlight, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="On Time">On Time</SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleAddFlight}>Add Flight</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Flight</TableHead>
                        <TableHead>Airline</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flights
                        .filter(flight => 
                          flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          flight.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          flight.arrival.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((flight) => (
                        <TableRow key={flight.id} className="group">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Plane className="h-4 w-4 mr-2 text-primary" />
                              {flight.flightNumber}
                            </div>
                          </TableCell>
                          <TableCell>{flight.airline}</TableCell>
                          <TableCell>
                            <div className="font-medium">{flight.departure.split(" - ")[0]}</div>
                            <div className="text-xs text-muted-foreground">to</div>
                            <div className="font-medium">{flight.arrival.split(" - ")[0]}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Terminal {flight.terminal}, Gate {flight.gate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={flight.status}
                              onValueChange={(value) => updateFlightStatus(flight.id, value)}
                            >
                              <SelectTrigger 
                                className={`w-[120px] h-8 ${
                                  flight.status === "On Time" 
                                    ? "bg-green-100 text-green-800 border-green-300" 
                                    : flight.status === "Delayed"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                    : "bg-red-100 text-red-800 border-red-300"
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="On Time">On Time</SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteFlight(flight.id)}
                              className="h-8"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cargo" className="space-y-4 animate-fade-in animation-fill-mode-forwards">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cargo Shipments</CardTitle>
                    <CardDescription>
                      Add, edit and manage cargo schedules
                    </CardDescription>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-8 gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        Add Shipment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Shipment</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new cargo shipment.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Select 
                              value={newShipment.company}
                              onValueChange={(value) => setNewShipment({...newShipment, company: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CARGO_COMPANIES.map((company) => (
                                  <SelectItem key={company} value={company}>
                                    {company}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="trackingNumber">Tracking Number</Label>
                            <Input 
                              id="trackingNumber" 
                              value={newShipment.trackingNumber}
                              onChange={(e) => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                              placeholder="e.g. DHL1234567"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="origin">Origin</Label>
                            <Select 
                              value={newShipment.origin}
                              onValueChange={(value) => setNewShipment({...newShipment, origin: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LOCATIONS.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Select 
                              value={newShipment.destination}
                              onValueChange={(value) => setNewShipment({...newShipment, destination: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LOCATIONS.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="departureDate">Departure Date</Label>
                            <Input 
                              id="departureDate" 
                              type="date"
                              value={newShipment.departureDate}
                              onChange={(e) => setNewShipment({...newShipment, departureDate: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arrivalDate">Arrival Date</Label>
                            <Input 
                              id="arrivalDate" 
                              type="date"
                              value={newShipment.arrivalDate}
                              onChange={(e) => setNewShipment({...newShipment, arrivalDate: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input 
                              id="weight" 
                              type="number"
                              value={newShipment.weight}
                              onChange={(e) => setNewShipment({...newShipment, weight: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="volume">Volume (m³)</Label>
                            <Input 
                              id="volume" 
                              type="number"
                              value={newShipment.volume}
                              onChange={(e) => setNewShipment({...newShipment, volume: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cargoType">Cargo Type</Label>
                            <Select 
                              value={newShipment.cargoType}
                              onValueChange={(value) => setNewShipment({...newShipment, cargoType: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CARGO_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vessel">Vessel/Vehicle</Label>
                            <Input 
                              id="vessel" 
                              value={newShipment.vessel}
                              onChange={(e) => setNewShipment({...newShipment, vessel: e.target.value})}
                              placeholder="e.g. DHL 123"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="containerId">Container ID</Label>
                            <Input 
                              id="containerId" 
                              value={newShipment.containerId}
                              onChange={(e) => setNewShipment({...newShipment, containerId: e.target.value})}
                              placeholder="e.g. CONT1234567"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select 
                            value={newShipment.status}
                            onValueChange={(value) => setNewShipment({...newShipment, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="In Transit">In Transit</SelectItem>
                              <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleAddShipment}>Add Shipment</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Tracking Number</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments
                        .filter(shipment => 
                          shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shipment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shipment.cargoType.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((shipment) => (
                        <TableRow key={shipment.id} className="group">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-2 text-primary" />
                              {shipment.trackingNumber}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {shipment.containerId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{shipment.company}</div>
                            <div className="text-xs text-muted-foreground">
                              {shipment.vessel}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{shipment.origin}</div>
                            <div className="text-xs text-muted-foreground">to</div>
                            <div className="font-medium">{shipment.destination}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              Departure: {formatDate(shipment.departureDate)}
                            </div>
                            <div className="text-xs">
                              Arrival: {formatDate(shipment.arrivalDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={shipment.status}
                              onValueChange={(value) => updateShipmentStatus(shipment.id, value)}
                            >
                              <SelectTrigger 
                                className={`w-[160px] h-8 ${
                                  shipment.status === "Delivered" 
                                    ? "bg-green-100 text-green-800 border-green-300" 
                                    : shipment.status === "In Transit"
                                    ? "bg-blue-100 text-blue-800 border-blue-300"
                                    : shipment.status === "Scheduled"
                                    ? "bg-purple-100 text-purple-800 border-purple-300"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="In Transit">In Transit</SelectItem>
                                <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteShipment(shipment.id)}
                              className="h-8"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Statistics</CardTitle>
              <CardDescription>
                Overview of system performance and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Total Flights</div>
                  <div className="text-3xl font-bold">{flights.length}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">On Time: {flights.filter(f => f.status === "On Time").length}</div>
                    <div className="text-xs text-muted-foreground">Delayed: {flights.filter(f => f.status === "Delayed").length}</div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Total Shipments</div>
                  <div className="text-3xl font-bold">{shipments.length}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">In Transit: {shipments.filter(s => s.status === "In Transit").length}</div>
                    <div className="text-xs text-muted-foreground">Delivered: {shipments.filter(s => s.status === "Delivered").length}</div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Airlines</div>
                  <div className="text-3xl font-bold">{AIRLINES.length}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">Active Flights: {flights.length}</div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Cargo Companies</div>
                  <div className="text-3xl font-bold">{CARGO_COMPANIES.length}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">Active Shipments: {shipments.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 h-[200px] rounded-md border bg-black text-green-500 p-4 font-mono text-sm overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="grid grid-cols-12 gap-1 w-full h-full">
                    {Array.from({ length: 12 * 10 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="animate-matrix-rain" 
                        style={{ 
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 3}s`
                        }}
                      >
                        {Math.random() > 0.5 ? '1' : '0'}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div>ADMIN CONSOLE // SYSTEM METRICS</div>
                  <div className="mt-2">USERS: {Math.floor(Math.random() * 100) + 50} ACTIVE // UPTIME: {Math.floor(Math.random() * 1000)} HOURS</div>
                  <div className="mt-4">
                    <div className="flex items-center text-xs my-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                      <span className="mr-2">DATABASE STATUS</span>
                      <span className="text-green-300">ONLINE // LOAD: {Math.floor(Math.random() * 60)}%</span>
                    </div>
                    <div className="flex items-center text-xs my-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                      <span className="mr-2">API SERVER</span>
                      <span className="text-green-300">ONLINE // LOAD: {Math.floor(Math.random() * 40)}%</span>
                    </div>
                    <div className="flex items-center text-xs my-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                      <span className="mr-2">AUTH SERVICES</span>
                      <span className="text-green-300">ONLINE // LOAD: {Math.floor(Math.random() * 30)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-green-900 pt-2">
                    NEXUS ADMIN INTERFACE ACTIVE // SESSION SECURED
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-muted py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <Plane className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Aero Logistics Nexus</p>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Aero Logistics Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
