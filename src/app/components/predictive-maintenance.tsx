import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, MapPin, Gauge } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface MaintenanceBus {
  id: string;
  busNumber: string;
  currentMileage: number;
  serviceThreshold: number;
  lastService: string;
  autoCalculatedDistance?: number; // today's calculated route distance
}

interface PredictiveMaintenanceProps {
  buses: MaintenanceBus[];
  onEncodeMileage: (busId: string) => void;
}

export function PredictiveMaintenance({ buses, onEncodeMileage }: PredictiveMaintenanceProps) {
  const calculateProgress = (current: number, threshold: number) => {
    return (current / threshold) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-destructive";
    if (progress >= 75) return "bg-yellow-500";
    return "bg-green-600";
  };

  const handleVerifyMileage = (bus: MaintenanceBus) => {
    toast.success(`Mileage verified for ${bus.busNumber}: +${bus.autoCalculatedDistance} km`);
    // This would update the current mileage in real implementation
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle>Predictive Maintenance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Auto-calculated mileage tracking
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-4">
        <div className="space-y-3">
          {buses.map((bus) => {
            const progress = calculateProgress(bus.currentMileage, bus.serviceThreshold);
            const autoDistance = bus.autoCalculatedDistance || Math.floor(Math.random() * 100) + 100;
            
            return (
              <div key={bus.id} className="p-3 border rounded-lg bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{bus.busNumber}</p>
                    <Badge 
                      variant="outline" 
                      className={
                        progress >= 90 
                          ? "bg-red-50 text-red-700 border-red-200 text-xs px-2 py-0 h-5" 
                          : progress >= 75 
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200 text-xs px-2 py-0 h-5"
                          : "bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0 h-5"
                      }
                    >
                      {progress >= 90 ? "Urgent" : progress >= 75 ? "Due Soon" : "Normal"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bus.currentMileage.toLocaleString()} / {bus.serviceThreshold.toLocaleString()} km
                  </p>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-1.5"
                  indicatorClassName={getProgressColor(progress)}
                />

                {/* Auto-calculated Mileage Section */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-green-600" />
                    <p className="text-xs text-gray-600">
                      Auto: <span className="font-semibold text-gray-900">{autoDistance} km</span>
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleVerifyMileage({ ...bus, autoCalculatedDistance: autoDistance })}
                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                    size="sm"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verify
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}