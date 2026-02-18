import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Package } from "lucide-react";

export function CargoWaybillForm() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderContact: "",
    receiverName: "",
    receiverContact: "",
    destinationTerminal: "",
    weight: "",
    type: "",
    quantity: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateWaybill = () => {
    // Validate required fields
    if (!formData.senderName || !formData.receiverName || !formData.destinationTerminal) {
      alert("Please fill in all required fields");
      return;
    }

    // Generate tracking number
    const trackingNumber = `WB${Date.now().toString().slice(-8)}`;
    
    alert(`Digital Waybill Generated!\n\nTracking Number: ${trackingNumber}\n\nSender: ${formData.senderName}\nReceiver: ${formData.receiverName}\nDestination: ${formData.destinationTerminal}\nWeight: ${formData.weight} kg\nType: ${formData.type}\nQuantity: ${formData.quantity}`);
    
    // Reset form
    setFormData({
      senderName: "",
      senderContact: "",
      receiverName: "",
      receiverContact: "",
      destinationTerminal: "",
      weight: "",
      type: "",
      quantity: "",
    });
  };

  const terminals = [
    "Manila Central Terminal",
    "Quezon City Terminal",
    "Baguio Terminal",
    "Tuguegarao Terminal",
    "Vigan Terminal",
    "Laoag Terminal",
    "Tarlac Terminal",
    "Pangasinan Terminal",
    "Nueva Ecija Terminal",
    "Isabela Terminal",
  ];

  const cargoTypes = [
    "Documents",
    "Electronics",
    "Food Items",
    "Clothing",
    "Household Items",
    "Agricultural Products",
    "Medical Supplies",
    "Others",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Create Cargo Waybill</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Sender and Receiver Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Name *</Label>
                <Input
                  id="senderName"
                  placeholder="Enter sender's full name"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange("senderName", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderContact">Contact Number *</Label>
                <Input
                  id="senderContact"
                  placeholder="09XX-XXX-XXXX"
                  value={formData.senderContact}
                  onChange={(e) => handleInputChange("senderContact", e.target.value)}
                  autoComplete="off"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receiver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiverName">Name *</Label>
                <Input
                  id="receiverName"
                  placeholder="Enter receiver's full name"
                  value={formData.receiverName}
                  onChange={(e) => handleInputChange("receiverName", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverContact">Contact Number *</Label>
                <Input
                  id="receiverContact"
                  placeholder="09XX-XXX-XXXX"
                  value={formData.receiverContact}
                  onChange={(e) => handleInputChange("receiverContact", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationTerminal">Destination Terminal *</Label>
                <Select
                  value={formData.destinationTerminal}
                  onValueChange={(value) => handleInputChange("destinationTerminal", value)}
                >
                  <SelectTrigger id="destinationTerminal">
                    <SelectValue placeholder="Select destination terminal" />
                  </SelectTrigger>
                  <SelectContent>
                    {terminals.map((terminal) => (
                      <SelectItem key={terminal} value={terminal}>
                        {terminal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Parcel Details and Generate Button */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parcel Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  autoComplete="off"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select cargo type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  autoComplete="off"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardContent className="pt-6">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg gap-3"
                onClick={handleGenerateWaybill}
              >
                <Package className="h-5 w-5" />
                Generate Digital Waybill & Tracking Number
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                A unique tracking number will be generated upon submission
              </p>
            </CardContent>
          </Card>

          <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4">
            <p className="text-sm text-accent-foreground">
              <strong>Quick Entry Tips:</strong>
              <br />
              • Use Tab key to navigate between fields
              <br />
              • All fields marked with * are required
              <br />
              • Tracking number will be auto-generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
