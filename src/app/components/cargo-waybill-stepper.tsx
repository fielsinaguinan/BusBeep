import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ValidatedInput } from "./ui/validated-input";
import { ValidatedLabel } from "./ui/validated-label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, FileText, AlertCircle, ChevronDown, Package, MapPin, Clock, Bus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Step {
  id: number;
  title: string;
  status: "complete" | "current" | "upcoming";
}

// BTI Terminal Locations
const terminals = [
  { value: "sabang", label: "BTI Headquarters - Sabang, Baliwag" },
  { value: "cubao", label: "Cubao Terminal - Quezon City" },
  { value: "grace-park", label: "Grace Park Terminal - Caloocan" },
  { value: "pasay", label: "Pasay Terminal - Manila" },
  { value: "baguio", label: "Baguio Terminal" },
  { value: "tuguegarao", label: "Tuguegarao Terminal" },
  { value: "vigan", label: "Vigan Terminal" },
  { value: "laoag", label: "Laoag Terminal" },
];

const cargoTypes = [
  { value: "document", label: "Document" },
  { value: "perishable", label: "Perishable" },
  { value: "electronics", label: "Electronics" },
  { value: "standard", label: "Standard Parcel" },
];

const activeTrips = [
  { value: "pb015-cubao", label: "PB-015 - 2:00 PM to Cubao" },
  { value: "pb023-manila", label: "PB-023 - 3:30 PM to Manila Terminal" },
  { value: "pb042-baguio", label: "PB-042 - 4:00 PM to Baguio" },
  { value: "pb008-tarlac", label: "PB-008 - 5:15 PM to Tarlac Hub" },
];

// Price calculation based on weight (simplified)
const calculatePrice = (weight: string, cargoType: string): number => {
  const weightNum = parseFloat(weight);
  if (!weightNum || weightNum <= 0) return 0;
  
  // Base rate: ₱50 per kg
  let basePrice = weightNum * 50;
  
  // Add premium for special cargo types
  if (cargoType === "electronics") basePrice *= 1.5;
  if (cargoType === "perishable") basePrice *= 1.3;
  
  return Math.round(basePrice);
};

interface WaybillData {
  // Sender
  senderName: string;
  senderContact: string;
  pickupTerminal: string;
  
  // Receiver
  receiverName: string;
  receiverContact: string;
  deliveryTerminal: string;
  
  // Cargo
  cargoType: string;
  cargoDescription: string;
  cargoWeight: string;
  cargoValue: string;
  assignedBus: string;
  specialInstructions: string;
}

interface ArrivingCargo {
  id: string;
  waybillId: string;
  origin: string;
  busNumber: string;
  eta: string;
  packages: number;
  receiverName: string;
  status: "Arriving" | "Arrived";
}

const mockArrivingCargo: ArrivingCargo[] = [
  {
    id: "1",
    waybillId: "BTI-2026-00142",
    origin: "Manila Terminal",
    busNumber: "PB-001",
    eta: "10:30 AM",
    packages: 3,
    receiverName: "Maria Santos",
    status: "Arrived"
  },
  {
    id: "2",
    waybillId: "BTI-2026-00156",
    origin: "Tarlac Hub",
    busNumber: "PB-023",
    eta: "11:45 AM",
    packages: 5,
    receiverName: "Juan Dela Cruz",
    status: "Arriving"
  },
  {
    id: "3",
    waybillId: "BTI-2026-00163",
    origin: "Pangasinan Station",
    busNumber: "PB-042",
    eta: "12:15 PM",
    packages: 2,
    receiverName: "Rosa Garcia",
    status: "Arrived"
  },
  {
    id: "4",
    waybillId: "BTI-2026-00178",
    origin: "Baguio Terminal",
    busNumber: "PB-015",
    eta: "1:00 PM",
    packages: 4,
    receiverName: "Pedro Reyes",
    status: "Arriving"
  },
];

const initialData: WaybillData = {
  senderName: "",
  senderContact: "",
  pickupTerminal: "",
  receiverName: "",
  receiverContact: "",
  deliveryTerminal: "",
  cargoType: "",
  cargoDescription: "",
  cargoWeight: "",
  cargoValue: "",
  assignedBus: "",
  specialInstructions: "",
};

