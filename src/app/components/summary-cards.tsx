import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bus, Package, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface SummaryCardsProps {
  activeBuses: number;
  pendingCargo: number;
  maintenanceAlerts: number;
  onNavigate?: (section: string) => void;
}

export function SummaryCards({ activeBuses, pendingCargo, maintenanceAlerts, onNavigate }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate?.("fleet-schedule")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Active Buses on Route</CardTitle>
          <Bus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{activeBuses}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Currently operating</p>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate?.("cargo-waybills")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Pending Cargo Deliveries</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{pendingCargo}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate?.("maintenance")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Maintenance Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-destructive">{maintenanceAlerts}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Require attention</p>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}