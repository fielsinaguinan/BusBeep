import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Wrench, AlertTriangle, CheckCircle } from "lucide-react";

interface MaintenanceAlert {
  id: string;
  busNumber: string;
  currentMileage: number;
  nextServiceThreshold: number;
  requiredService: string;
  status: "Overdue" | "Due Soon" | "On Schedule";
}

const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    busNumber: "PB-008",
    currentMileage: 30500,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Overdue",
  },
  {
    id: "2",
    busNumber: "PB-012",
    currentMileage: 29800,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Due Soon",
  },
  {
    id: "3",
    busNumber: "PB-031",
    currentMileage: 29100,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Due Soon",
  },
  {
    id: "4",
    busNumber: "PB-015",
    currentMileage: 44200,
    nextServiceThreshold: 45000,
    requiredService: "Brake Inspection",
    status: "Due Soon",
  },
  {
    id: "5",
    busNumber: "PB-023",
    currentMileage: 60800,
    nextServiceThreshold: 60000,
    requiredService: "Major Service & Inspection",
    status: "Overdue",
  },
  {
    id: "6",
    busNumber: "PB-042",
    currentMileage: 18500,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "On Schedule",
  },
  {
    id: "7",
    busNumber: "PB-056",
    currentMileage: 25200,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "On Schedule",
  },
  {
    id: "8",
    busNumber: "PB-001",
    currentMileage: 89700,
    nextServiceThreshold: 90000,
    requiredService: "Tire Rotation & Alignment",
    status: "Due Soon",
  },
];

export function MaintenanceDashboard() {
  const [busNumber, setBusNumber] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(mockMaintenanceAlerts);

  const handleEncodeMileage = () => {
    if (!busNumber || !odometerReading) {
      alert("Please enter both Bus Number and Odometer Reading");
      return;
    }

    const mileage = parseInt(odometerReading);
    if (isNaN(mileage) || mileage < 0) {
      alert("Please enter a valid odometer reading");
      return;
    }

    // Update the mileage for the bus if it exists in alerts
    const updatedAlerts = alerts.map(alert => {
      if (alert.busNumber === busNumber) {
        const newMileage = mileage;
        let newStatus: "Overdue" | "Due Soon" | "On Schedule" = "On Schedule";
        
        if (newMileage >= alert.nextServiceThreshold) {
          newStatus = "Overdue";
        } else if (newMileage >= alert.nextServiceThreshold - 1000) {
          newStatus = "Due Soon";
        }

        return {
          ...alert,
          currentMileage: newMileage,
          status: newStatus,
        };
      }
      return alert;
    });

    setAlerts(updatedAlerts);
    alert(`Mileage updated successfully!\n\nBus: ${busNumber}\nNew Odometer Reading: ${mileage.toLocaleString()} km`);
    
    // Reset form
    setBusNumber("");
    setOdometerReading("");
  };

  const getRowClassName = (status: string) => {
    switch (status) {
      case "Overdue":
        return "bg-red-50 hover:bg-red-100";
      case "Due Soon":
        return "bg-yellow-50 hover:bg-yellow-100";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Overdue":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      case "Due Soon":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Due Soon
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-green-700 border-green-700">
            <CheckCircle className="h-3 w-3" />
            On Schedule
          </Badge>
        );
    }
  };

  const overdueCount = alerts.filter(a => a.status === "Overdue").length;
  const dueSoonCount = alerts.filter(a => a.status === "Due Soon").length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Predictive Maintenance</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Services</p>
                <p className="text-2xl text-destructive mt-1">{overdueCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Soon</p>
                <p className="text-2xl text-yellow-600 mt-1">{dueSoonCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Schedule</p>
                <p className="text-2xl text-green-700 mt-1">{alerts.length - overdueCount - dueSoonCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Daily Mileage Form */}
      <Card className="mb-6 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Update Daily Mileage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="busNumber">Bus Number</Label>
              <Input
                id="busNumber"
                placeholder="e.g., PB-001"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                autoComplete="off"
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odometerReading">Ending Odometer Reading (km)</Label>
              <Input
                id="odometerReading"
                type="number"
                placeholder="Enter current odometer reading"
                value={odometerReading}
                onChange={(e) => setOdometerReading(e.target.value)}
                autoComplete="off"
                className="text-lg h-12"
              />
            </div>
            <Button 
              size="lg" 
              className="w-full h-14 text-lg gap-2"
              onClick={handleEncodeMileage}
            >
              <Wrench className="h-5 w-5" />
              Encode Mileage
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Enter the bus number and current odometer reading to update the maintenance tracking system
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Maintenance Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance Alerts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Buses requiring service attention based on current mileage
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus Number</TableHead>
                <TableHead>Current Mileage</TableHead>
                <TableHead>Next Service Threshold</TableHead>
                <TableHead>Required Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  className={getRowClassName(alert.status)}
                >
                  <TableCell>{alert.busNumber}</TableCell>
                  <TableCell>{alert.currentMileage.toLocaleString()} km</TableCell>
                  <TableCell>{alert.nextServiceThreshold.toLocaleString()} km</TableCell>
                  <TableCell>{alert.requiredService}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4 mt-6">
        <p className="text-sm text-accent-foreground">
          <strong>Maintenance Guidelines:</strong>
          <br />
          • Update odometer readings daily for accurate tracking
          <br />
          • Service intervals: Oil Change every 30,000 km, Brake Inspection every 45,000 km
          <br />
          • Rows highlighted in red indicate overdue services requiring immediate attention
          <br />
          • Yellow highlights indicate services due within 1,000 km
        </p>
      </div>
    </div>
  );
}
