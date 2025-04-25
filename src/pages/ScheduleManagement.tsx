
import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { CalendarPlus, Plus, Edit, Trash2, Plane, Truck, Save, X, Clock, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { generateExcelReport } from "@/utils/excelUtils";

interface Schedule {
  id: string;
  type: "airline" | "cargo";
  name: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  status: "active" | "delayed" | "cancelled";
}

const ScheduleManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleType, setScheduleType] = useState<"airline" | "cargo">("airline");
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "a1",
      type: "airline",
      name: "Lufthansa LH723",
      origin: "New York (JFK)",
      destination: "London (LHR)",
      departureDate: "2025-05-15",
      departureTime: "08:15",
      arrivalDate: "2025-05-15",
      arrivalTime: "15:50",
      status: "active"
    },
    {
      id: "a2",
      type: "airline",
      name: "British Airways BA112",
      origin: "New York (JFK)",
      destination: "London (LHR)",
      departureDate: "2025-05-15",
      departureTime: "10:30",
      arrivalDate: "2025-05-15",
      arrivalTime: "17:40",
      status: "active"
    },
    {
      id: "c1",
      type: "cargo",
      name: "DHL Express DL347",
      origin: "Singapore",
      destination: "Mumbai",
      departureDate: "2025-05-16",
      departureTime: "14:20",
      arrivalDate: "2025-05-17",
      arrivalTime: "02:30",
      status: "active"
    },
    {
      id: "c2",
      type: "cargo",
      name: "FedEx FX903",
      origin: "Hong Kong",
      destination: "Los Angeles",
      departureDate: "2025-05-18",
      departureTime: "23:45",
      arrivalDate: "2025-05-19",
      arrivalTime: "20:15",
      status: "delayed"
    }
  ]);

  const handleAddSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    
    const newSchedule: Schedule = {
      id: `${scheduleType[0]}${schedules.length + 1}`,
      type: scheduleType,
      name: formData.get("name") as string,
      origin: formData.get("origin") as string,
      destination: formData.get("destination") as string,
      departureDate: formData.get("departureDate") as string,
      departureTime: formData.get("departureTime") as string,
      arrivalDate: formData.get("arrivalDate") as string,
      arrivalTime: formData.get("arrivalTime") as string,
      status: "active"
    };

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      setIsLoading(false);
      formElement.reset();
      toast.success(`New ${scheduleType} schedule added successfully!`);
      
      // Save to Excel file
      saveSchedulesToExcel(updatedSchedules, scheduleType);
    }, 1000);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setScheduleType(schedule.type);
  };

  const handleSaveEdit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingSchedule) return;
    
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    
    const updatedSchedule: Schedule = {
      ...editingSchedule,
      name: formData.get("name") as string,
      origin: formData.get("origin") as string,
      destination: formData.get("destination") as string,
      departureDate: formData.get("departureDate") as string,
      departureTime: formData.get("departureTime") as string,
      arrivalDate: formData.get("arrivalDate") as string,
      arrivalTime: formData.get("arrivalTime") as string,
    };

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedSchedules = schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s);
      setSchedules(updatedSchedules);
      setIsLoading(false);
      setEditingSchedule(null);
      toast.success("Schedule updated successfully!");
      
      // Save to Excel file
      saveSchedulesToExcel(updatedSchedules, updatedSchedule.type);
    }, 1000);
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setIsLoading(true);
      
      // Get the schedule type before deleting
      const scheduleToDelete = schedules.find(s => s.id === id);
      const scheduleTypeToUpdate = scheduleToDelete?.type;
      
      // Simulate API call
      setTimeout(() => {
        const updatedSchedules = schedules.filter(s => s.id !== id);
        setSchedules(updatedSchedules);
        setIsLoading(false);
        toast.success("Schedule deleted successfully!");
        
        // Save to Excel file if we have a valid type
        if (scheduleTypeToUpdate) {
          saveSchedulesToExcel(updatedSchedules, scheduleTypeToUpdate);
        }
      }, 1000);
    }
  };

  const handleStatusChange = (id: string, status: "active" | "delayed" | "cancelled") => {
    const updatedSchedules = schedules.map(s => 
      s.id === id ? { ...s, status } : s
    );
    
    setSchedules(updatedSchedules);
    toast.success(`Status updated to ${status}`);
    
    // Get the schedule type before updating
    const scheduleToUpdate = updatedSchedules.find(s => s.id === id);
    if (scheduleToUpdate) {
      saveSchedulesToExcel(updatedSchedules, scheduleToUpdate.type);
    }
  };
  
  const handleGenerateReport = () => {
    // Filter schedules based on current type selection
    const filteredSchedules = schedules.filter(s => s.type === scheduleType);
    
    // Format for Excel report
    const reportData = filteredSchedules.map(schedule => ({
      ID: schedule.id,
      Name: schedule.name,
      Origin: schedule.origin,
      Destination: schedule.destination,
      DepartureDate: schedule.departureDate,
      DepartureTime: schedule.departureTime,
      ArrivalDate: schedule.arrivalDate,
      ArrivalTime: schedule.arrivalTime,
      Status: schedule.status
    }));

    const success = generateExcelReport(
      reportData, 
      `AirCargo_${scheduleType === 'airline' ? 'Flights' : 'Cargo'}_Schedules.xlsx`
    );
    
    if (success) {
      toast.success(`${scheduleType === 'airline' ? 'Flight' : 'Cargo'} schedule report generated successfully!`);
    } else {
      toast.error("Failed to generate report. Please try again.");
    }
  };
  
  // Function to save schedules to Excel
  const saveSchedulesToExcel = (schedulesToSave: Schedule[], type: "airline" | "cargo") => {
    // Filter by type
    const typeSchedules = schedulesToSave.filter(s => s.type === type);
    
    // Format for Excel
    const reportData = typeSchedules.map(schedule => ({
      ID: schedule.id,
      Name: schedule.name,
      Origin: schedule.origin,
      Destination: schedule.destination,
      DepartureDate: schedule.departureDate,
      DepartureTime: schedule.departureTime,
      ArrivalDate: schedule.arrivalDate,
      ArrivalTime: schedule.arrivalTime,
      Status: schedule.status
    }));

    const fileName = `AirCargo_${type === 'airline' ? 'Flights' : 'Cargo'}_Schedules.xlsx`;
    generateExcelReport(reportData, fileName);
  };

  const StatusToggleGroup = ({ id, currentStatus }: { id: string, currentStatus: string }) => (
    <div className="flex space-x-1">
      <Toggle
        pressed={currentStatus === "active"}
        onClick={() => handleStatusChange(id, "active")}
        className="h-8 w-8 p-0 data-[state=on]:bg-green-500 data-[state=on]:text-white"
        aria-label="Active"
      >
        <Check className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={currentStatus === "delayed"}
        onClick={() => handleStatusChange(id, "delayed")}
        className="h-8 w-8 p-0 data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
        aria-label="Delayed"
      >
        <Clock className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={currentStatus === "cancelled"}
        onClick={() => handleStatusChange(id, "cancelled")}
        className="h-8 w-8 p-0 data-[state=on]:bg-red-500 data-[state=on]:text-white"
        aria-label="Cancelled"
      >
        <X className="h-4 w-4" />
      </Toggle>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
                <p className="text-muted-foreground">Add, edit or remove airline and cargo schedules</p>
              </div>
              <div className="flex gap-2 items-center">
                <Tabs defaultValue="airline" className="w-full md:w-auto" onValueChange={(v) => setScheduleType(v as "airline" | "cargo")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="airline" className="flex items-center">
                      <Plane className="mr-2 h-4 w-4" />
                      Airline
                    </TabsTrigger>
                    <TabsTrigger value="cargo" className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      Cargo
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  onClick={handleGenerateReport}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>

            {editingSchedule ? (
              <Card className="shadow-md animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-primary" />
                    Edit {editingSchedule.type === "airline" ? "Airline" : "Cargo"} Schedule
                  </CardTitle>
                  <CardDescription>
                    Update the information for this schedule
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveEdit}>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Schedule Name</Label>
                        <Input 
                          id="edit-name" 
                          name="name" 
                          defaultValue={editingSchedule.name} 
                          placeholder={`e.g., ${scheduleType === "airline" ? "Lufthansa LH723" : "FedEx FX903"}`} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-origin">Origin</Label>
                        <Input 
                          id="edit-origin" 
                          name="origin" 
                          defaultValue={editingSchedule.origin} 
                          placeholder="e.g., New York (JFK)" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-destination">Destination</Label>
                        <Input 
                          id="edit-destination" 
                          name="destination" 
                          defaultValue={editingSchedule.destination} 
                          placeholder="e.g., London (LHR)" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="edit-departureDate">Departure Date</Label>
                          <Input 
                            id="edit-departureDate" 
                            name="departureDate" 
                            type="date" 
                            defaultValue={editingSchedule.departureDate} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-departureTime">Departure Time</Label>
                          <Input 
                            id="edit-departureTime" 
                            name="departureTime" 
                            type="time" 
                            defaultValue={editingSchedule.departureTime} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="edit-arrivalDate">Arrival Date</Label>
                          <Input 
                            id="edit-arrivalDate" 
                            name="arrivalDate" 
                            type="date" 
                            defaultValue={editingSchedule.arrivalDate} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-arrivalTime">Arrival Time</Label>
                          <Input 
                            id="edit-arrivalTime" 
                            name="arrivalTime" 
                            type="time" 
                            defaultValue={editingSchedule.arrivalTime} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      type="button"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-primary" />
                    Add New {scheduleType === "airline" ? "Airline" : "Cargo"} Schedule
                  </CardTitle>
                  <CardDescription>
                    Create a new {scheduleType === "airline" ? "flight" : "cargo shipment"} schedule
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleAddSchedule}>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Schedule Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder={`e.g., ${scheduleType === "airline" ? "Lufthansa LH723" : "FedEx FX903"}`} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Input 
                          id="origin" 
                          name="origin" 
                          placeholder="e.g., New York (JFK)" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input 
                          id="destination" 
                          name="destination" 
                          placeholder="e.g., London (LHR)" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="departureDate">Departure Date</Label>
                          <Input 
                            id="departureDate" 
                            name="departureDate" 
                            type="date" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="departureTime">Departure Time</Label>
                          <Input 
                            id="departureTime" 
                            name="departureTime" 
                            type="time" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="arrivalDate">Arrival Date</Label>
                          <Input 
                            id="arrivalDate" 
                            name="arrivalDate" 
                            type="date" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arrivalTime">Arrival Time</Label>
                          <Input 
                            id="arrivalTime" 
                            name="arrivalTime" 
                            type="time" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="ml-auto bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        <>
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Add Schedule
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Current Schedules</h2>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Route
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Departure
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Arrival
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {schedules
                          .filter((schedule) => schedule.type === scheduleType)
                          .map((schedule) => (
                            <tr key={schedule.id} className="hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center">
                                  {schedule.type === "airline" ? (
                                    <Plane className="h-4 w-4 text-primary mr-2" />
                                  ) : (
                                    <Truck className="h-4 w-4 text-accent mr-2" />
                                  )}
                                  {schedule.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex flex-col">
                                  <span>{schedule.origin}</span>
                                  <span className="text-muted-foreground">to</span>
                                  <span>{schedule.destination}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex flex-col">
                                  <span>
                                    {new Date(schedule.departureDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span className="text-muted-foreground">{schedule.departureTime}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex flex-col">
                                  <span>
                                    {new Date(schedule.arrivalDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span className="text-muted-foreground">{schedule.arrivalTime}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusToggleGroup id={schedule.id} currentStatus={schedule.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEditSchedule(schedule)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {schedules.filter((schedule) => schedule.type === scheduleType).length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                              No schedules found. Add a new schedule above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
