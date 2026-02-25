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
import { Plus, MapPin, Edit, Trash2, Smartphone, Edit2, Calendar } from "lucide-react";
import { cn } from "./ui/utils";

interface FleetUnit {
  id: string;
  busNumber: string;
  driver: string;
  destination: string;
  departureTime: string;
  status: "Active" | "On Break" | "On Leave";
  currentLocation?: string;
  isLive?: boolean;
  lastSynced?: number;
  deviceId?: string;
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
    isLive: true,
    deviceId: "1247"
  },
  {
    id: "2",
    busNumber: "PB-015",
    driver: "Maria Santos",
    destination: "Quezon City to Tuguegarao",
    departureTime: "07:30 AM",
    status: "Active",
    currentLocation: "Sta. Maria, Bulacan",
    isLive: true,
    deviceId: "1583"
  },
  {
    id: "3",
    busNumber: "PB-023",
    driver: "Pedro Reyes",
    destination: "Tarlac to Vigan",
    departureTime: "08:00 AM",
    status: "Active",
    currentLocation: "Tarlac Terminal",
    isLive: false,
    lastSynced: 5,
    deviceId: "1892"
  },
  {
    id: "4",
    busNumber: "PB-042",
    driver: "Ana Garcia",
    destination: "Pangasinan to Laoag",
    departureTime: "09:00 AM",
    status: "Active",
    currentLocation: "Pozorrubio",
    isLive: true,
    deviceId: "2014"
  },
  {
    id: "5",
    busNumber: "PB-056",
    driver: "Carlos Mendoza",
    destination: "Nueva Ecija to Isabela",
    departureTime: "10:15 AM",
    status: "Active",
    currentLocation: "Cabanatuan Terminal",
    isLive: false,
    lastSynced: 18,
    deviceId: "2156"
  },
  {
    id: "6",
    busNumber: "PB-012",
    driver: "Rosa Villanueva",
    destination: "Manila to Dagupan",
    departureTime: "11:00 AM",
    status: "On Break",
    currentLocation: "Rest Stop - San Fernando",
    isLive: true,
    deviceId: "1329"
  },
  {
    id: "7",
    busNumber: "PB-034",
    driver: "Miguel Torres",
    destination: "Off Duty",
    departureTime: "-",
    status: "On Leave",
    currentLocation: "Garage",
    isLive: false,
    lastSynced: 120,
    deviceId: "1654"
  },
];

export function FleetScheduleImproved() {
  const [activeTab, setActiveTab] = useState("active");
  const [units, setUnits] = useState(mockFleetData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [newTrip, setNewTrip] = useState({
    busNumber: "",
    driver: "",
    destination: "",
    departureDate: "",
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
        return "bg-green-100 text-green-700 border-green-200";
      case "On Break":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "On Leave":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleStatusChange = (id: string, newStatus: FleetUnit["status"]) => {
    setUnits(units.map(unit => 
      unit.id === id ? { ...unit, status: newStatus } : unit
    ));
    setEditingStatusId(null);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fleet Schedule</h1>
          <p className="text-sm text-muted-foreground">Real-time GPS tracking with automated status updates</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#15803d] hover:bg-[#166534]">
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      {/* Add Trip Form */}
      {showAddForm && (
        <Card className="border-2 border-primary mb-4 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle>Schedule New Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Bus Number</label>
                <Select value={newTrip.busNumber} onValueChange={(value) => setNewTrip({...newTrip, busNumber: value})}>
                  <SelectTrigger className="w-full h-9">
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
                <label className="text-sm font-medium mb-1 block">Driver Name</label>
                <Select value={newTrip.driver} onValueChange={(value) => setNewTrip({...newTrip, driver: value})}>
                  <SelectTrigger className="w-full h-9">
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
                <label className="text-sm font-medium mb-1 block">Destination</label>
                <Select value={newTrip.destination} onValueChange={(value) => setNewTrip({...newTrip, destination: value})}>
                  <SelectTrigger className="w-full h-9">
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
                <label className="text-sm font-medium mb-1 block">Departure Date</label>
                <div className="relative">
                  <Input 
                    type="date" 
                    value={newTrip.departureDate}
                    onChange={(e) => setNewTrip({...newTrip, departureDate: e.target.value})}
                    className="pr-10 h-9"
                  />
                  <Calendar className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Departure Time</label>
                <Input 
                  type="time" 
                  value={newTrip.departureTime}
                  onChange={(e) => setNewTrip({...newTrip, departureTime: e.target.value})}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={newTrip.status} onValueChange={(value) => setNewTrip({...newTrip, status: value as FleetUnit["status"]})}>
                  <SelectTrigger className="h-9">
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
            <div className="flex gap-2 mt-3">
              <Button className="bg-[#15803d] hover:bg-[#166534] h-9">Save Trip</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="h-9">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full max-w-md grid-cols-3 flex-shrink-0 mb-4">
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

        <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-0">
          <Card className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="bg-white">Bus #</TableHead>
                    <TableHead className="bg-white">Driver</TableHead>
                    <TableHead className="bg-white">Destination</TableHead>
                    <TableHead className="bg-white">Departure</TableHead>
                    <TableHead className="bg-white">Current Location</TableHead>
                    <TableHead className="bg-white">Signal Status</TableHead>
                    <TableHead className="bg-white">Status</TableHead>
                    <TableHead className="text-right bg-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No units found in this category
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUnits.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell className="font-medium">{unit.busNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div>{unit.driver}</div>
                            {unit.deviceId && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <Smartphone className="h-3 w-3" />
                                <span>GPS: Conductor App - ID {unit.deviceId}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{unit.destination}</TableCell>
                        <TableCell>{unit.departureTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{unit.currentLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {unit.isLive !== false ? (
                              <>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-sm text-green-600 font-medium">Live</span>
                              </>
                            ) : (
                              <>
                                <span className="relative flex h-2 w-2">
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                <span className="text-sm text-yellow-600">
                                  Offline ({unit.lastSynced}m)
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingStatusId === unit.id ? (
                            <div className="flex gap-2">
                              <select
                                value={unit.status}
                                onChange={(e) => handleStatusChange(unit.id, e.target.value as FleetUnit["status"])}
                                className="text-sm border rounded px-2 py-1"
                                autoFocus
                              >
                                <option value="Active">Active</option>
                                <option value="On Break">On Break</option>
                                <option value="On Leave">On Leave</option>
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStatusId(null)}
                                className="h-7 px-2"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-medium border",
                                  getStatusBadge(unit.status)
                                )}
                              >
                                {unit.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingStatusId(unit.id)}
                                className="h-6 w-6 opacity-50 hover:opacity-100"
                                title="Manual override"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}