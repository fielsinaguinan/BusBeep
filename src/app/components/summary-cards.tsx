import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bus, Package, AlertTriangle } from "lucide-react";

interface SummaryCardsProps {
  activeBuses: number;
  pendingCargo: number;
  maintenanceAlerts: number;
}

export function SummaryCards({ activeBuses, pendingCargo, maintenanceAlerts }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Active Buses on Route</CardTitle>
          <Bus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{activeBuses}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently operating</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Pending Cargo Deliveries</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{pendingCargo}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting delivery</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Maintenance Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-destructive">{maintenanceAlerts}</div>
          <p className="text-xs text-muted-foreground mt-1">Require attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
