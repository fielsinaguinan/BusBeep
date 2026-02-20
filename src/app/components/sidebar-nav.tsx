import { LayoutDashboard, Calendar, FileText, Wrench, BarChart3, Menu, ChevronLeft, User, LogOut } from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import logo from "./assets/logo.png"; 

interface SidebarNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  username: string;
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: null },
  { id: "fleet-schedule", label: "Schedule", icon: Calendar, section: "Fleet" },
  { id: "cargo-waybills", label: "Cargo Waybills", icon: FileText, section: null },
  { id: "maintenance", label: "Maintenance", icon: Wrench, section: null },
  { id: "reports", label: "Reports", icon: BarChart3, section: null },
];

export function SidebarNav({ activeItem, onItemClick, username, onLogout }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white text-green-700 transition-all duration-300 border-r border-green-200 shadow-sm",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-200 flex items-center justify-between">
        {!isCollapsed && (
          <img
            src={logo}
            alt="Baliwag Transit Logo"
            className="h-26 w-auto object-contain"
          />
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-green-700 hover:bg-green-100 ml-auto"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const showSectionHeader =
            item.section &&
            (index === 0 || navItems[index - 1].section !== item.section);

          return (
            <div key={item.id}>
              {showSectionHeader && !isCollapsed && (
                <div className="px-3 py-2 mt-4 mb-1">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                    {item.section}
                  </p>
                </div>
              )}

              <button
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeItem === item.id
                    ? "bg-green-600 text-white"
                    : "text-green-700 hover:bg-green-100",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-green-200">
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center w-full cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-600 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full cursor-pointer hover:bg-green-100 rounded-lg p-2 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-600 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-green-800 truncate">
                  {username}
                </p>
                <p className="text-xs text-green-600">Terminal Master</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-green-200">
        {!isCollapsed && (
          <p className="text-xs text-green-600">
            © 2026 Baliwag Transit
          </p>
        )}
      </div>
    </div>
  );
}