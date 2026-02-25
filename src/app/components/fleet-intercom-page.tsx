import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Paperclip, 
  Circle,
  MapPin,
  Clock,
  Package
} from "lucide-react";

interface ActiveTrip {
  id: string;
  busNumber: string;
  conductorName: string;
  route: string;
  status: "In Transit" | "Departed";
  lastActive: string;
  currentLocation: string;
  eta: string;
  cargo: Array<{
    waybillId: string;
    description: string;
    destination: string;
  }>;
}

interface Message {
  id: string;
  text: string;
  sender: "admin" | "conductor";
  timestamp: string;
  imageUrl?: string;
}

const mockActiveTrips: ActiveTrip[] = [
  {
    id: "1",
    busNumber: "PB-001",
    conductorName: "Juan Cruz",
    route: "Manila to Baguio",
    status: "In Transit",
    lastActive: "2 mins ago",
    currentLocation: "NLEX Dau Exit",
    eta: "45 mins to next terminal",
    cargo: [
      { waybillId: "WB-2024-001", description: "Electronics (2 boxes)", destination: "Baguio" },
      { waybillId: "WB-2024-015", description: "Documents", destination: "Baguio" },
    ]
  },
  {
    id: "2",
    busNumber: "PB-015",
    conductorName: "Maria Santos",
    route: "Quezon City to Tuguegarao",
    status: "Departed",
    lastActive: "5 mins ago",
    currentLocation: "Sta. Maria, Bulacan",
    eta: "2 hrs to next terminal",
    cargo: [
      { waybillId: "WB-2024-032", description: "Medical Supplies", destination: "Tuguegarao" },
    ]
  },
  {
    id: "3",
    busNumber: "PB-042",
    conductorName: "Ana Garcia",
    route: "Pangasinan to Laoag",
    status: "In Transit",
    lastActive: "1 min ago",
    currentLocation: "Pozorrubio",
    eta: "1 hr 15 mins to next terminal",
    cargo: [
      { waybillId: "WB-2024-048", description: "Clothing (5 bags)", destination: "Laoag" },
      { waybillId: "WB-2024-049", description: "Food Items", destination: "Laoag" },
      { waybillId: "WB-2024-050", description: "Books", destination: "Vigan" },
    ]
  },
  {
    id: "4",
    busNumber: "PB-023",
    conductorName: "Pedro Reyes",
    route: "Tarlac to Vigan",
    status: "Departed",
    lastActive: "12 mins ago",
    currentLocation: "Tarlac Terminal",
    eta: "30 mins to departure",
    cargo: []
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    { id: "m1", text: "Good afternoon, Juan. We need an ETA update.", sender: "admin", timestamp: "2:15 PM" },
    { id: "m2", text: "Roger that! Currently at NLEX Dau. Will arrive in 45 minutes.", sender: "conductor", timestamp: "2:16 PM" },
    { id: "m3", text: "Thanks for the update. Any issues with the cargo?", sender: "admin", timestamp: "2:17 PM" },
    { id: "m4", text: "All secure. Electronics are properly stored.", sender: "conductor", timestamp: "2:18 PM" },
  ],
  "2": [
    { id: "m1", text: "Maria, please confirm your current location.", sender: "admin", timestamp: "1:45 PM" },
    { id: "m2", text: "At Sta. Maria, Bulacan. On schedule.", sender: "conductor", timestamp: "1:47 PM" },
  ]
};

export function FleetIntercomPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string>("1");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTrip = mockActiveTrips.find(trip => trip.id === selectedTripId);
  const currentMessages = messages[selectedTripId] || [];

  const filteredTrips = mockActiveTrips.filter(trip => 
    trip.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.conductorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTripId) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      text: messageInput,
      sender: "admin",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedTripId]: [...(prev[selectedTripId] || []), newMessage]
    }));

    setMessageInput("");
  };

  useEffect(() => {
    const busId = searchParams.get("bus");
    if (busId && mockActiveTrips.some(trip => trip.id === busId)) {
      setSelectedTripId(busId);
    }
  }, [searchParams]);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      {/* Page Header */}
      <div className="mb-4 flex items-center gap-3 flex-shrink-0">
        <div className="p-2 bg-green-600 rounded-lg">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Fleet Intercom</h1>
          <p className="text-sm text-gray-600">Real-time messaging with active conductors</p>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* LEFT PANE: Active Trips List */}
        <Card className="col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-base">Active Trips</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bus or conductor..."
                className="pl-8 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4 pb-4">
              <div className="space-y-2">
                {filteredTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTripId === trip.id
                        ? 'bg-green-50 border-green-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Circle 
                          className={`h-2 w-2 fill-current ${
                            trip.status === "In Transit" ? "text-green-500 animate-pulse" : "text-blue-500"
                          }`} 
                        />
                        <span className="font-bold text-sm">{trip.busNumber}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs h-5 ${
                          trip.status === "In Transit" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {trip.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-xs text-gray-900 mb-0.5">{trip.conductorName}</p>
                    <p className="text-xs text-gray-600 mb-1">{trip.route}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {trip.lastActive}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* MIDDLE PANE: Chat Window */}
        <Card className="col-span-6 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <CardHeader className="pb-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-current text-green-500 animate-pulse" />
                  {selectedTrip?.busNumber} - {selectedTrip?.conductorName}
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">{selectedTrip?.route}</p>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {currentMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === "admin" ? "order-2" : "order-1"}`}>
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.sender === "admin"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-xs mt-1 px-1 ${
                        msg.sender === "admin" ? "text-right text-green-600" : "text-left text-gray-500"
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 flex-shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                placeholder="Type your message..."
                className="flex-1 h-10"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 h-10 px-4 gap-2 flex-shrink-0"
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* RIGHT PANE: Trip Info & Cargo */}
        <Card className="col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-base">Trip Info</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {/* Current Location */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-900 mb-1">Current Location</p>
                      <p className="text-sm text-green-800">{selectedTrip?.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-green-300">
                    <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-900 mb-1">ETA</p>
                      <p className="text-sm text-green-800">{selectedTrip?.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-3.5 w-3.5 text-green-700" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Route</h3>
                  </div>
                  <p className="text-sm text-gray-700 pl-8">{selectedTrip?.route}</p>
                </div>

                {/* Cargo on Board */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Package className="h-3.5 w-3.5 text-green-700" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Cargo on Board</h3>
                    <Badge className="ml-auto bg-green-600 text-white text-xs h-5">
                      {selectedTrip?.cargo.length || 0}
                    </Badge>
                  </div>
                  
                  {selectedTrip?.cargo && selectedTrip.cargo.length > 0 ? (
                    <div className="space-y-2 pl-8">
                      {selectedTrip.cargo.map((item) => (
                        <div 
                          key={item.waybillId}
                          className="p-2 bg-gray-50 border border-gray-200 rounded"
                        >
                          <p className="text-xs font-semibold text-gray-900 mb-0.5">{item.waybillId}</p>
                          <p className="text-xs text-gray-700 mb-1">{item.description}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.destination}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 pl-8 italic">No cargo loaded</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}