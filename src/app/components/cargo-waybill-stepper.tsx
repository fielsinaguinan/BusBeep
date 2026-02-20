import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ValidatedInput } from "./ui/validated-input";
import { ValidatedLabel } from "./ui/validated-label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, FileText, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
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
  specialInstructions: string;
}

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
  specialInstructions: "",
};

export function CargoWaybillStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WaybillData>(initialData);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [cancelCountdown, setCancelCountdown] = useState<number | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Cargo Waybill</h1>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.status === "complete"
                        ? "bg-green-600 border-green-600 text-white"
                        : step.status === "current"
                        ? "border-primary text-primary bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step.status === "current" ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${
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
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
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
                <ValidatedLabel htmlFor="pickupTerminal" required isFilled={!!formData.pickupTerminal}>
                  Pickup Terminal
                </ValidatedLabel>
                <Select value={formData.pickupTerminal} onValueChange={(value) => handleInputChange("pickupTerminal", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pickup terminal" />
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
            <div className="space-y-4">
              <div>
                <ValidatedLabel htmlFor="cargoType" required isFilled={!!formData.cargoType}>
                  Cargo Type
                </ValidatedLabel>
                <Select value={formData.cargoType} onValueChange={(value) => handleInputChange("cargoType", value)}>
                  <SelectTrigger className="w-full">
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
                  Cargo Description
                </ValidatedLabel>
                <ValidatedInput
                  id="cargoDescription"
                  value={formData.cargoDescription}
                  onChange={(e) => handleInputChange("cargoDescription", e.target.value)}
                  placeholder="Brief description of contents"
                  showValidation
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
                <div>
                  <ValidatedLabel htmlFor="cargoValue" required isFilled={!!formData.cargoValue}>
                    Declared Value (₱)
                  </ValidatedLabel>
                  <ValidatedInput
                    id="cargoValue"
                    type="number"
                    value={formData.cargoValue}
                    onChange={(e) => handleInputChange("cargoValue", e.target.value)}
                    placeholder="0.00"
                    showValidation
                  />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Total Service Fee:</span>
                  <span className="text-2xl font-bold text-green-700">₱{calculatedPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Auto-calculated based on weight and cargo type
                </p>
              </div>
              <div>
                <ValidatedLabel htmlFor="specialInstructions">
                  Special Instructions
                </ValidatedLabel>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  placeholder="Any special handling or delivery instructions (optional)"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {!trackingNumber ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Review Your Details</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Please verify all information before submitting. Once submitted, you can cancel within 5 seconds.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground">SENDER INFORMATION</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{formData.senderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact:</span>
                          <span className="font-medium">{formData.senderContact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pickup:</span>
                          <span className="font-medium text-right max-w-xs">
                            {terminals.find(t => t.value === formData.pickupTerminal)?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground">RECEIVER INFORMATION</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{formData.receiverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact:</span>
                          <span className="font-medium">{formData.receiverContact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery:</span>
                          <span className="font-medium text-right max-w-xs">
                            {terminals.find(t => t.value === formData.deliveryTerminal)?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 text-sm text-muted-foreground">CARGO DETAILS</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">
                            {cargoTypes.find(t => t.value === formData.cargoType)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Description:</span>
                          <span className="font-medium">{formData.cargoDescription}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{formData.cargoWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Declared Value:</span>
                          <span className="font-medium">₱{formData.cargoValue}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-muted-foreground font-semibold">Service Fee:</span>
                          <span className="font-bold text-green-700 text-lg">₱{calculatedPrice.toFixed(2)}</span>
                        </div>
                        {formData.specialInstructions && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Instructions:</span>
                            <span className="font-medium text-right max-w-xs">{formData.specialInstructions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center">
                    <div className="bg-green-100 rounded-full p-4">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Waybill Created Successfully!</h3>
                    <p className="text-muted-foreground mt-2">Your cargo tracking document has been generated</p>
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-3xl font-mono font-bold">{trackingNumber}</span>
                    </div>
                  </div>
                  {cancelCountdown !== null && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-yellow-800">
                        <strong>Canceling in {cancelCountdown}s...</strong>
                      </p>
                      <Progress value={(5 - cancelCountdown) * 20} className="mt-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
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
              <Button variant="outline" onClick={handleCancel} disabled={cancelCountdown !== null}>
                Cancel
              </Button>
              <Button className="bg-[#15803d] hover:bg-[#166534]" onClick={() => {
                setFormData(initialData);
                setCurrentStep(1);
                setTrackingNumber("");
              }}>
                Create New Waybill
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
    </div>
  );
}