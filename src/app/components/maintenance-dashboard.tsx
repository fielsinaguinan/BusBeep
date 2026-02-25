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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Wrench, AlertTriangle, CheckCircle, Info, Gauge } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceAlert {
  id: string;
  busNumber: string;
  currentMileage: number;
  nextServiceThreshold: number;
  requiredService: string;
  status: "Overdue" | "Due Soon" | "On Schedule";
  autoCalculatedDaily?: number; // Today's auto-calculated mileage
}

const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    busNumber: "PB-008",
    currentMileage: 30500,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Overdue",
    autoCalculatedDaily: 178
  },
  {
    id: "2",
    busNumber: "PB-012",
    currentMileage: 29800,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Due Soon",
    autoCalculatedDaily: 142
  },
  {
    id: "3",
    busNumber: "PB-031",
    currentMileage: 29100,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "Due Soon",
    autoCalculatedDaily: 165
  },
  {
    id: "4",
    busNumber: "PB-015",
    currentMileage: 44200,
    nextServiceThreshold: 45000,
    requiredService: "Brake Inspection",
    status: "Due Soon",
    autoCalculatedDaily: 189
  },
  {
    id: "5",
    busNumber: "PB-023",
    currentMileage: 60800,
    nextServiceThreshold: 60000,
    requiredService: "Major Service & Inspection",
    status: "Overdue",
    autoCalculatedDaily: 156
  },
  {
    id: "6",
    busNumber: "PB-042",
    currentMileage: 18500,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "On Schedule",
    autoCalculatedDaily: 134
  },
  {
    id: "7",
    busNumber: "PB-056",
    currentMileage: 25200,
    nextServiceThreshold: 30000,
    requiredService: "Oil Change & Filter",
    status: "On Schedule",
    autoCalculatedDaily: 198
  },
  {
    id: "8",
    busNumber: "PB-001",
    currentMileage: 89700,
    nextServiceThreshold: 90000,
    requiredService: "Tire Rotation & Alignment",
    status: "Due Soon",
    autoCalculatedDaily: 172
  },
];

export function MaintenanceDashboard() {
  const [busNumber, setBusNumber] = useState("");
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(mockMaintenanceAlerts);
  const [selectedBusAlert, setSelectedBusAlert] = useState<MaintenanceAlert | null>(null);

  const handleBusNumberChange = (value: string) => {
    setBusNumber(value);
    const alert = alerts.find(a => a.busNumber === value);
    setSelectedBusAlert(alert || null);
  };

  const handleVerifyMileage = () => {
    if (!busNumber || !selectedBusAlert) {
      toast.error("Please enter a valid Bus Number");
      return;
    }

    const newMileage = selectedBusAlert.currentMileage + (selectedBusAlert.autoCalculatedDaily || 0);
    
    // Update the mileage for the bus
    const updatedAlerts = alerts.map(alert => {
      if (alert.busNumber === busNumber) {
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
    toast.success(`Mileage verified and logged for ${busNumber}`, {
      description: `Added ${selectedBusAlert.autoCalculatedDaily} km from QR scan tracking`
    });
    
    // Reset form
    setBusNumber("");
    setSelectedBusAlert(null);
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
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-3xl mb-2">Preventive Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          Automated mileage tracking with QR code terminal scan integration
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-4 flex-shrink-0">
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

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-5 flex-1 overflow-hidden">
        {/* Update Daily Mileage Form */}
        <Card className="lg:col-span-2 border-primary flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-5 w-5" />
              Update Daily Mileage
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {/* Helper Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-900">
                <strong>Automated Tracking:</strong> Mileage is automatically calculated from terminal QR code scans. 
                Please verify against physical odometer if necessary.
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Select value={busNumber} onValueChange={handleBusNumberChange}>
                  <SelectTrigger className="text-lg h-11">
                    <SelectValue placeholder="Select bus number" />
                  </SelectTrigger>
                  <SelectContent>
                    {alerts.map((alert) => (
                      <SelectItem key={alert.busNumber} value={alert.busNumber}>
                        {alert.busNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBusAlert && (
                <>
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-base font-bold text-green-700 mb-3">
                      Auto-Calculated Mileage for Today: {selectedBusAlert.autoCalculatedDaily} km
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Odometer:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedBusAlert.currentMileage.toLocaleString()} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">After Update:</span>
                        <span className="font-semibold text-green-700">
                          {(selectedBusAlert.currentMileage + (selectedBusAlert.autoCalculatedDaily || 0)).toLocaleString()} km
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button 
                size="lg" 
                className="w-full h-12 text-base gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleVerifyMileage}
                disabled={!selectedBusAlert}
              >
                <CheckCircle className="h-5 w-5" />
                Verify & Log Mileage
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                System automatically tracks mileage from QR code scans at terminals
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance Alerts Table */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-lg">Upcoming Maintenance Alerts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Buses requiring service attention based on current mileage
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="bg-white">Bus Number</TableHead>
                    <TableHead className="bg-white">Current Mileage</TableHead>
                    <TableHead className="bg-white">Next Service</TableHead>
                    <TableHead className="bg-white">Required Service</TableHead>
                    <TableHead className="bg-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow 
                      key={alert.id}
                      className={getRowClassName(alert.status)}
                    >
                      <TableCell className="font-medium">{alert.busNumber}</TableCell>
                      <TableCell>{alert.currentMileage.toLocaleString()} km</TableCell>
                      <TableCell>{alert.nextServiceThreshold.toLocaleString()} km</TableCell>
                      <TableCell className="text-sm">{alert.requiredService}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-accent border border-accent-foreground/20 rounded-lg p-3 mt-4 flex-shrink-0">
        <p className="text-xs text-accent-foreground">
          <strong>Maintenance Guidelines:</strong> Mileage is tracked automatically via QR terminal scans and GPS route completion • Service intervals: Oil Change every 30,000 km, Brake Inspection every 45,000 km • Rows highlighted in red indicate overdue services requiring immediate attention • Yellow highlights indicate services due within 1,000 km
        </p>
      </div>
    </div>
  );
}