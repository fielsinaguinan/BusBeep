import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Package, CheckCircle2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CargoItem {
  id: string;
  trackingNumber: string;
  busNumber: string;
  origin: string;
  arrivedAt: string;
  packages: number;
}

const mockArrivedCargo: CargoItem[] = [
  {
    id: "1",
    trackingNumber: "BTI-2026-00142",
    busNumber: "PB-001",
    origin: "Manila Terminal",
    arrivedAt: "8:45 AM",
    packages: 3
  },
  {
    id: "2",
    trackingNumber: "BTI-2026-00156",
    busNumber: "PB-023",
    origin: "Tarlac Hub",
    arrivedAt: "9:12 AM",
    packages: 5
  },
  {
    id: "3",
    trackingNumber: "BTI-2026-00163",
    busNumber: "PB-042",
    origin: "Pangasinan Station",
    arrivedAt: "10:05 AM",
    packages: 2
  },
];

export function CargoVerificationWidget() {
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(mockArrivedCargo);

  const handleUnloadCargo = (cargoId: string) => {
    const cargo = cargoItems.find(c => c.id === cargoId);
    if (cargo) {
      toast.success(
        `Cargo ${cargo.trackingNumber} received and unloaded (${cargo.packages} packages)`,
        {
          description: `From ${cargo.busNumber} - ${cargo.origin}`
        }
      );
      setCargoItems(prev => prev.filter(c => c.id !== cargoId));
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cargo Handoff Verification</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Arrived cargo awaiting receipt
            </p>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs px-2 py-0 h-5">
            {cargoItems.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-4">
        {cargoItems.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="p-2 bg-white rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-medium">All cargo verified</p>
            <p className="text-xs text-gray-500 mt-1">No pending cargo to unload</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cargoItems.map((cargo) => (
              <div 
                key={cargo.id} 
                className="p-3 border border-gray-200 rounded-lg bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Package className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{cargo.trackingNumber}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {cargo.origin}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-8 text-xs">
                      <span className="text-gray-500">
                        Bus: <span className="font-medium text-gray-900">{cargo.busNumber}</span>
                      </span>
                      <span className="text-gray-500">
                        Pkgs: <span className="font-medium text-gray-900">{cargo.packages}</span>
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {cargo.arrivedAt}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleUnloadCargo(cargo.id)}
                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs shrink-0"
                    size="sm"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Unload
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}