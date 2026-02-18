import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Bus, User, Gauge, MapPin, Circle, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

interface BusUnit {
  id: string;
  busNumber: string;
  driver: string;
  speed: number;
  location: string;
  position: { x: number; y: number }; // Position on the map in percentage
  status: "on-time" | "delayed" | "offline";
  route: string;
  lastUpdate: string;
}

const initialBuses: BusUnit[] = [
  {
    id: "1",
    busNumber: "PB-888",
    driver: "Juan Dela Cruz",
    speed: 85,
    location: "Near San Miguel Exit",
    position: { x: 75, y: 15 },
    status: "on-time",
    route: "Manila - Baguio via NLEX",
    lastUpdate: "2 mins ago",
  },
  {
    id: "2",
    busNumber: "PB-042",
    driver: "Maria Santos",
    speed: 78,
    location: "Plaridel Tollgate",
    position: { x: 60, y: 30 },
    status: "on-time",
    route: "Manila - Tuguegarao via NLEX",
    lastUpdate: "1 min ago",
  },
  {
    id: "3",
    busNumber: "PB-156",
    driver: "Carlos Reyes",
    speed: 45,
    location: "Bocaue Traffic Area",
    position: { x: 35, y: 55 },
    status: "delayed",
    route: "Manila - Tarlac via NLEX",
    lastUpdate: "Just now",
  },
  {
    id: "4",
    busNumber: "PB-231",
    driver: "Rosa Garcia",
    speed: 92,
    location: "Guiguinto Rest Stop",
    position: { x: 48, y: 42 },
    status: "on-time",
    route: "Manila - Baguio via NLEX",
    lastUpdate: "3 mins ago",
  },
  {
    id: "5",
    busNumber: "PB-015",
    driver: "Pedro Martinez",
    speed: 0,
    location: "Balintawak Terminal",
    position: { x: 20, y: 85 },
    status: "offline",
    route: "Manila - Laoag via NLEX",
    lastUpdate: "15 mins ago",
  },
  {
    id: "6",
    busNumber: "PB-377",
    driver: "Ana Hernandez",
    speed: 82,
    location: "San Rafael Northbound",
    position: { x: 68, y: 22 },
    status: "on-time",
    route: "Manila - Baguio via NLEX",
    lastUpdate: "2 mins ago",
  },
];

// Route waypoints for the NLEX line
const routePoints = [
  { x: 18, y: 88, label: "Manila (Balintawak)" },
  { x: 25, y: 78, label: "Valenzuela" },
  { x: 30, y: 68, label: "Meycauayan" },
  { x: 35, y: 58, label: "Marilao" },
  { x: 40, y: 50, label: "Bocaue" },
  { x: 45, y: 44, label: "Balagtas" },
  { x: 50, y: 38, label: "Guiguinto" },
  { x: 58, y: 32, label: "Plaridel" },
  { x: 65, y: 25, label: "San Rafael" },
  { x: 72, y: 18, label: "San Miguel" },
];

