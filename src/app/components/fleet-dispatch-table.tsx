import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { useState } from "react";

interface FleetDispatch {
  id: string;
  busNumber: string;
  driverName: string;
  destination: string;
  status: string;
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

  const handleStatusChange = (id: string, newStatus: string) => {
    setStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Dispatch Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus Number</TableHead>
              <TableHead>Driver Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="w-[200px]">Manual Status Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dispatches.map((dispatch) => (
              <TableRow key={dispatch.id}>
                <TableCell>{dispatch.busNumber}</TableCell>
                <TableCell>{dispatch.driverName}</TableCell>
                <TableCell>{dispatch.destination}</TableCell>
                <TableCell>
                  <Select 
                    value={statuses[dispatch.id]} 
                    onValueChange={(value) => handleStatusChange(dispatch.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preparing">Preparing</SelectItem>
                      <SelectItem value="Departed">Departed</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Arrived">Arrived</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
