import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Package, 
  Truck, 
  Plane, 
  Ship, 
  MapPin, 
  LocateFixed, 
  Clock, 
  CheckCircle2, 
  ClipboardCheck, 
  AlertCircle,
  ArrowRightCircle
} from "lucide-react";

// Mock data for a specific cargo shipment
const generateMockCargoData = (trackingId: string) => {
  return {
    id: trackingId,
    shipmentType: "International Air Freight",
    origin: "New York, USA",
    destination: "London, UK",
    status: "In Transit",
    estimatedDelivery: "April 22, 2025",
    weight: "256.8 kg",
    dimensions: "120 × 80 × 100 cm",
    service: "Express Air",
    carrier: "Global Air Cargo",
    currentLocation: "Customs Clearance, Heathrow Airport, UK",
    lastUpdated: new Date().toLocaleString(),
    senderInfo: {
      name: "Global Electronics Inc.",
      address: "123 Manufacturing Ave, New York, NY 10001, USA",
      contact: "+1 (212) 555-7890"
    },
    receiverInfo: {
      name: "TechSolutions Ltd.",
      address: "456 Innovation Square, London EC2A 4EU, UK",
      contact: "+44 20 1234 5678"
    },
    timeline: [
      { 
        id: 1,
        title: "Order Placed", 
        date: "April 15, 2025 - 10:23 AM",
        location: "New York, USA",
        description: "Shipping label created",
        icon: Package,
        status: "completed" 
      },
      { 
        id: 2,
        title: "Order Processed", 
        date: "April 15, 2025 - 3:45 PM",
        location: "New York, USA",
        description: "Package has been processed",
        icon: ClipboardCheck,
        status: "completed" 
      },
      { 
        id: 3,
        title: "Pickup", 
        date: "April 16, 2025 - 9:30 AM",
        location: "New York Distribution Center, USA",
        description: "Package picked up by carrier",
        icon: Truck,
        status: "completed" 
      },
      { 
        id: 4,
        title: "International Departure", 
        date: "April 17, 2025 - 11:45 AM",
        location: "JFK International Airport, USA",
        description: "Package departed from origin country",
        icon: Plane,
        status: "completed" 
      },
      { 
        id: 5,
        title: "International Arrival", 
        date: "April 18, 2025 - 2:15 PM",
        location: "Heathrow Airport, UK",
        description: "Package arrived in destination country",
        icon: Plane,
        status: "completed" 
      },
      { 
        id: 6,
        title: "Customs Clearance", 
        date: "April 19, 2025 - 8:30 AM",
        location: "London, UK",
        description: "Package clearing customs",
        icon: CheckCircle2,
        status: "in-progress" 
      },
      { 
        id: 7,
        title: "Local Shipment", 
        date: "Pending",
        location: "United Kingdom",
        description: "Package in transit to delivery center",
        icon: Truck,
        status: "upcoming" 
      },
      { 
        id: 8,
        title: "Out for Delivery", 
        date: "Pending",
        location: "London, UK",
        description: "Package is out for delivery",
        icon: Truck,
        status: "upcoming" 
      },
      { 
        id: 9,
        title: "Delivered", 
        date: "Pending",
        location: "London, UK",
        description: "Package has been delivered",
        icon: CheckCircle2,
        status: "upcoming" 
      }
    ],
    items: [
      {
        id: 1,
        name: "Electronic Components",
        quantity: 500,
        weight: "120.5 kg",
        value: "$12,500.00",
        hazardous: false
      },
      {
        id: 2,
        name: "Circuit Boards",
        quantity: 200,
        weight: "85.3 kg",
        value: "$18,200.00",
        hazardous: false
      },
      {
        id: 3,
        name: "Testing Equipment",
        quantity: 10,
        weight: "51.0 kg",
        value: "$8,300.00",
        hazardous: false
      }
    ],
    documents: [
      {
        id: 1,
        name: "Commercial Invoice",
        status: "Approved",
        date: "April 15, 2025"
      },
      {
        id: 2,
        name: "Packing List",
        status: "Approved",
        date: "April 15, 2025"
      },
      {
        id: 3,
        name: "Bill of Lading",
        status: "Approved",
        date: "April 16, 2025"
      },
      {
        id: 4,
        name: "Customs Declaration",
        status: "In Review",
        date: "April 19, 2025"
      }
    ]
  };
};