export function CargoWaybillStepper() {
  const [activeMainTab, setActiveMainTab] = useState("create");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WaybillData>(initialData);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [cancelCountdown, setCancelCountdown] = useState<number | null>(null);
  const [arrivingCargo, setArrivingCargo] = useState<ArrivingCargo[]>(mockArrivingCargo);

  const steps: Step[] = [
    { id: 1, title: "Sender Details", status: currentStep > 1 ? "complete" : currentStep === 1 ? "current" : "upcoming" },
    { id: 2, title: "Receiver Details", status: currentStep > 2 ? "complete" : currentStep === 2 ? "current" : "upcoming" },
    { id: 3, title: "Cargo Information", status: currentStep > 3 ? "complete" : currentStep === 3 ? "current" : "upcoming" },
    { id: 4, title: "Review & Submit", status: currentStep === 4 ? "current" : "upcoming" },
  ];

  const handleInputChange = (field: keyof WaybillData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculatedPrice = calculatePrice(formData.cargoWeight, formData.cargoType);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const generated = `TRK-${Date.now().toString().slice(-8)}`;
    setTrackingNumber(generated);
    toast.success("Waybill created successfully!", {
      description: `Tracking Number: ${generated}`,
    });
  };

  const handleCancel = () => {
    let countdown = 5;
    setCancelCountdown(countdown);
    
    const interval = setInterval(() => {
      countdown -= 1;
      setCancelCountdown(countdown);
      
      if (countdown === 0) {
        clearInterval(interval);
        setFormData(initialData);
        setCurrentStep(1);
        setTrackingNumber("");
        setCancelCountdown(null);
        toast.info("Waybill cancelled");
      }
    }, 1000);
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleConfirmArrival = (cargoId: string) => {
    const cargo = arrivingCargo.find(c => c.id === cargoId);
    if (cargo) {
      toast.success(
        `Cargo ${cargo.waybillId} confirmed and unloaded`,
        {
          description: `${cargo.packages} packages received from ${cargo.busNumber}`
        }
      );
      setArrivingCargo(prev => prev.filter(c => c.id !== cargoId));
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold mb-2">Cargo Waybills</h1>
        <p className="text-sm text-muted-foreground">
          Create new waybills or receive arriving cargo at your terminal
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11 flex-shrink-0 mb-4">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Create Waybill
          </TabsTrigger>
          <TabsTrigger value="receive" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Receive Cargo ({arrivingCargo.length})
          </TabsTrigger>
        </TabsList>

        {/* Create Waybill Tab */}
        <TabsContent value="create" className="flex-1 flex flex-col overflow-hidden mt-0">
          <div className="flex-1 overflow-auto">
            {/* FIXED: Removed pb-20 and changed space-y-4 to space-y-3 to eliminate the invisible scroll trigger */}
            <div className="space-y-3 pb-2 pr-1">
              
              {/* Stepper */}
              <Card>
                {/* FIXED: Tightened top and bottom padding slightly */}
                <CardContent className="pt-3 pb-3">
                  <div className="mb-3">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="flex justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                              step.status === "complete"
                                ? "bg-green-600 border-green-600 text-white"
                                : step.status === "current"
                                ? "border-primary text-primary bg-white"
                                : "border-gray-300 text-gray-400 bg-white"
                            }`}
                          >
                            {step.status === "complete" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-sm">{step.id}</span>
                            )}
                          </div>
                          <span className={`mt-1 text-xs font-medium ${
                            step.status === "current" ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-16 h-0.5 mx-2 ${
                            step.status === "complete" ? "bg-green-600" : "bg-gray-300"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Form Content */}
              <Card>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg">{steps[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <ValidatedLabel htmlFor="senderName" required isFilled={!!formData.senderName}>
                          Sender Name
                        </ValidatedLabel>
                        <ValidatedInput
                          id="senderName"
                          value={formData.senderName}
                          onChange={(e) => handleInputChange("senderName", e.target.value)}
                          placeholder="Full name of sender"
                          showValidation
                        />
                      </div>
                      <div>
                        <ValidatedLabel htmlFor="senderContact" required isFilled={!!formData.senderContact}>
                          Contact Number
                        </ValidatedLabel>
                        <ValidatedInput
                          id="senderContact"
                          value={formData.senderContact}
                          onChange={(e) => handleInputChange("senderContact", e.target.value)}
                          placeholder="09XX-XXX-XXXX"
                          showValidation
                        />
                      </div>
                      <div>
                        <ValidatedLabel htmlFor="pickupTerminal" required isFilled={true}>
                          Pickup Terminal
                        </ValidatedLabel>
                        <div className="w-full px-3 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md cursor-not-allowed">
                          Current Location: Sabang Terminal
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <ValidatedLabel htmlFor="receiverName" required isFilled={!!formData.receiverName}>
                          Receiver Name
                        </ValidatedLabel>
                        <ValidatedInput
                          id="receiverName"
                          value={formData.receiverName}
                          onChange={(e) => handleInputChange("receiverName", e.target.value)}
                          placeholder="Full name of receiver"
                          showValidation
                        />
                      </div>
                      <div>
                        <ValidatedLabel htmlFor="receiverContact" required isFilled={!!formData.receiverContact}>
                          Contact Number
                        </ValidatedLabel>
                        <ValidatedInput
                          id="receiverContact"
                          value={formData.receiverContact}
                          onChange={(e) => handleInputChange("receiverContact", e.target.value)}
                          placeholder="09XX-XXX-XXXX"
                          showValidation
                        />
                      </div>
                      <div>
                        <ValidatedLabel htmlFor="deliveryTerminal" required isFilled={!!formData.deliveryTerminal}>
                          Delivery Terminal
                        </ValidatedLabel>
                        <Select value={formData.deliveryTerminal} onValueChange={(value) => handleInputChange("deliveryTerminal", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select delivery terminal" />
                          </SelectTrigger>
                          <SelectContent>
                            {terminals.map((terminal) => (
                              <SelectItem key={terminal.value} value={terminal.value}>
                                {terminal.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <ValidatedLabel htmlFor="cargoType" required isFilled={!!formData.cargoType}>
                            Cargo Type
                          </ValidatedLabel>
                          <Select value={formData.cargoType} onValueChange={(value) => handleInputChange("cargoType", value)}>
                            <SelectTrigger className="w-full h-9">
                              <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                            <SelectContent>
                              {cargoTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <ValidatedLabel htmlFor="cargoDescription" required isFilled={!!formData.cargoDescription}>
                            Description
                          </ValidatedLabel>
                          <ValidatedInput
                            id="cargoDescription"
                            value={formData.cargoDescription}
                            onChange={(e) => handleInputChange("cargoDescription", e.target.value)}
                            placeholder="Brief description"
                            showValidation
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <ValidatedLabel htmlFor="cargoWeight" required isFilled={!!formData.cargoWeight}>
                            Weight (kg)
                          </ValidatedLabel>
                          <ValidatedInput
                            id="cargoWeight"
                            type="number"
                            value={formData.cargoWeight}
                            onChange={(e) => handleInputChange("cargoWeight", e.target.value)}
                            placeholder="0.0"
                            showValidation
                            className="h-9"
                          />
                        </div>
                        <div>
                          <ValidatedLabel htmlFor="cargoValue" required isFilled={!!formData.cargoValue}>
                            Value (₱)
                          </ValidatedLabel>
                          <ValidatedInput
                            id="cargoValue"
                            type="number"
                            value={formData.cargoValue}
                            onChange={(e) => handleInputChange("cargoValue", e.target.value)}
                            placeholder="0.00"
                            showValidation
                            className="h-9"
                          />
                        </div>
                        <div>
                          <ValidatedLabel htmlFor="assignedBus" required isFilled={!!formData.assignedBus}>
                            Bus Dispatch
                          </ValidatedLabel>
                          <Select value={formData.assignedBus} onValueChange={(value) => handleInputChange("assignedBus", value)}>
                            <SelectTrigger className="w-full h-9">
                              <SelectValue placeholder="Select trip" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeTrips.map((trip) => (
                                <SelectItem key={trip.value} value={trip.value}>
                                  {trip.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-900">Total Service Fee:</span>
                          <span className="text-xl font-bold text-green-700">₱{calculatedPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-0.5">
                          Auto-calculated based on weight and cargo type
                        </p>
                      </div>
                      <div className="mt-1">
                        <ValidatedLabel htmlFor="specialInstructions">
                          Special Instructions
                        </ValidatedLabel>
                        {/* FIXED: Reduced to 1 row and disabled resize to save vertical space */}
                        <Textarea
                          id="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                          placeholder="Any special handling or delivery instructions (optional)"
                          rows={1}
                          className="text-sm min-h-[40px] resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      {!trackingNumber ? (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-blue-900 text-sm">Review Your Details</h4>
                                <p className="text-xs text-blue-700 mt-0.5">
                                  Please verify all information before submitting. Once submitted, you can cancel within 5 seconds.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* FIXED: 2-Column Grid for Step 4 */}
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {/* Left Column: Sender & Receiver */}
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2 text-xs text-muted-foreground border-b pb-1">SENDER INFORMATION</h3>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium truncate max-w-[150px]">{formData.senderName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact:</span>
                                    <span className="font-medium truncate">{formData.senderContact}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pickup:</span>
                                    <span className="font-medium text-right truncate max-w-[150px]">
                                      {terminals.find(t => t.value === formData.pickupTerminal)?.label}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2 text-xs text-muted-foreground border-b pb-1">RECEIVER INFORMATION</h3>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium truncate max-w-[150px]">{formData.receiverName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Contact:</span>
                                    <span className="font-medium truncate">{formData.receiverContact}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery:</span>
                                    <span className="font-medium text-right truncate max-w-[150px]">
                                      {terminals.find(t => t.value === formData.deliveryTerminal)?.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Cargo Details */}
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <h3 className="font-semibold mb-2 text-xs text-muted-foreground border-b border-gray-200 pb-1">CARGO DETAILS</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className="font-medium">
                                    {cargoTypes.find(t => t.value === formData.cargoType)?.label}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Description:</span>
                                  <span className="font-medium truncate max-w-[150px]">{formData.cargoDescription}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Weight:</span>
                                  <span className="font-medium">{formData.cargoWeight} kg</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                  <span className="text-muted-foreground font-semibold">Service Fee:</span>
                                  <span className="font-bold text-green-700 text-lg">₱{calculatedPrice.toFixed(2)}</span>
                                </div>
                                {formData.specialInstructions && (
                                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                    <span className="text-xs text-muted-foreground block mb-1">Special Instructions:</span>
                                    <span className="text-xs font-medium text-gray-700 italic block line-clamp-2">
                                      "{formData.specialInstructions}"
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-4 py-6">
                          <div className="flex justify-center">
                            <div className="bg-green-100 rounded-full p-4">
                              <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Waybill Created Successfully!</h3>
                            <p className="text-sm text-muted-foreground mt-1">Your cargo tracking document has been generated</p>
                          </div>
                          <div className="bg-gray-50 border rounded-lg p-4 max-w-sm mx-auto">
                            <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
                            <div className="flex items-center justify-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-2xl font-mono font-bold">{trackingNumber}</span>
                            </div>
                          </div>
                          {cancelCountdown !== null && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-sm mx-auto">
                              <p className="text-xs text-yellow-800">
                                <strong>Canceling in {cancelCountdown}s...</strong>
                              </p>
                              <Progress value={(5 - cancelCountdown) * 20} className="mt-2 h-1.5" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              {activeMainTab === "create" && (
                <div className="flex justify-between mt-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  <div className="flex gap-2">
                    {currentStep === 4 && trackingNumber ? (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            toast.success("Waybill sent to printer");
                          }}
                          className="gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                        <Button className="bg-[#15803d] hover:bg-[#166534]" onClick={() => {
                          setFormData({
                            senderName: "", senderContact: "", pickupTerminal: "",
                            receiverName: "", receiverContact: "", deliveryTerminal: "",
                            cargoType: "", cargoDescription: "", cargoWeight: "",
                            cargoValue: "", assignedBus: "", specialInstructions: "",
                          });
                          setCurrentStep(1);
                          setTrackingNumber("");
                        }}>
                          New Waybill
                        </Button>
                      </>
                    ) : currentStep === 4 ? (
                      <Button className="bg-[#15803d] hover:bg-[#166534]" onClick={handleSubmit}>
                        Generate Tracking Number
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="bg-[#15803d] hover:bg-[#166534]">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Receive Cargo Tab (Unchanged) */}
        <TabsContent value="receive" className="flex-1 overflow-hidden mt-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Arriving Cargo at This Terminal</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Confirm arrival and unload packages
                  </p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {arrivingCargo.length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pt-2">
              {arrivingCargo.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                  <div className="p-3 bg-white rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">All cargo received</h3>
                  <p className="text-xs text-gray-500">No pending cargo to unload at this time</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-xs py-2">Waybill & Recipient</TableHead>
                        <TableHead className="font-semibold text-xs py-2">Origin → Bus</TableHead>
                        <TableHead className="font-semibold text-xs py-2">ETA / Status</TableHead>
                        <TableHead className="font-semibold text-xs py-2">Pkg</TableHead>
                        <TableHead className="text-right font-semibold text-xs py-2">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {arrivingCargo.map((cargo) => (
                        <TableRow key={cargo.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="py-2">
                            <div className="font-semibold text-xs text-gray-900">{cargo.waybillId}</div>
                            <div className="text-xs text-gray-500">To: {cargo.receiverName}</div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-1 text-xs text-gray-700">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              {cargo.origin}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                              <Bus className="h-3 w-3 text-gray-400" />
                              {cargo.busNumber}
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{cargo.eta}</span>
                              <Badge 
                                variant={cargo.status === "Arrived" ? "default" : "secondary"}
                                className={`text-xs px-1.5 py-0 ${
                                  cargo.status === "Arrived" 
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" 
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                                }`}
                              >
                                {cargo.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3 text-gray-400" />
                              <span className="text-xs font-medium">{cargo.packages}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Button
                              onClick={() => handleConfirmArrival(cargo.id)}
                              className={`h-7 text-xs px-2 gap-1 ${
                                cargo.status === "Arrived"
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={cargo.status !== "Arrived"}
                            >
                              {cargo.status === "Arrived" && <CheckCircle2 className="h-3 w-3" />}
                              Confirm
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}