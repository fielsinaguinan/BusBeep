import { useState } from "react";
import { useNavigate } from "react-router";
import { SummaryCards } from "./summary-cards";
import { FleetDispatchTable } from "./fleet-dispatch-table";
import { PredictiveMaintenance } from "./predictive-maintenance";
import { CargoVerificationWidget } from "./cargo-verification-widget";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus, TrendingUp, FileText, Megaphone, ArrowRight, Info, MessageSquare } from "lucide-react";

// Mock data for the dashboard
const mockFleetDispatches = [
  {
    id: "1",
    busNumber: "PB-001",
    driverName: "Juan Cruz",
    destination: "Manila to Baguio",
    status: "In Transit",
    isLive: true,
    currentLocation: "NLEX Dau Exit",
    hasUnreadMessages: true,
  },
  {
    id: "2",
    busNumber: "PB-015",
    driverName: "Maria Santos",
    destination: "Quezon City to Tuguegarao",
    status: "Departed",
    isLive: true,
    currentLocation: "Sta. Maria, Bulacan",
    hasUnreadMessages: true,
  },
  {
    id: "3",
    busNumber: "PB-023",
    driverName: "Pedro Reyes",
    destination: "Tarlac to Vigan",
    status: "Preparing",
    isLive: false,
    lastSynced: 8,
    currentLocation: "Tarlac Terminal",
    hasUnreadMessages: false,
  },
  {
    id: "4",
    busNumber: "PB-042",
    driverName: "Ana Garcia",
    destination: "Pangasinan to Laoag",
    status: "Departed",
    isLive: true,
    currentLocation: "Pozorrubio",
    hasUnreadMessages: true,
  },
  {
    id: "5",
    busNumber: "PB-056",
    driverName: "Carlos Mendoza",
    destination: "Nueva Ecija to Isabela",
    status: "In Transit",
    isLive: false,
    lastSynced: 25,
    currentLocation: "Cabanatuan Terminal",
    hasUnreadMessages: false,
  },
];

const mockMaintenanceBuses = [
  {
    id: "m1",
    busNumber: "PB-008",
    currentMileage: 28500,
    serviceThreshold: 30000,
    lastService: "Jan 15, 2026",
  },
  {
    id: "m2",
    busNumber: "PB-012",
    currentMileage: 27200,
    serviceThreshold: 30000,
    lastService: "Jan 8, 2026",
  },
  {
    id: "m3",
    busNumber: "PB-031",
    currentMileage: 29100,
    serviceThreshold: 30000,
    lastService: "Dec 28, 2025",
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  // Calculate the number of unread messages from the mock data
  const unreadCount = mockFleetDispatches.filter(dispatch => dispatch.hasUnreadMessages).length;

  const handleEncodeMileage = (busId: string) => {
    const bus = mockMaintenanceBuses.find(b => b.id === busId);
    if (bus) {
      const newMileage = prompt(`Enter new mileage for ${bus.busNumber} (Current: ${bus.currentMileage} km):`, bus.currentMileage.toString());
      if (newMileage) {
        alert(`Mileage updated to ${newMileage} km for ${bus.busNumber}`);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      {/* --- REPLACE YOUR ENTIRE HEADER SECTION WITH THIS --- */}
      <div className="mb-4 pt-2 flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2 items-center">
          
          {/* Fleet Intercom Shortcut with Dynamic Badge */}
          <div className="relative mr-2">
            <Button
              onClick={() => navigate("/fleet-intercom")}
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-green-700 hover:bg-green-50"
              title="Fleet Intercom"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            {/* Dynamic Badge: Placed OUTSIDE the Button to completely bypass the cut-off issue */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-md pointer-events-none">
                {unreadCount}
              </span>
            )}
          </div>

          <Button onClick={() => navigate("/fleet-schedule")} className="bg-[#15803d] hover:bg-[#166534] h-9 px-3 text-sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Trip
          </Button>
          <Button onClick={() => navigate("/maintenance")} variant="outline" className="h-9 px-3 text-sm">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Encode Mileage
          </Button>
          <Button onClick={() => navigate("/cargo-waybills")} variant="outline" className="h-9 px-3 text-sm">
            <FileText className="h-4 w-4 mr-1.5" />
            New Waybill
          </Button>
        </div>
      </div>

      {/* Compact Summary Cards */}
      <div className="mb-4 flex-shrink-0">
        <SummaryCards 
          activeBuses={12}
          pendingCargo={28}
          maintenanceAlerts={3}
          onNavigate={(route) => navigate(`/${route}`)}
        />
      </div>

      {/* Compact News Banner */}
      <Card className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 flex-shrink-0">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Megaphone className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">News & Announcements</h3>
                <p className="text-xs text-gray-600">
                  Publish updates that sync to mobile app
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/news")}
              className="bg-green-600 hover:bg-green-700 text-white gap-2 h-8 px-3 text-xs"
            >
              Manage Posts
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3-Column Grid with Fixed Height Cards */}
      <div className="grid gap-4 grid-cols-3 flex-1 min-h-0 mb-4">
        <FleetDispatchTable dispatches={mockFleetDispatches} />
        <PredictiveMaintenance 
          buses={mockMaintenanceBuses} 
          onEncodeMileage={handleEncodeMileage}
        />
        <CargoVerificationWidget />
      </div>

      {/* System Footer Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <Info className="h-4 w-4 text-green-700 flex-shrink-0" />
        <p className="text-xs text-green-800">
          <strong className="font-semibold">System Note:</strong> Fleet location and route mileage are automated via conductor mobile app QR scans. Terminal staff may manually override statuses if needed.
        </p>
      </div>
    </div>
  );
}