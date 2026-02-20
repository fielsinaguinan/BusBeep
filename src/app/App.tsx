import { useState } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { LoginScreen } from "./components/login-screen";
import { SummaryCards } from "./components/summary-cards";
import { FleetDispatchTable } from "./components/fleet-dispatch-table";
import { PredictiveMaintenance } from "./components/predictive-maintenance";
import { CargoWaybillForm } from "./components/cargo-waybill-form";
import { CargoWaybillStepper } from "./components/cargo-waybill-stepper";
import { MaintenanceDashboard } from "./components/maintenance-dashboard";
import { FleetDispatchBoard } from "./components/fleet-dispatch-board";
import { FleetScheduleImproved } from "./components/fleet-schedule-improved";
import { ReportsAnalyticsDashboard } from "./components/reports-analytics-dashboard";
import { Button } from "./components/ui/button";
import { Plus, TrendingUp, FileText } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

// Mock data for the dashboard
const mockFleetDispatches = [
  {
    id: "1",
    busNumber: "PB-001",
    driverName: "Juan Cruz",
    destination: "Manila to Baguio",
    status: "In Transit",
  },
  {
    id: "2",
    busNumber: "PB-015",
    driverName: "Maria Santos",
    destination: "Quezon City to Tuguegarao",
    status: "Departed",
  },
  {
    id: "3",
    busNumber: "PB-023",
    driverName: "Pedro Reyes",
    destination: "Tarlac to Vigan",
    status: "Preparing",
  },
  {
    id: "4",
    busNumber: "PB-042",
    driverName: "Ana Garcia",
    destination: "Pangasinan to Laoag",
    status: "Departed",
  },
  {
    id: "5",
    busNumber: "PB-056",
    driverName: "Carlos Mendoza",
    destination: "Nueva Ecija to Isabela",
    status: "In Transit",
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

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user: string) => {
    setUsername(`Terminal Master ${user}`);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setActiveNav("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const handleEncodeMileage = (busId: string) => {
    const bus = mockMaintenanceBuses.find(b => b.id === busId);
    if (bus) {
      const newMileage = prompt(`Enter new mileage for ${bus.busNumber} (Current: ${bus.currentMileage} km):`, bus.currentMileage.toString());
      if (newMileage) {
        alert(`Mileage updated to ${newMileage} km for ${bus.busNumber}`);
      }
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case "cargo-waybills":
        return <CargoWaybillStepper />;
      case "maintenance":
        return <MaintenanceDashboard />;
      case "fleet-schedule":
        return <FleetScheduleImproved />;
      case "reports":
        return <ReportsAnalyticsDashboard />;
      case "dashboard":
      default:
        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setActiveNav("fleet-schedule")} className="bg-[#15803d] hover:bg-[#166534]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
                <Button onClick={() => setActiveNav("maintenance")} variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Encode Mileage
                </Button>
                <Button onClick={() => setActiveNav("cargo-waybills")} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  New Waybill
                </Button>
              </div>
            </div>

            <SummaryCards 
              activeBuses={12}
              pendingCargo={28}
              maintenanceAlerts={3}
              onNavigate={setActiveNav}
            />

            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <FleetDispatchTable dispatches={mockFleetDispatches} />
              <PredictiveMaintenance 
                buses={mockMaintenanceBuses} 
                onEncodeMileage={handleEncodeMileage}
              />
            </div>

            <div className="bg-accent border border-accent-foreground/20 rounded-lg p-3">
              <p className="text-sm text-accent-foreground">
                <strong>Note:</strong> All data on this dashboard is manually entered by staff. 
                Use the status dropdowns and mileage encoding buttons to keep records up to date.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav 
        activeItem={activeNav} 
        onItemClick={setActiveNav}
        username={username}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}