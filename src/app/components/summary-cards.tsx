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
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden" onClick={() => onNavigate?.("fleet-schedule")}>
        {/* Watermark Icon */}
        <Bus className="absolute bottom-0 right-0 h-32 w-32 text-gray-200 opacity-10 translate-x-6 translate-y-6" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm">Active Buses</CardTitle>
          <Bus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-3 relative z-10">
          <div className="text-3xl font-bold">{activeBuses}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently operating</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden" onClick={() => onNavigate?.("cargo-waybills")}>
        {/* Watermark Icon */}
        <Package className="absolute bottom-0 right-0 h-32 w-32 text-gray-200 opacity-10 translate-x-6 translate-y-6" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm">Pending Cargo</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-3 relative z-10">
          <div className="text-3xl font-bold">{pendingCargo}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting delivery</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden" onClick={() => onNavigate?.("maintenance")}>
        {/* Watermark Icon */}
        <AlertTriangle className="absolute bottom-0 right-0 h-32 w-32 text-gray-200 opacity-10 translate-x-6 translate-y-6" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm">Maintenance Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent className="pb-3 relative z-10">
          <div className="text-3xl font-bold text-destructive">{maintenanceAlerts}</div>
          <p className="text-xs text-muted-foreground mt-1">Require attention</p>
        </CardContent>
      </Card>
    </div>
  );
}