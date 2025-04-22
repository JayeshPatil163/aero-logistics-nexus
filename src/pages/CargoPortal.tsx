
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { Package, ArrowRight, Search, Truck, Plane, Ship, LocateFixed } from "lucide-react";
import { toast } from "sonner";

// Mock companies
const COMPANIES = [
  "Global Logistics", "FastFreight", "OceanCargo", "AirExpress", 
  "Continental Shipping", "PrimeDelivery", "Trans-World Cargo", "Elite Freight"
];

// Mock origins and destinations
const LOCATIONS = [
  "New York, USA", "London, UK", "Shanghai, China", "Singapore", 
  "Dubai, UAE", "Rotterdam, Netherlands", "Hamburg, Germany", "Tokyo, Japan"
];

// Mock cargo types
const CARGO_TYPES = [
  "Electronics", "Pharmaceuticals", "Automotive Parts", "Textiles", 
  "Machinery", "Chemicals", "Food Products", "Consumer Goods"
];

// Generate a mock shipment
const generateShipment = (id: number) => {
  const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
  const origin = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  let destination;
  do {
    destination = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  } while (destination === origin);
  
  const cargoType = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
  const weight = Math.floor(100 + Math.random() * 2000) / 10;
  const volume = Math.floor(10 + Math.random() * 100) / 10;
  
  const today = new Date();
  const departureDate = addDays(today, Math.floor(Math.random() * 7));
  const arrivalDate = addDays(departureDate, 3 + Math.floor(Math.random() * 14));
  
  const statusOptions = ["Scheduled", "In Transit", "Customs Clearance", "Delivered", "Delayed"];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  
  const trackingId = `CARGO${String(10000 + id).padStart(6, '0')}`;
  
  return {
    id,
    company,
    trackingId,
    origin,
    destination,
    cargoType,
    weight,
    volume,
    departureDate,
    arrivalDate,
    status,
    transportMode: Math.random() > 0.5 ? (Math.random() > 0.5 ? "Air" : "Sea") : "Land"
  };
};

// Generate mock shipments
const generateShipments = (count: number) => {
  const shipments = [];
  for (let i = 0; i < count; i++) {
    shipments.push(generateShipment(i));
  }
  return shipments;
};

const ALL_SHIPMENTS = generateShipments(20);

const CargoPortal = () => {
  const [shipments, setShipments] = useState(ALL_SHIPMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShipments, setFilteredShipments] = useState(ALL_SHIPMENTS);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [transportFilter, setTransportFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    let result = [...shipments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        shipment =>
          shipment.trackingId.toLowerCase().includes(query) ||
          shipment.company.toLowerCase().includes(query) ||
          shipment.origin.toLowerCase().includes(query) ||
          shipment.destination.toLowerCase().includes(query) ||
          shipment.cargoType.toLowerCase().includes(query)
      );
    }

    if (statusFilter && statusFilter !== "all") {
      result = result.filter(shipment => shipment.status === statusFilter);
    }

    if (transportFilter && transportFilter !== "all") {
      result = result.filter(shipment => shipment.transportMode === transportFilter);
    }

    setFilteredShipments(result);
  }, [shipments, searchQuery, statusFilter, transportFilter]);

  // Function to handle tracking a shipment
  const handleTrackShipment = (trackingId: string) => {
    navigate(`/cargo-tracking/${trackingId}`);
  };

  // Function to get icon based on transport mode
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case "Air":
        return <Plane className="h-4 w-4" />;
      case "Sea":
        return <Ship className="h-4 w-4" />;
      case "Land":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-8 px-4 md:px-6 md:py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gemini-gradient-text animate-gradient-x md:text-4xl">
              Cargo Shipment Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your cargo shipments around the world
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div className="space-y-6">
              <Card className="gemini-card">
                <CardHeader>
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Shipments</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Tracking ID, company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 border-primary/20 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status" className="border-primary/20 focus:ring-primary/30">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Customs Clearance">Customs Clearance</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Mode</Label>
                    <Select value={transportFilter} onValueChange={setTransportFilter}>
                      <SelectTrigger id="transport" className="border-primary/20 focus:ring-primary/30">
                        <SelectValue placeholder="All Modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="Air">Air</SelectItem>
                        <SelectItem value="Sea">Sea</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-primary/20 hover:bg-primary/5 transition-all duration-300" 
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setTransportFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="gemini-card">
                <CardHeader>
                  <CardTitle className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                    Quick Track
                  </CardTitle>
                  <CardDescription>
                    Enter a tracking number to get immediate status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = (e.currentTarget.elements.namedItem('quickTrack') as HTMLInputElement).value;
                      if (input) {
                        navigate(`/cargo-tracking/${input}`);
                      } else {
                        toast.error("Please enter a tracking number");
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="quickTrack">Tracking Number</Label>
                      <Input
                        id="quickTrack"
                        placeholder="e.g. CARGO123456"
                        className="border-primary/20 focus:ring-primary/30"
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-md transition-all"
                    >
                      Track Shipment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="gemini-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Scheduled Shipments</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredShipments.length} of {shipments.length} shipments
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                          <TableRow key={shipment.id} className="group hover:bg-muted/50 gemini-hover-effect">
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getTransportIcon(shipment.transportMode)}
                                <span className="ml-2">{shipment.trackingId}</span>
                              </div>
                            </TableCell>
                            <TableCell>{shipment.company}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="truncate max-w-[80px]">{shipment.origin}</span>
                                <ArrowRight className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[80px]">{shipment.destination}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{shipment.cargoType}</div>
                                <div className="text-xs text-muted-foreground">
                                  {shipment.weight} kg / {shipment.volume} m³
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Dep: {format(shipment.departureDate, "MMM d")}</div>
                                <div>Arr: {format(shipment.arrivalDate, "MMM d")}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`
                                ${shipment.status === "Delivered" ? "bg-green-100 text-green-800" : 
                                  shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" : 
                                  shipment.status === "Delayed" ? "bg-red-100 text-red-800" : 
                                  shipment.status === "Customs Clearance" ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-gray-100 text-gray-800"}
                              `}>
                                {shipment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={() => handleTrackShipment(shipment.trackingId)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:shadow-md"
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
              
              <Card className="gemini-card overflow-hidden animate-float">
                <CardHeader className="bg-gradient-to-r from-[#9b87f5]/10 to-[#33C3F0]/10">
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
                    Matrix Cargo Network
                  </CardTitle>
                  <CardDescription>
                    Interactive visualization of global cargo routes
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
                      <div>GLOBAL CARGO NETWORK // ACTIVE NODES: {LOCATIONS.length}</div>
                      <div>TRACKING SHIPMENTS: {filteredShipments.length} / {shipments.length}</div>
                      <div>SYSTEM STATUS: ONLINE</div>
                      <div className="mt-4">
                        {COMPANIES.slice(0, 5).map((company, i) => (
                          <div key={i} className="flex items-center text-xs my-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-soft"></span>
                            <span className="mr-2">{company}</span>
                            <span className="text-green-300">
                              {Math.floor(Math.random() * 100)}% CAPACITY
                            </span>
                            <span className="ml-auto">
                              {Math.floor(Math.random() * 20)} ACTIVE SHIPMENTS
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
    </div>
  );
};

export default CargoPortal;
