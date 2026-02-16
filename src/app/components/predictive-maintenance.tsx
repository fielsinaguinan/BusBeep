import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Edit3 } from "lucide-react";

interface MaintenanceBus {
  id: string;
  busNumber: string;
  currentMileage: number;
  serviceThreshold: number;
  lastService: string;
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
    return "bg-primary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Maintenance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Buses approaching their service limits
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {buses.map((bus) => {
            const progress = calculateProgress(bus.currentMileage, bus.serviceThreshold);
            return (
              <div key={bus.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{bus.busNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {bus.currentMileage.toLocaleString()} / {bus.serviceThreshold.toLocaleString()} km
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last service: {bus.lastService}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEncodeMileage(bus.id)}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Encode Daily Mileage
                  </Button>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={progress} 
                    className="h-2"
                    indicatorClassName={getProgressColor(progress)}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {progress.toFixed(1)}% of service threshold
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
