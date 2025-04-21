
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
import { Calendar as CalendarIcon, Truck } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for cargo shipments
const COMPANIES = [
  "DHL", "FedEx", "UPS", "Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"
];

const LOCATIONS = [
  "New York, USA", "Shanghai, China", "Rotterdam, Netherlands", "Singapore", 
  "Dubai, UAE", "Los Angeles, USA", "Hamburg, Germany", "Tokyo, Japan"
];

const CARGO_TYPES = [
  "General Cargo", "Container", "Bulk", "Refrigerated", "Hazardous", "Vehicles", "Electronics", "Perishables"
];

const generateShipments = () => {
  const shipments = [];
  
  for (let i = 0; i < 50; i++) {
    const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
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
    
    // Status based on dates
    let status;
    const today = new Date();
    if (today < departureDate) {
      status = "Scheduled";
    } else if (today > arrivalDate) {
      status = "Delivered";
    } else {
      const statuses = ["In Transit", "Customs Clearance", "Loading", "Unloading"];
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
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

const SHIPMENTS = generateShipments();

const formatDate = (date: Date) => {
  return format(date, "dd MMM yyyy");
};

const CargoPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [shipments, setShipments] = useState(SHIPMENTS);
  const [filteredShipments, setFilteredShipments] = useState(SHIPMENTS);
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCargoType, setSelectedCargoType] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  // Filter shipments based on filters
  useEffect(() => {
    let result = [...shipments];
    
    if (selectedCompany) {
      result = result.filter(shipment => shipment.company === selectedCompany);
    }
    
    if (selectedCargoType) {
      result = result.filter(shipment => shipment.cargoType === selectedCargoType);
    }
    
    if (selectedDate) {
      result = result.filter(shipment => {
        const departureDate = new Date(shipment.departureDate);
        const arrivalDate = new Date(shipment.arrivalDate);
        const filterDate = new Date(selectedDate);
        
        // Check if the selected date is within the shipment's transit period
        return (
          filterDate >= departureDate && filterDate <= arrivalDate
        );
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        shipment =>
          shipment.trackingNumber.toLowerCase().includes(query) ||
          shipment.origin.toLowerCase().includes(query) ||
          shipment.destination.toLowerCase().includes(query) ||
          shipment.vessel.toLowerCase().includes(query) ||
          shipment.containerId.toLowerCase().includes(query)
      );
    }
    
    setFilteredShipments(result);
  }, [shipments, selectedCompany, selectedDate, selectedCargoType, searchQuery]);

  const handleTrackShipment = (trackingNumber: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    // In a real app, navigate to detailed tracking page
    alert(`Tracking shipment: ${trackingNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Cargo Portal</h1>
            <p className="text-muted-foreground mt-2">
              Monitor global cargo shipments and track your logistics
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filter Shipments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Select 
                      value={selectedCompany} 
                      onValueChange={(value) => setSelectedCompany(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Companies</SelectItem>
                        {COMPANIES.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cargo Type</label>
                    <Select 
                      value={selectedCargoType} 
                      onValueChange={(value) => setSelectedCargoType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>All Types</SelectItem>
                        {CARGO_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transit Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
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
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Tracking number, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      setSelectedCompany(undefined);
                      setSelectedCargoType(undefined);
                      setSelectedDate(undefined);
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-lg font-medium">
                        {SHIPMENTS.filter(s => s.status === "In Transit").length}
                      </div>
                      <div className="text-xs text-muted-foreground">In Transit</div>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-lg font-medium">
                        {SHIPMENTS.filter(s => s.status === "Scheduled").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Scheduled</div>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-lg font-medium">
                        {SHIPMENTS.filter(s => s.status === "Delivered").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Delivered</div>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="text-lg font-medium">
                        {SHIPMENTS.filter(s => s.status === "Customs Clearance").length}
                      </div>
                      <div className="text-xs text-muted-foreground">In Customs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Tabs defaultValue="all">
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Shipments</TabsTrigger>
                    <TabsTrigger value="inTransit">In Transit</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredShipments.length} shipments
                  </div>
                </div>
                
                <TabsContent value="all" className="animate-fade-in animation-fill-mode-forwards">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Tracking Number</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Cargo Info</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredShipments.length > 0 ? (
                            filteredShipments.map((shipment) => (
                              <TableRow key={shipment.id} className="group hover:bg-muted/50 transition-colors cursor-default">
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
                                  <Badge variant="outline" className="mr-1">
                                    {shipment.cargoType}
                                  </Badge>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {shipment.weight} kg • {shipment.volume} m³
                                  </div>
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
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    shipment.status === "Delivered" 
                                      ? "bg-green-100 text-green-800" 
                                      : shipment.status === "In Transit"
                                      ? "bg-blue-100 text-blue-800"
                                      : shipment.status === "Scheduled"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {shipment.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleTrackShipment(shipment.trackingNumber)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Track
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No shipments found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="inTransit" className="animate-fade-in animation-fill-mode-forwards">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Tracking Number</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Cargo Info</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredShipments.filter(s => s.status === "In Transit").length > 0 ? (
                            filteredShipments.filter(s => s.status === "In Transit").map((shipment) => (
                              <TableRow key={shipment.id} className="group hover:bg-muted/50 transition-colors cursor-default">
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
                                  <Badge variant="outline" className="mr-1">
                                    {shipment.cargoType}
                                  </Badge>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {shipment.weight} kg • {shipment.volume} m³
                                  </div>
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
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    In Transit
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleTrackShipment(shipment.trackingNumber)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Track
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No shipments in transit.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="scheduled" className="animate-fade-in animation-fill-mode-forwards">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Tracking Number</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Cargo Info</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredShipments.filter(s => s.status === "Scheduled").length > 0 ? (
                            filteredShipments.filter(s => s.status === "Scheduled").map((shipment) => (
                              <TableRow key={shipment.id} className="group hover:bg-muted/50 transition-colors cursor-default">
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
                                  <Badge variant="outline" className="mr-1">
                                    {shipment.cargoType}
                                  </Badge>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {shipment.weight} kg • {shipment.volume} m³
                                  </div>
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
                                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                    Scheduled
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleTrackShipment(shipment.trackingNumber)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Track
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">
                                No scheduled shipments.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>Matrix-Inspired Cargo Network</CardTitle>
                  <CardDescription>
                    Global visualization of cargo movement and logistics data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] rounded-md border bg-black text-green-500 p-4 font-mono text-sm overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="grid grid-cols-12 gap-1 w-full h-full">
                        {Array.from({ length: 12 * 20 }).map((_, i) => (
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
                      <div>GLOBAL CARGO NETWORK // ACTIVE NODES: {COMPANIES.length}</div>
                      <div>TRACKING SHIPMENTS: {filteredShipments.length} / {shipments.length}</div>
                      <div>SYSTEM STATUS: ONLINE</div>
                      <div className="mt-4">
                        {CARGO_TYPES.map((type, i) => (
                          <div key={i} className="flex items-center text-xs my-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                            <span className="mr-2">{type}</span>
                            <span className="text-green-300">
                              {Math.floor(Math.random() * 100)}% CAPACITY
                            </span>
                            <span className="ml-auto">
                              {shipments.filter(s => s.cargoType === type).length} ACTIVE SHIPMENTS
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
              <Truck className="h-5 w-5 text-primary" />
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

export default CargoPortal;
