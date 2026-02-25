import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { Edit2, MessageSquare } from "lucide-react";
import { cn } from "./ui/utils";
import { useNavigate } from "react-router";

interface FleetDispatch {
  id: string;
  busNumber: string;
  driverName: string;
  destination: string;
  status: string;
  currentLocation?: string;
  lastSynced?: number; // minutes ago
  isLive?: boolean;
  hasUnreadMessages?: boolean;
}

interface FleetDispatchTableProps {
  dispatches: FleetDispatch[];
}

export function FleetDispatchTable({ dispatches }: FleetDispatchTableProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    dispatches.reduce((acc, dispatch) => {
      acc[dispatch.id] = dispatch.status;
      return acc;
    }, {} as Record<string, string>)
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    setStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "bg-green-100 text-green-700 border-green-200";
      case "departed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "preparing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "arrived":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle>Fleet Dispatch</CardTitle>
        <p className="text-sm text-muted-foreground">Active bus status</p>
      </CardHeader>
      <CardContent className="px-0 pb-0 flex-1 overflow-hidden">
        <div className="overflow-y-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[80px] pl-6">Bus #</TableHead>
                <TableHead className="w-[110px]">Route</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[50px] text-center">
                  <MessageSquare className="h-4 w-4 inline-block" />
                </TableHead>
                <TableHead className="pr-6">GPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.map((dispatch) => (
                <TableRow key={dispatch.id}>
                  <TableCell className="font-medium pl-6">{dispatch.busNumber}</TableCell>
                  <TableCell>
                    <div className="truncate text-sm max-w-[110px]" title={dispatch.destination}>
                      {dispatch.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === dispatch.id ? (
                      <div className="flex gap-1">
                        <select
                          value={statuses[dispatch.id]}
                          onChange={(e) => handleStatusChange(dispatch.id, e.target.value)}
                          className="text-xs border rounded px-1.5 py-1 w-[85px]"
                          autoFocus
                          onBlur={() => setEditingId(null)}
                        >
                          <option value="Preparing">Preparing</option>
                          <option value="Departed">Departed</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Arrived">Arrived</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-2 py-0 h-5 border",
                            getStatusColor(statuses[dispatch.id])
                          )}
                        >
                          {statuses[dispatch.id]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(dispatch.id)}
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                          title="Edit"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/fleet-intercom?bus=${dispatch.id}`)}
                      className={cn(
                        "h-6 w-6 relative mx-auto",
                        dispatch.hasUnreadMessages 
                          ? "text-[#15803d] hover:text-[#166534] hover:bg-green-50" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      )}
                      title={dispatch.hasUnreadMessages ? "Unread messages" : "Open intercom"}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {dispatch.hasUnreadMessages && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-1.5">
                      {dispatch.isLive !== false ? (
                        <>
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-xs text-green-600 font-medium">Live</span>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                          <span className="text-xs text-orange-600">
                            {dispatch.lastSynced}m
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}