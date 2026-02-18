import { LayoutDashboard, Calendar, FileText, Wrench, BarChart3, Map } from "lucide-react";
import { cn } from "./ui/utils";
import logo from "./assets/logo.png";

interface SidebarNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "fleet-schedule", label: "Fleet Schedule", icon: Calendar },
  { id: "fleet-map", label: "Fleet Map", icon: Map },
  { id: "cargo-waybills", label: "Cargo Waybills", icon: FileText },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

export function SidebarNav({ activeItem, onItemClick }: SidebarNavProps) {
  return (
    <div className="flex h-full w-64 flex-col bg-white text-green-800 border-r border-green-200">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#14532d] flex items-center justify-center">
        <img src={logo} alt="Baliwag Transit Logo" className="h-32 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-green-400",
                activeItem === item.id
                  ? "bg-green-100 text-green-900"
                  : "text-green-800 hover:bg-green-50"
              )}
              aria-current={activeItem === item.id ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-200">
        <p className="text-xs text-green-600">© 2026 Baliwag Transit Inc.</p>
      </div>
    </div>
  );
}