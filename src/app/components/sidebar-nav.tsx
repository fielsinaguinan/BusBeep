import { LayoutDashboard, Calendar, FileText, Wrench, BarChart3 } from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "fleet-schedule", label: "Fleet Schedule", icon: Calendar },
  { id: "cargo-waybills", label: "Cargo Waybills", icon: FileText },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

export function SidebarNav({ activeItem, onItemClick }: SidebarNavProps) {
  return (
    <div className="flex h-full w-64 flex-col bg-[#15803d] text-white">
      <div className="p-6 border-b border-[#14532d]">
        <h1 className="text-xl">Baliwag Transit Inc.</h1>
        <p className="text-sm text-green-100 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                activeItem === item.id
                  ? "bg-[#22c55e] text-white"
                  : "text-green-100 hover:bg-[#166534]"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#14532d]">
        <p className="text-xs text-green-100">© 2026 Baliwag Transit Inc.</p>
      </div>
    </div>
  );
}
