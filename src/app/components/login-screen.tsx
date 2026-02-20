import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#15803d] to-[#166534] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          
          {/* ✅ Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Baliwag Transit Logo"
              className="h-40 w-auto object-contain"
            />
          </div>

        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#15803d] hover:bg-[#166534]"
            >
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              For demo purposes, enter any username and password
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}