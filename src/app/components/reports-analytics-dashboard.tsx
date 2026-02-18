import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileDown,
  TrendingUp,
  Package,
  Wrench,
  Star,
  Calendar,
  FileText,
} from "lucide-react";

type DateRange = "today" | "week" | "month" | "quarter" | "year";

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface WeeklyVolumeData {
  day: string;
  passengers: number;
  cargo: number;
}

interface MaintenanceIssue {
  id: string;
  busModel: string;
  issueType: string;
  occurrences: number;
  avgResolutionDays: number;
  severity: "High" | "Medium" | "Low";
}

const weeklyVolumeData: WeeklyVolumeData[] = [
  { day: "Mon", passengers: 1250, cargo: 89 },
  { day: "Tue", passengers: 1340, cargo: 102 },
  { day: "Wed", passengers: 1180, cargo: 76 },
  { day: "Thu", passengers: 1420, cargo: 118 },
  { day: "Fri", passengers: 1680, cargo: 145 },
  { day: "Sat", passengers: 1890, cargo: 156 },
  { day: "Sun", passengers: 1560, cargo: 132 },
];

const maintenanceIssues: MaintenanceIssue[] = [
  {
    id: "1",
    busModel: "Hino RK8JSKA (45-seater)",
    issueType: "Brake System Wear",
    occurrences: 12,
    avgResolutionDays: 2,
    severity: "High",
  },
  {
    id: "2",
    busModel: "Yutong ZK6127H (52-seater)",
    issueType: "Air Conditioning Failure",
    occurrences: 8,
    avgResolutionDays: 3,
    severity: "Medium",
  },
  {
    id: "3",
    busModel: "Hino RK8JSKA (45-seater)",
    issueType: "Suspension Issues",
    occurrences: 7,
    avgResolutionDays: 4,
    severity: "Medium",
  },
  {
    id: "4",
    busModel: "Yutong ZK6127H (52-seater)",
    issueType: "Engine Oil Leak",
    occurrences: 6,
    avgResolutionDays: 1,
    severity: "High",
  },
  {
    id: "5",
    busModel: "Hino RK8JSKA (45-seater)",
    issueType: "Alternator Replacement",
    occurrences: 5,
    avgResolutionDays: 2,
    severity: "Medium",
  },
  {
    id: "6",
    busModel: "Santarosa Voyager (45-seater)",
    issueType: "Tire Replacement",
    occurrences: 4,
    avgResolutionDays: 1,
    severity: "Low",
  },
];

export function ReportsAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("month");

  const getMetrics = (range: DateRange): MetricCard[] => {
    const metricsData = {
      today: {
        trips: 42,
        waybills: 28,
        maintenance: 3,
        satisfaction: 4.5,
      },
      week: {
        trips: 294,
        waybills: 196,
        maintenance: 12,
        satisfaction: 4.6,
      },
      month: {
        trips: 1248,
        waybills: 832,
        maintenance: 48,
        satisfaction: 4.7,
      },
      quarter: {
        trips: 3744,
        waybills: 2496,
        maintenance: 144,
        satisfaction: 4.6,
      },
      year: {
        trips: 14976,
        waybills: 9984,
        maintenance: 576,
        satisfaction: 4.5,
      },
    };

    const data = metricsData[range];

    return [
      {
        title: "Total Completed Trips",
        value: data.trips.toLocaleString(),
        change: "+12.5%",
        trend: "up",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        title: "Cargo Waybills Processed",
        value: data.waybills.toLocaleString(),
        change: "+8.3%",
        trend: "up",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "Maintenance Alerts Resolved",
        value: data.maintenance.toLocaleString(),
        change: "-5.2%",
        trend: "down",
        icon: <Wrench className="h-5 w-5" />,
      },
      {
        title: "Avg. Passenger Satisfaction",
        value: data.satisfaction.toFixed(1),
        change: "+0.2",
        trend: "up",
        icon: <Star className="h-5 w-5" />,
      },
    ];
  };

  const metrics = getMetrics(dateRange);

  const handleExport = (format: "pdf" | "excel") => {
    alert(
      `Exporting ${dateRange === "today" ? "today's" : dateRange === "week" ? "this week's" : dateRange === "month" ? "this month's" : dateRange === "quarter" ? "this quarter's" : "this year's"} report data to ${format.toUpperCase()}...`
    );
  };

  const getSeverityBadge = (severity: MaintenanceIssue["severity"]) => {
    switch (severity) {
      case "High":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDateRangeLabel = (range: DateRange) => {
    switch (range) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "quarter":
        return "This Quarter";
      case "year":
        return "This Year";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Management Reports & Analytics</h1>
        </div>
      </div>

      {/* Filter and Export Controls */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 border">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">Date Range:</span>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <FileDown className="h-4 w-4" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
              <FileText className="h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2">
              <FileText className="h-4 w-4" />
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-3xl mb-2">{metric.value}</p>
                  <p className={`text-sm flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                    {metric.change} vs previous period
                  </p>
                </div>
                <div className="text-primary">{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Visualization Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Bar Chart - Weekly Passenger & Cargo Volume */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Passenger & Cargo Volume</CardTitle>
            <p className="text-sm text-muted-foreground">
              Logged passenger count and cargo shipments from completed trips
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px" }}
                  iconType="square"
                />
                <Bar 
                  dataKey="passengers" 
                  fill="hsl(var(--primary))" 
                  name="Passengers"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="cargo" 
                  fill="#10b981" 
                  name="Cargo Shipments"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Data compiled from manual trip logs and waybill records
            </p>
          </CardContent>
        </Card>

        {/* Maintenance Issues Table */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Maintenance Issues by Bus Model</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most frequent issues from service log entries
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Model</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead className="text-center">Avg. Days</TableHead>
                  <TableHead className="text-center">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="text-xs">{issue.busModel}</TableCell>
                    <TableCell className="text-xs">{issue.issueType}</TableCell>
                    <TableCell className="text-center text-xs">{issue.occurrences}</TableCell>
                    <TableCell className="text-center text-xs">{issue.avgResolutionDays}</TableCell>
                    <TableCell className="text-center">{getSeverityBadge(issue.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Data aggregated from maintenance service records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4">
        <p className="text-sm text-accent-foreground">
          <strong>Report Data Sources:</strong>
          <br />
          • Trip completion logs manually entered by dispatch staff
          <br />
          • Cargo waybill records from cargo office database
          <br />
          • Maintenance service logs from mechanic worksheets
          <br />
          • Passenger satisfaction surveys collected at terminals
          <br />
          <br />
          All data represents historical records and manually logged information. Use the date range filter to view different time periods and export options to generate printable reports.
        </p>
      </div>
    </div>
  );
}
