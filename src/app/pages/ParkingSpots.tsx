import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Filter, MapPin } from "lucide-react";
import { Badge } from "../components/ui/badge";

type SpotStatus = "available" | "occupied" | "reserved" | "maintenance";

interface ParkingSpot {
  id: string;
  zone: string;
  number: string;
  status: SpotStatus;
  vehicle?: string;
  startTime?: string;
  duration?: string;
}

const mockSpots: ParkingSpot[] = [
  { id: "1", zone: "A", number: "01", status: "occupied", vehicle: "ABC-1234", startTime: "09:30 AM", duration: "2h 15m" },
  { id: "2", zone: "A", number: "02", status: "available" },
  { id: "3", zone: "A", number: "03", status: "occupied", vehicle: "DEF-5678", startTime: "08:45 AM", duration: "3h 30m" },
  { id: "4", zone: "A", number: "04", status: "reserved" },
  { id: "5", zone: "A", number: "05", status: "available" },
  { id: "6", zone: "A", number: "06", status: "occupied", vehicle: "GHI-9012", startTime: "10:00 AM", duration: "1h 45m" },
  { id: "7", zone: "A", number: "07", status: "available" },
  { id: "8", zone: "A", number: "08", status: "maintenance" },
  { id: "9", zone: "B", number: "01", status: "occupied", vehicle: "JKL-3456", startTime: "07:30 AM", duration: "4h 15m" },
  { id: "10", zone: "B", number: "02", status: "available" },
  { id: "11", zone: "B", number: "03", status: "occupied", vehicle: "MNO-7890", startTime: "09:15 AM", duration: "2h 30m" },
  { id: "12", zone: "B", number: "04", status: "available" },
  { id: "13", zone: "B", number: "05", status: "reserved" },
  { id: "14", zone: "B", number: "06", status: "occupied", vehicle: "PQR-2345", startTime: "08:00 AM", duration: "3h 45m" },
  { id: "15", zone: "B", number: "07", status: "available" },
  { id: "16", zone: "B", number: "08", status: "available" },
  { id: "17", zone: "C", number: "01", status: "occupied", vehicle: "STU-6789", startTime: "10:30 AM", duration: "1h 15m" },
  { id: "18", zone: "C", number: "02", status: "available" },
  { id: "19", zone: "C", number: "03", status: "available" },
  { id: "20", zone: "C", number: "04", status: "occupied", vehicle: "VWX-0123", startTime: "09:00 AM", duration: "2h 45m" },
];

const statusColors: Record<SpotStatus, string> = {
  available: "bg-green-100 border-green-300 text-green-800",
  occupied: "bg-red-100 border-red-300 text-red-800",
  reserved: "bg-blue-100 border-blue-300 text-blue-800",
  maintenance: "bg-gray-100 border-gray-300 text-gray-800",
};

const statusBadgeColors: Record<SpotStatus, "default" | "secondary" | "destructive" | "outline"> = {
  available: "default",
  occupied: "destructive",
  reserved: "secondary",
  maintenance: "outline",
};

export function ParkingSpots() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<SpotStatus | "all">("all");

  const filteredSpots = mockSpots.filter((spot) => {
    const matchesSearch = 
      spot.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.vehicle && spot.vehicle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === "all" || spot.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    available: mockSpots.filter(s => s.status === "available").length,
    occupied: mockSpots.filter(s => s.status === "occupied").length,
    reserved: mockSpots.filter(s => s.status === "reserved").length,
    maintenance: mockSpots.filter(s => s.status === "maintenance").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Parking Spots</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all parking spaces</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reserved}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-600">{stats.maintenance}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by spot number, zone, or vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "available" ? "default" : "outline"}
                onClick={() => setFilterStatus("available")}
              >
                Available
              </Button>
              <Button
                variant={filterStatus === "occupied" ? "default" : "outline"}
                onClick={() => setFilterStatus("occupied")}
              >
                Occupied
              </Button>
              <Button
                variant={filterStatus === "reserved" ? "default" : "outline"}
                onClick={() => setFilterStatus("reserved")}
              >
                Reserved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSpots.map((spot) => (
          <div
            key={spot.id}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${statusColors[spot.status]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-bold">{spot.zone}-{spot.number}</span>
              </div>
              <Badge variant={statusBadgeColors[spot.status]}>
                {spot.status}
              </Badge>
            </div>
            
            {spot.status === "occupied" && spot.vehicle && (
              <div className="space-y-1">
                <p className="font-medium">{spot.vehicle}</p>
                <p className="text-sm">Start: {spot.startTime}</p>
                <p className="text-sm">Duration: {spot.duration}</p>
              </div>
            )}
            
            {spot.status === "available" && (
              <p className="text-sm">Ready for parking</p>
            )}
            
            {spot.status === "reserved" && (
              <p className="text-sm">Reserved spot</p>
            )}
            
            {spot.status === "maintenance" && (
              <p className="text-sm">Under maintenance</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
