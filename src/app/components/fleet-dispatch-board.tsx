import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { User, Bus, Clock, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  restStatus: "Available" | "On Break" | "On Duty";
}

interface BusResource {
  id: string;
  busNumber: string;
  capacity: number;
  status: "Available" | "In Use";
}

interface Trip {
  id: string;
  driverId: string | null;
  busId: string | null;
  departureTime: string;
}

interface RouteColumn {
  id: string;
  route: string;
  trips: Trip[];
}

const mockDrivers: Driver[] = [
  { id: "d1", name: "Juan Cruz", restStatus: "Available" },
  { id: "d2", name: "Maria Santos", restStatus: "Available" },
  { id: "d3", name: "Pedro Reyes", restStatus: "On Break" },
  { id: "d4", name: "Ana Garcia", restStatus: "Available" },
  { id: "d5", name: "Carlos Mendoza", restStatus: "On Duty" },
  { id: "d6", name: "Rosa Villanueva", restStatus: "Available" },
  { id: "d7", name: "Miguel Torres", restStatus: "Available" },
  { id: "d8", name: "Sofia Ramos", restStatus: "On Break" },
  { id: "d9", name: "Diego Fernandez", restStatus: "Available" },
  { id: "d10", name: "Carmen Lopez", restStatus: "Available" },
];

const mockBuses: BusResource[] = [
  { id: "b1", busNumber: "PB-001", capacity: 45, status: "Available" },
  { id: "b2", busNumber: "PB-008", capacity: 45, status: "In Use" },
  { id: "b3", busNumber: "PB-012", capacity: 52, status: "Available" },
  { id: "b4", busNumber: "PB-015", capacity: 45, status: "Available" },
  { id: "b5", busNumber: "PB-023", capacity: 52, status: "Available" },
  { id: "b6", busNumber: "PB-031", capacity: 45, status: "In Use" },
  { id: "b7", busNumber: "PB-042", capacity: 45, status: "Available" },
  { id: "b8", busNumber: "PB-056", capacity: 52, status: "Available" },
];

const initialRoutes: RouteColumn[] = [
  {
    id: "r1",
    route: "Cubao to Baguio",
    trips: [
      { id: "t1", driverId: "d5", busId: "b2", departureTime: "06:00" },
      { id: "t2", driverId: null, busId: null, departureTime: "" },
    ],
  },
  {
    id: "r2",
    route: "Manila to Tuguegarao",
    trips: [
      { id: "t3", driverId: null, busId: null, departureTime: "" },
    ],
  },
  {
    id: "r3",
    route: "Tarlac to Vigan",
    trips: [
      { id: "t4", driverId: null, busId: null, departureTime: "" },
    ],
  },
  {
    id: "r4",
    route: "Quezon City to Laoag",
    trips: [
      { id: "t5", driverId: null, busId: null, departureTime: "" },
    ],
  },
];

