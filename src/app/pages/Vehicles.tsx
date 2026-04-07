import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Search, Download, Car, Clock, DollarSign } from "lucide-react";

interface Vehicle {
  id: string;
  plateNumber: string;
  spotNumber: string;
  entryTime: string;
  exitTime?: string;
  duration: string;
  fee: string;
  status: "active" | "completed";
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plateNumber: "ABC-1234",
    spotNumber: "A-01",
    entryTime: "09:30 AM",
    duration: "2h 15m",
    fee: "$15.50",
    status: "active",
  },
  {
    id: "2",
    plateNumber: "DEF-5678",
    spotNumber: "A-03",
    entryTime: "08:45 AM",
    duration: "3h 30m",
    fee: "$24.00",
    status: "active",
  },
  {
    id: "3",
    plateNumber: "GHI-9012",
    spotNumber: "A-06",
    entryTime: "10:00 AM",
    duration: "1h 45m",
    fee: "$12.00",
    status: "active",
  },
  {
    id: "4",
    plateNumber: "JKL-3456",
    spotNumber: "B-01",
    entryTime: "07:30 AM",
    exitTime: "11:45 AM",
    duration: "4h 15m",
    fee: "$29.00",
    status: "completed",
  },
  {
    id: "5",
    plateNumber: "MNO-7890",
    spotNumber: "B-03",
    entryTime: "09:15 AM",
    duration: "2h 30m",
    fee: "$17.00",
    status: "active",
  },
  {
    id: "6",
    plateNumber: "PQR-2345",
    spotNumber: "B-06",
    entryTime: "08:00 AM",
    exitTime: "12:15 PM",
    duration: "4h 15m",
    fee: "$29.00",
    status: "completed",
  },
  {
    id: "7",
    plateNumber: "STU-6789",
    spotNumber: "C-01",
    entryTime: "10:30 AM",
    duration: "1h 15m",
    fee: "$8.50",
    status: "active",
  },
  {
    id: "8",
    plateNumber: "VWX-0123",
    spotNumber: "C-04",
    entryTime: "09:00 AM",
    duration: "2h 45m",
    fee: "$18.50",
    status: "active",
  },
  {
    id: "9",
    plateNumber: "YZA-4567",
    spotNumber: "A-12",
    entryTime: "06:30 AM",
    exitTime: "10:00 AM",
    duration: "3h 30m",
    fee: "$24.00",
    status: "completed",
  },
  {
    id: "10",
    plateNumber: "BCD-8901",
    spotNumber: "B-15",
    entryTime: "11:00 AM",
    duration: "0h 45m",
    fee: "$6.00",
    status: "active",
  },
];

export function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.spotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const activeVehicles = mockVehicles.filter(v => v.status === "active").length;
  const completedToday = mockVehicles.filter(v => v.status === "completed").length;
  const totalRevenue = mockVehicles.reduce((sum, v) => sum + parseFloat(v.fee.replace("$", "")), 0);
  const avgDuration = "2.5h";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <p className="text-gray-600 mt-1">Track all vehicles in the parking facility</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{activeVehicles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">{avgDuration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by plate number or spot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Spot</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.spotNumber}</TableCell>
                  <TableCell>{vehicle.entryTime}</TableCell>
                  <TableCell>{vehicle.exitTime || "-"}</TableCell>
                  <TableCell>{vehicle.duration}</TableCell>
                  <TableCell>{vehicle.fee}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