export function LiveFleetMap() {
  const [buses, setBuses] = useState<BusUnit[]>(initialBuses);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((currentBuses) =>
        currentBuses.map((bus) => {
          if (bus.status === "offline") return bus;

          // Simulate speed variation
          const speedChange = Math.random() * 10 - 5;
          const newSpeed = Math.max(40, Math.min(95, bus.speed + speedChange));

          // Simulate position movement along the route (northbound = decreasing y)
          const positionChange = bus.status === "delayed" ? 0.1 : 0.3;
          let newY = bus.position.y - positionChange;
          let newX = bus.position.x + positionChange * 0.5;

          // Reset to start when reaching the end
          if (newY < 15) {
            newY = 85;
            newX = 20;
          }

          return {
            ...bus,
            speed: Math.round(newSpeed),
            position: { x: newX, y: newY },
            lastUpdate: "Just now",
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: BusUnit["status"]) => {
    switch (status) {
      case "on-time":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
            <Circle className="h-2 w-2 mr-1 fill-current" />
            On Time
          </Badge>
        );
      case "delayed":
        return (
          <Badge variant="destructive" className="text-xs">
            <Circle className="h-2 w-2 mr-1 fill-current" />
            Delayed
          </Badge>
        );
      case "offline":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-400 text-xs">
            <Circle className="h-2 w-2 mr-1 fill-current" />
            Offline
          </Badge>
        );
    }
  };

  const getStatusColor = (status: BusUnit["status"]) => {
    switch (status) {
      case "on-time":
        return "#22c55e";
      case "delayed":
        return "#ef4444";
      case "offline":
        return "#6b7280";
    }
  };

  const activeCount = buses.filter((b) => b.status !== "offline").length;
  const onTimeCount = buses.filter((b) => b.status === "on-time").length;
  const delayedCount = buses.filter((b) => b.status === "delayed").length;

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl mb-2">Live Fleet Map</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Units</p>
                <p className="text-2xl">{activeCount}</p>
              </div>
              <Bus className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">On Time</p>
                <p className="text-2xl text-green-600">{onTimeCount}</p>
              </div>
              <Circle className="h-6 w-6 text-green-600 fill-current" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Delayed</p>
                <p className="text-2xl text-red-600">{delayedCount}</p>
              </div>
              <Circle className="h-6 w-6 text-red-600 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 h-[calc(100%-10rem)]">
        {/* Map Container */}
        <div className="flex-1 rounded-lg overflow-hidden border shadow-lg bg-slate-50 relative">
          {/* Map Header */}
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3 border">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">NLEX Route - Manila to Pampanga</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button size="icon" variant="outline" className="bg-white shadow-md">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="bg-white shadow-md">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="bg-white shadow-md">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Canvas with Route */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* NLEX Route Line */}
            <polyline
              points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Route Waypoints */}
            {routePoints.map((point, index) => (
              <g key={index}>
                <circle cx={point.x} cy={point.y} r="0.8" fill="#3b82f6" opacity="0.6" />
                <text
                  x={point.x + 2}
                  y={point.y}
                  fontSize="2"
                  fill="#475569"
                  className="pointer-events-none"
                >
                  {point.label}
                </text>
              </g>
            ))}

            {/* Bus Markers */}
            {buses.map((bus) => (
              <g
                key={bus.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredBus(bus.id)}
                onMouseLeave={() => setHoveredBus(null)}
                onClick={() => setSelectedBus(bus.id)}
              >

                {/* Bus marker circle */}
                <circle
                  cx={bus.position.x}
                  cy={bus.position.y}
                  r="1.5"
                  fill={getStatusColor(bus.status)}
                  stroke="white"
                  strokeWidth="0.4"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                    transform:
                      selectedBus === bus.id || hoveredBus === bus.id
                        ? "scale(1.3)"
                        : "scale(1)",
                    transformOrigin: `${bus.position.x}% ${bus.position.y}%`,
                    transition: "transform 0.2s",
                  }}
                />

                {/* Bus number label */}
                {(selectedBus === bus.id || hoveredBus === bus.id) && (
                  <g>
                    <rect
                      x={bus.position.x - 3}
                      y={bus.position.y - 5}
                      width="6"
                      height="2.5"
                      fill="white"
                      stroke={getStatusColor(bus.status)}
                      strokeWidth="0.2"
                      rx="0.3"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                    />
                    <text
                      x={bus.position.x}
                      y={bus.position.y - 3}
                      fontSize="1.2"
                      fill={getStatusColor(bus.status)}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {bus.busNumber}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>

          {/* Tooltip for selected bus */}
          {selectedBus && (
            <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 border max-w-xs">
              {buses
                .filter((b) => b.id === selectedBus)
                .map((bus) => (
                  <div key={bus.id}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{bus.busNumber}</h4>
                      {getStatusBadge(bus.status)}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Driver:</strong> {bus.driver}
                      </p>
                      <p>
                        <strong>Location:</strong> {bus.location}
                      </p>
                      <p>
                        <strong>Route:</strong> {bus.route}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {bus.lastUpdate}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={() => setSelectedBus(null)}
                    >
                      Close
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Active Units Sidebar */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Active Units
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {activeCount} buses currently on route
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <div className="space-y-3 pr-4">
                {buses.map((bus) => (
                  <Card
                    key={bus.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBus === bus.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedBus(bus.id)}
                    onMouseEnter={() => setHoveredBus(bus.id)}
                    onMouseLeave={() => setHoveredBus(null)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{bus.busNumber}</h4>
                        </div>
                        {getStatusBadge(bus.status)}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{bus.driver}</span>
                        </div>


                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{bus.location}</span>
                        </div>

                        <div className="pt-1 border-t mt-2">
                          <p className="text-xs text-muted-foreground">{bus.route}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated: {bus.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
          <span>On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white shadow"></div>
          <span>Offline/Garage</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-8 h-1 bg-blue-500"></div>
          <span>NLEX Route</span>
        </div>
      </div>
    </div>
  );
}