export function FleetDispatchBoard() {
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [buses] = useState<BusResource[]>(mockBuses);
  const [routes, setRoutes] = useState<RouteColumn[]>(initialRoutes);

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return null;
    return drivers.find(d => d.id === driverId)?.name;
  };

  const getBusNumber = (busId: string | null) => {
    if (!busId) return null;
    return buses.find(b => b.id === busId)?.busNumber;
  };

  const updateTrip = (routeId: string, tripId: string, field: keyof Trip, value: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          trips: route.trips.map(trip => 
            trip.id === tripId ? { ...trip, [field]: value } : trip
          ),
        };
      }
      return route;
    }));
  };

  const addTrip = (routeId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          trips: [
            ...route.trips,
            {
              id: `t${Date.now()}`,
              driverId: null,
              busId: null,
              departureTime: "",
            },
          ],
        };
      }
      return route;
    }));
  };

  const removeTrip = (routeId: string, tripId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          trips: route.trips.filter(trip => trip.id !== tripId),
        };
      }
      return route;
    }));
  };

  const isTripComplete = (trip: Trip) => {
    return trip.driverId && trip.busId && trip.departureTime;
  };

  const getRestStatusBadge = (status: Driver["restStatus"]) => {
    switch (status) {
      case "Available":
        return <Badge variant="outline" className="text-green-700 border-green-700 text-xs">Available</Badge>;
      case "On Break":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">On Break</Badge>;
      case "On Duty":
        return <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">On Duty</Badge>;
    }
  };

  const getBusStatusBadge = (status: BusResource["status"]) => {
    if (status === "Available") {
      return <Badge variant="outline" className="text-green-700 border-green-700 text-xs">Available</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600 border-gray-600 text-xs">In Use</Badge>;
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Daily Fleet Dispatch</h1>
        <p className="text-muted-foreground">
          Assign drivers and buses to scheduled routes
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100%-5rem)]">
        {/* Left Sidebar - Available Resources */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Available Drivers */}
          <Card className="h-[calc(50%-0.5rem)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Available Drivers/Conductors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100%-1rem)]">
                <div className="space-y-2 pr-4">
                  {drivers.map(driver => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {driver.id.toUpperCase()}</p>
                      </div>
                      {getRestStatusBadge(driver.restStatus)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Available Buses */}
          <Card className="h-[calc(50%-0.5rem)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Available Buses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100%-1rem)]">
                <div className="space-y-2 pr-4">
                  {buses.map(bus => (
                    <div
                      key={bus.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{bus.busNumber}</p>
                        <p className="text-xs text-muted-foreground">Capacity: {bus.capacity} seats</p>
                      </div>
                      {getBusStatusBadge(bus.status)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Dispatch Schedule Board */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex gap-4 pb-4">
              {routes.map(route => (
                <div key={route.id} className="w-80 flex-shrink-0">
                  <Card className="border-primary">
                    <CardHeader className="pb-3 bg-primary/5">
                      <CardTitle className="text-sm">{route.route}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {route.trips.filter(isTripComplete).length} / {route.trips.length} trips assigned
                      </p>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {route.trips.map(trip => (
                          <Card
                            key={trip.id}
                            className={`border-2 ${
                              isTripComplete(trip)
                                ? "border-green-500 bg-green-50"
                                : "border-dashed border-gray-300"
                            }`}
                          >
                            <CardContent className="p-4 space-y-3">
                              {isTripComplete(trip) && (
                                <div className="flex items-center gap-2 text-green-700 mb-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="text-xs">Trip Assigned</span>
                                </div>
                              )}
                              
                              <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  Driver
                                </label>
                                <Select
                                  value={trip.driverId || ""}
                                  onValueChange={(value) => updateTrip(route.id, trip.id, "driverId", value)}
                                >
                                  <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Select driver" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {drivers
                                      .filter(d => d.restStatus === "Available")
                                      .map(driver => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                          {driver.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Bus className="h-3 w-3" />
                                  Bus
                                </label>
                                <Select
                                  value={trip.busId || ""}
                                  onValueChange={(value) => updateTrip(route.id, trip.id, "busId", value)}
                                >
                                  <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Select bus" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {buses
                                      .filter(b => b.status === "Available")
                                      .map(bus => (
                                        <SelectItem key={bus.id} value={bus.id}>
                                          {bus.busNumber} ({bus.capacity} seats)
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Departure Time
                                </label>
                                <Input
                                  type="time"
                                  value={trip.departureTime}
                                  onChange={(e) => updateTrip(route.id, trip.id, "departureTime", e.target.value)}
                                  className="h-9 text-sm"
                                />
                              </div>

                              {isTripComplete(trip) && (
                                <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                                  <p><strong>Driver:</strong> {getDriverName(trip.driverId)}</p>
                                  <p><strong>Bus:</strong> {getBusNumber(trip.busId)}</p>
                                  <p><strong>Departure:</strong> {trip.departureTime}</p>
                                </div>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                                onClick={() => removeTrip(route.id, trip.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Remove Trip
                              </Button>
                            </CardContent>
                          </Card>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-dashed"
                          onClick={() => addTrip(route.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
