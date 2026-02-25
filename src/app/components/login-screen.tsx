import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import logo from "./assets/logo.png";

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1768302185997-d2bc1fd74a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXMlMjB0ZXJtaW5hbCUyMGhpZ2h3YXklMjBuaWdodHxlbnwxfHx8fDE3NzE5NTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080)',
        }}
      />
      
      {/* Modern Dark Green Gradient Overlay with Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#14532d]/90 to-gray-900/95 backdrop-blur-[3px]" />
      
      {/* Login Card */}
      <Card className="w-full max-w-[400px] relative z-10 shadow-2xl border-0 rounded-xl overflow-hidden bg-white/95 backdrop-blur-md">
        
        {/* Header with Just the Logo */}
        <CardHeader className="text-center pt-10 pb-4">
          <div className="mx-auto flex justify-center">
            <img 
              src={logo} 
              alt="Baliwag Transit Inc." 
              className="h-32 w-auto object-contain drop-shadow-sm" 
            />
          </div>
        </CardHeader>
        
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-[#15803d]"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-[#15803d]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium bg-[#15803d] hover:bg-[#166534] transition-colors shadow-md mt-2"
            >
              Sign In
            </Button>
            
            <p className="text-[11px] text-center text-gray-400 mt-6 font-medium">
              Secure System Access • Authorized Personnel Only
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}