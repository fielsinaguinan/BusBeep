import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Key, 
  Clock, 
  Save, 
  Edit3,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile State
  const [formData, setFormData] = useState({
    firstName: "Fiel",
    lastName: "Sinaguinan",
    email: "f.sinaguinan@baliwagtransit.ph",
    phone: "0917-123-4567",
    terminal: "BTI Headquarters - Sabang, Baliwag"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile Updated", {
      description: "Your personal information has been successfully saved."
    });
  };

  const handlePasswordReset = () => {
    toast.info("Password Reset Requested", {
      description: "Check your email for the secure reset link."
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex-shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your account settings and preferences.</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="h-9 text-sm">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#15803d] hover:bg-[#166534] h-9 text-sm gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="h-9 text-sm gap-2">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: Identity & Security */}
        <div className="flex flex-col gap-4 overflow-hidden">
          
          {/* Identity Card */}
          <Card className="flex-shrink-0">
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarFallback className="bg-green-600 text-white text-3xl font-bold">
                    FS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white" title="Online"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
              <p className="text-sm font-medium text-green-700 mb-2">Terminal Master</p>
              
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                Active Employee
              </Badge>

              <div className="w-full mt-6 space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>ID: <strong className="text-gray-900">BTI-2024-8842</strong></span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{formData.terminal}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Shift: <strong className="text-gray-900">08:00 AM - 05:00 PM</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-700" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Password</Label>
                  <p className="text-xs text-gray-500">Last changed 45 days ago</p>
                </div>
                <Button variant="outline" size="sm" onClick={handlePasswordReset} className="h-8 text-xs gap-1.5">
                  <Key className="h-3 w-3" /> Reset
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    Two-Factor Auth <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </Label>
                  <p className="text-xs text-gray-500">Secured via Authenticator</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-green-700 bg-green-50 hover:bg-green-100">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Details & Activity */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          
          {/* Personal Information Form */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-3 pt-4 border-b border-gray-100">
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription className="text-xs">Update your contact details and terminal assignment.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-gray-600">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    readOnly={!isEditing}
                    className={`h-9 text-sm ${!isEditing ? "bg-gray-50 border-transparent focus-visible:ring-0" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-gray-600">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    readOnly={!isEditing}
                    className={`h-9 text-sm ${!isEditing ? "bg-gray-50 border-transparent focus-visible:ring-0" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email Address
                  </Label>
                  <Input 
                    id="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    readOnly={!isEditing}
                    className={`h-9 text-sm ${!isEditing ? "bg-gray-50 border-transparent focus-visible:ring-0" : ""}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    readOnly={!isEditing}
                    className={`h-9 text-sm ${!isEditing ? "bg-gray-50 border-transparent focus-visible:ring-0" : ""}`}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="terminal" className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" /> Assigned Terminal Base
                  </Label>
                  <Input 
                    id="terminal" 
                    value={formData.terminal} 
                    readOnly // Usually, employees can't change their own terminal location manually
                    className="h-9 text-sm bg-gray-50 border-transparent focus-visible:ring-0 cursor-not-allowed text-gray-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Box */}
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="pb-2 pt-4 flex-shrink-0 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                Recent Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-xs font-semibold h-8 py-1">Date & Time</TableHead>
                    <TableHead className="text-xs font-semibold h-8 py-1">Device/IP</TableHead>
                    <TableHead className="text-xs font-semibold h-8 py-1">Location</TableHead>
                    <TableHead className="text-right text-xs font-semibold h-8 py-1">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-2.5 text-xs text-gray-900 font-medium">Today, 07:45 AM</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Windows PC • 192.168.1.14</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Bulacan, PH</TableCell>
                    <TableCell className="py-2.5 text-right"><Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 py-0 h-4">Success</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2.5 text-xs text-gray-900 font-medium">Yesterday, 06:30 PM</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">iPhone 14 Pro • 112.204.5.88</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Bulacan, PH</TableCell>
                    <TableCell className="py-2.5 text-right"><Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 py-0 h-4">Success</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2.5 text-xs text-gray-900 font-medium">Feb 23, 08:02 AM</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Windows PC • 192.168.1.14</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Bulacan, PH</TableCell>
                    <TableCell className="py-2.5 text-right"><Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 py-0 h-4">Success</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2.5 text-xs text-gray-900 font-medium">Feb 21, 11:15 PM</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Unknown Device • 45.12.3.99</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600">Manila, PH</TableCell>
                    <TableCell className="py-2.5 text-right"><Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 py-0 h-4">Failed</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}