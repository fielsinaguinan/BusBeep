import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, MapPin, Edit, Trash2, ChevronDown } from "lucide-react";

interface FleetUnit {
  id: string;
  busNumber: string;
  driver: string;
  destination: string;
  departureTime: string;
  status: "Active" | "On Break" | "On Leave";
  currentLocation?: string;
}

// Predefined options for dropdowns
const busNumbers = [
  "PB-001", "PB-012", "PB-015", "PB-023", "PB-034", "PB-042", "PB-056", "PB-067", "PB-078", "PB-089"
];

const drivers = [
  "Juan Cruz", "Maria Santos", "Pedro Reyes", "Ana Garcia", "Carlos Mendoza", 
  "Rosa Villanueva", "Miguel Torres", "Elena Ramos", "Jose Fernandez", "Linda Sanchez"
];

const destinations = [
  "Manila to Baguio",
  "Quezon City to Tuguegarao",
  "Tarlac to Vigan",
  "Pangasinan to Laoag",
  "Nueva Ecija to Isabela",
  "Manila to Dagupan",
  "Cubao to Santiago",
  "Grace Park to Baguio",
  "Pasay to Tuguegarao"
];

const mockFleetData: FleetUnit[] = [
  {
    id: "1",
    busNumber: "PB-001",
    driver: "Juan Cruz",
    destination: "Manila to Baguio",
    departureTime: "06:00 AM",
    status: "Active",
    currentLocation: "NLEX Dau Exit",
  },
  {
    id: "2",
    busNumber: "PB-015",
    driver: "Maria Santos",
    destination: "Quezon City to Tuguegarao",
    departureTime: "07:30 AM",
    status: "Active",
    currentLocation: "Sta. Maria, Bulacan",
  },
  {
    id: "3",
    busNumber: "PB-023",
    driver: "Pedro Reyes",
    destination: "Tarlac to Vigan",
    departureTime: "08:00 AM",
    status: "Active",
    currentLocation: "Tarlac Terminal",
  },
  {
    id: "4",
    busNumber: "PB-042",
    driver: "Ana Garcia",
    destination: "Pangasinan to Laoag",
    departureTime: "09:00 AM",
    status: "Active",
    currentLocation: "Pozorrubio",
  },
  {
    id: "5",
    busNumber: "PB-056",
    driver: "Carlos Mendoza",
    destination: "Nueva Ecija to Isabela",
    departureTime: "10:15 AM",
    status: "Active",
    currentLocation: "Cabanatuan Terminal",
  },
  {
    id: "6",
    busNumber: "PB-012",
    driver: "Rosa Villanueva",
    destination: "Manila to Dagupan",
    departureTime: "11:00 AM",
    status: "On Break",
    currentLocation: "Rest Stop - San Fernando",
  },
  {
    id: "7",
    busNumber: "PB-034",
    driver: "Miguel Torres",
    destination: "Off Duty",
    departureTime: "-",
    status: "On Leave",
    currentLocation: "Garage",
  },
];

export function FleetScheduleImproved() {
  const [activeTab, setActiveTab] = useState("active");
  const [units, setUnits] = useState(mockFleetData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    busNumber: "",
    driver: "",
    destination: "",
    departureTime: "",
    status: "Active" as FleetUnit["status"]
  });

  const filteredUnits = units.filter((unit) => {
    if (activeTab === "active") return unit.status === "Active";
    if (activeTab === "on-break") return unit.status === "On Break";
    if (activeTab === "on-leave") return unit.status === "On Leave";
    return true;
  });

  const getStatusBadge = (status: FleetUnit["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "On Break":
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">On Break</Badge>;
      case "On Leave":
        return <Badge variant="outline">On Leave</Badge>;
    }
  };

  const handleStatusChange = (id: string, newStatus: FleetUnit["status"]) => {
    setUnits(units.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fleet Schedule</h1>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#15803d] hover:bg-[#166534]">
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      {/* Add Trip Form */}
      {showAddForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Schedule New Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bus Number</label>
                <Select value={newTrip.busNumber} onValueChange={(value) => setNewTrip({...newTrip, busNumber: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select bus number" />
                  </SelectTrigger>
                  <SelectContent>
                    {busNumbers.map((bus) => (
                      <SelectItem key={bus} value={bus}>
                        {bus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Driver Name</label>
                <Select value={newTrip.driver} onValueChange={(value) => setNewTrip({...newTrip, driver: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver} value={driver}>
                        {driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium mb-2 block">Destination</label>
                <Select value={newTrip.destination} onValueChange={(value) => setNewTrip({...newTrip, destination: value})}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select route" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Departure Time</label>
                <Input 
                  type="time" 
                  value={newTrip.departureTime}
                  onChange={(e) => setNewTrip({...newTrip, departureTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={newTrip.status} onValueChange={(value) => setNewTrip({...newTrip, status: value as FleetUnit["status"]})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Break">On Break</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="bg-[#15803d] hover:bg-[#166534]">Save Trip</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">
            Active ({units.filter(u => u.status === "Active").length})
          </TabsTrigger>
          <TabsTrigger value="on-break">
            On Break ({units.filter(u => u.status === "On Break").length})
          </TabsTrigger>
          <TabsTrigger value="on-leave">
            On Leave ({units.filter(u => u.status === "On Leave").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus #</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No units found in this category
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.busNumber}</TableCell>
                      <TableCell>{unit.driver}</TableCell>
                      <TableCell>{unit.destination}</TableCell>
                      <TableCell>{unit.departureTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{unit.currentLocation}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={unit.status}
                          onValueChange={(value) => handleStatusChange(unit.id, value as FleetUnit["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Break">On Break</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Loading Skeleton */}
          {false && (
            <Card className="mt-4">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
                      <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}