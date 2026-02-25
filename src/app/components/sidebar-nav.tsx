import { LayoutDashboard, Calendar, FileText, Wrench, BarChart3, Map, Menu, ChevronLeft, User, LogOut, Accessibility, Megaphone, MessageSquare } from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
  username: string;
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: null, path: "/" },
  { id: "fleet-schedule", label: "Schedule", icon: Calendar, section: "Fleet", path: "/fleet-schedule" },
  { id: "fleet-intercom", label: "Fleet Intercom", icon: MessageSquare, section: "Fleet", path: "/fleet-intercom" },
  { id: "cargo-waybills", label: "Cargo Waybills", icon: FileText, section: null, path: "/cargo-waybills" },
  { id: "maintenance", label: "Maintenance", icon: Wrench, section: null, path: "/maintenance" },
  { id: "reports", label: "Reports", icon: BarChart3, section: null, path: "/reports" },
  { id: "news", label: "News & Announcements", icon: Megaphone, section: "Communication", path: "/news" },
  { id: "accessibility", label: "Accessibility", icon: Accessibility, section: "Settings", path: "/accessibility" },
];

export function SidebarNav({ username, onLogout }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn(
      "flex h-full flex-col bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 shadow-sm relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      
      {/* Header with Centered, Large Logo */}
      <div className={cn(
        "relative border-b border-gray-200 flex items-center transition-all duration-300",
        // When open, give it huge vertical padding (py-8). When closed, keep it square (h-16).
        isCollapsed ? "h-[72px] justify-center" : "justify-center py-8 px-4"
      )}>
        {!isCollapsed && (
          <img 
            src={logo} 
            alt="Baliwag Transit Logo" 
            // h-24 makes it 96px tall. w-full and object-contain ensure it perfectly fills the centered space
            className="h-30 w-full object-contain" 
          />
        )}
        
        {/* Collapse Button - Absolute positioned to the top right so it never pushes the logo off-center */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all z-10",
            !isCollapsed ? "absolute top-2 right-2 h-7 w-7" : "h-10 w-10"
          )}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const showSectionHeader = item.section && (index === 0 || navItems[index - 1].section !== item.section);
          const isActive = location.pathname === item.path;
          
          return (
            <div key={item.id}>
              {showSectionHeader && !isCollapsed && (
                <div className="px-3 py-2 mt-4 mb-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {item.section}
                  </p>
                </div>
              )}
              <Link
                to={item.path}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                  isActive
                    ? "bg-[#22c55e] text-white shadow-sm font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center px-0"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-gray-500")} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-200 bg-gray-50/50">
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center w-full cursor-pointer hover:opacity-80 transition-opacity outline-none">
              <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                <AvatarFallback className="bg-[#15803d] text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56 p-2 ml-2">
              <DropdownMenuLabel className="px-2 py-2">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Replace the first My Profile item (around line 125) with this: */}
              <DropdownMenuItem 
                className="cursor-pointer px-2 py-2" 
                onClick={() => navigate("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 px-2 py-2" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 w-full cursor-pointer hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-lg p-2 transition-all outline-none">
              <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                <AvatarFallback className="bg-[#15803d] text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500 font-medium">Terminal Master</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="px-2 py-2">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Replace the second My Profile item (around line 155) with this: */}
              <DropdownMenuItem 
                className="cursor-pointer px-2 py-2" 
                onClick={() => navigate("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 px-2 py-2" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-gray-400 text-center">© 2026 Baliwag Transit</p>
        )}
      </div>
    </div>
  );
}