const CargoTrackingDetailPage = () => {
  const { trackingId = "CGO123456789" } = useParams<{ trackingId: string }>();
  const [shipment, setShipment] = useState(generateMockCargoData(trackingId));
  const [activeTimelineId, setActiveTimelineId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with delay
    const timer = setTimeout(() => {
      setShipment(generateMockCargoData(trackingId));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [trackingId]);

  // Determine current step
  const getProgressPercentage = () => {
    const completedSteps = shipment.timeline.filter(step => step.status === 'completed').length;
    const inProgressSteps = shipment.timeline.filter(step => step.status === 'in-progress').length;
    const totalSteps = shipment.timeline.length;
    
    return Math.round(((completedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100);
  };

  const handleNotifyUpdate = () => {
    toast.success("You will be notified of shipment updates");
  };

  const handleReportIssue = () => {
    toast.success("Your issue has been reported to our support team");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-10 px-4 md:px-6 mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] animate-gradient-x">
                  Tracking: {shipment.id}
                </h1>
                <p className="text-muted-foreground mt-1 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  {shipment.shipmentType}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="border-primary/20 hover:border-primary transition-all duration-300 hover:bg-primary/5"
                  onClick={handleNotifyUpdate}
                >
                  Notify Me of Updates
                </Button>
                <Button 
                  variant="outline" 
                  className="border-destructive/20 hover:border-destructive transition-all duration-300 hover:bg-destructive/5"
                  onClick={handleReportIssue}
                >
                  Report an Issue
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-secondary/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-xl">
                      <LocateFixed className="h-5 w-5 mr-2 text-primary" />
                      Shipment Status
                    </CardTitle>
                    <CardDescription>
                      Current Status: <span className="font-medium text-primary">{shipment.status}</span>
                    </CardDescription>
                  </div>
                  <Badge 
                    className={`${
                      shipment.status === "Delivered" 
                        ? "bg-green-100 text-green-800" 
                        : shipment.status === "In Transit" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {shipment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-medium">{shipment.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{shipment.estimatedDelivery}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{shipment.lastUpdated}</p>
                    </div>
                  </div>

                  <div className="w-full bg-muted/50 rounded-full h-4 mb-6">
                    <div 
                      className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] h-4 rounded-full animate-pulse-soft"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="relative space-y-0 p-4 overflow-hidden border-t">
                  {/* Timeline connector line */}
                  <div className="absolute top-0 bottom-0 left-[42px] w-0.5 bg-muted" />
                  
                  {shipment.timeline.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`relative flex items-start gap-6 group py-4 ${
                        index !== shipment.timeline.length - 1 ? 'border-b border-border last:border-0' : ''
                      }`}
                      onMouseEnter={() => setActiveTimelineId(step.id)}
                      onMouseLeave={() => setActiveTimelineId(null)}
                    >
                      <div 
                        className={`z-10 flex items-center justify-center w-[44px] h-[44px] rounded-full shrink-0 transition-all duration-300 ${
                          step.status === 'completed' 
                            ? 'bg-primary text-primary-foreground' 
                            : step.status === 'in-progress' 
                              ? 'bg-blue-500 text-white animate-pulse-soft' 
                              : 'bg-muted text-muted-foreground'
                        } ${
                          activeTimelineId === step.id ? 'ring-4 ring-primary/20' : ''
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className={`flex flex-col gap-1 transition-all duration-300 ${
                        step.status === 'completed' 
                          ? 'opacity-100' 
                          : step.status === 'in-progress' 
                            ? 'opacity-100' 
                            : 'opacity-60 group-hover:opacity-100'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium">{step.title}</h4>
                          {step.status === 'in-progress' && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              In Progress
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{step.date}</span>
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
              </CardContent>
            </Card>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-secondary/30 pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary" />
                    Shipment Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipment.items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.weight}</TableCell>
                          <TableCell className="text-right">{item.value}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/10 font-medium">
                        <TableCell>Totals</TableCell>
                        <TableCell className="text-right">
                          {shipment.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </TableCell>
                        <TableCell className="text-right">{shipment.weight}</TableCell>
                        <TableCell className="text-right">
                          ${shipment.items.reduce((sum, item) => {
                            const value = parseFloat(item.value.replace(/[^0-9.-]+/g, ""));
                            return sum + value;
                          }, 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-secondary/30 pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead>Document</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipment.documents.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={`${
                                doc.status === "Approved" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {doc.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                    <div className="p-3 bg-muted/20 rounded-md">
                      <p className="font-medium">{shipment.senderInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{shipment.senderInfo.address}</p>
                      <p className="text-sm text-primary mt-1">{shipment.senderInfo.contact}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="h-16 flex flex-col items-center justify-center">
                      <ArrowRightCircle className="h-6 w-6 text-primary animate-pulse-soft" />
                      <div className="h-full w-0.5 bg-muted"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                    <div className="p-3 bg-muted/20 rounded-md border-l-2 border-primary">
                      <p className="font-medium">{shipment.receiverInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{shipment.receiverInfo.address}</p>
                      <p className="text-sm text-primary mt-1">{shipment.receiverInfo.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-md border border-dashed border-muted-foreground/30">
                  <h3 className="text-sm font-medium mb-2">Delivery Window</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Earliest</p>
                      <p className="font-medium">Apr 21, 2025</p>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]"></div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Latest</p>
                      <p className="font-medium">Apr 23, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="flex items-center text-lg">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Shipment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-medium">{shipment.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{shipment.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{shipment.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="font-medium">{shipment.dimensions}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">Transit Time</span>
                        </div>
                        <span>5-7 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">Priority</span>
                        </div>
                        <Badge>High</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <LocateFixed className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">Tracking Updates</span>
                        </div>
                        <span>Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-[#9b87f5]/20 to-[#33C3F0]/20 p-6 rounded-lg border border-primary/10 animate-float">
              <h3 className="text-lg font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our customer service team is available 24/7 to help with your shipment.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary transition-all duration-300">
                  Chat with Support
                </Button>
                <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary transition-all duration-300">
                  Call Support Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoTrackingDetailPage;