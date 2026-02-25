import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarNav } from "./sidebar-nav";
import { LoginScreen } from "./login-screen";
import { Toaster } from "./ui/sonner";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

export function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (user: string) => {
    setUsername(`Terminal Master ${user}`);
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav 
        username={username}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}