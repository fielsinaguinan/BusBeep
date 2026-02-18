import { useState } from "react";
import { SidebarNav } from "./components/sidebar-nav";
import { SummaryCards } from "./components/summary-cards";
import { FleetDispatchTable } from "./components/fleet-dispatch-table";
import { PredictiveMaintenance } from "./components/predictive-maintenance";
import { CargoWaybillForm } from "./components/cargo-waybill-form";
import { MaintenanceDashboard } from "./components/maintenance-dashboard";
import { FleetDispatchBoard } from "./components/fleet-dispatch-board";
import { ReportsAnalyticsDashboard } from "./components/reports-analytics-dashboard";
import { LiveFleetMap } from "./components/live-fleet-map";

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
        return <CargoWaybillForm />;
      case "maintenance":
        return <MaintenanceDashboard />;
      case "fleet-schedule":
        return <FleetDispatchBoard />;
      case "fleet-map":
        return <LiveFleetMap />;
      case "reports":
        return <ReportsAnalyticsDashboard />;
      case "dashboard":
      default:
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
              </p>
            </div>

            <SummaryCards 
              activeBuses={12}
              pendingCargo={28}
              maintenanceAlerts={3}
            />

            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <FleetDispatchTable dispatches={mockFleetDispatches} />
              <PredictiveMaintenance 
                buses={mockMaintenanceBuses} 
                onEncodeMileage={handleEncodeMileage}
              />
            </div>

            <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4">
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
      <SidebarNav activeItem={activeNav} onItemClick={setActiveNav} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}