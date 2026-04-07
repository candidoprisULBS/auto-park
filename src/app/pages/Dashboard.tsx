import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Car, DollarSign, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const stats = [
  {
    title: "Total Spots",
    value: "250",
    change: "+12%",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Occupied",
    value: "187",
    change: "75%",
    icon: Car,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Today's Revenue",
    value: "$2,847",
    change: "+8.2%",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Avg. Duration",
    value: "3.2h",
    change: "-0.5h",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const weeklyData = [
  { day: "Mon", revenue: 2400, vehicles: 45 },
  { day: "Tue", revenue: 2800, vehicles: 52 },
  { day: "Wed", revenue: 2600, vehicles: 48 },
  { day: "Thu", revenue: 3200, vehicles: 58 },
  { day: "Fri", revenue: 3500, vehicles: 62 },
  { day: "Sat", revenue: 3100, vehicles: 55 },
  { day: "Sun", revenue: 2900, vehicles: 51 },
];

const hourlyData = [
  { hour: "00:00", occupied: 45 },
  { hour: "03:00", occupied: 32 },
  { hour: "06:00", occupied: 58 },
  { hour: "09:00", occupied: 142 },
  { hour: "12:00", occupied: 165 },
  { hour: "15:00", occupied: 178 },
  { hour: "18:00", occupied: 195 },
  { hour: "21:00", occupied: 128 },
];

const recentActivity = [
  { id: 1, vehicle: "ABC-1234", spot: "A-12", action: "Entry", time: "2 min ago" },
  { id: 2, vehicle: "XYZ-5678", spot: "B-08", action: "Exit", time: "5 min ago" },
  { id: 3, vehicle: "DEF-9012", spot: "C-15", action: "Entry", time: "8 min ago" },
  { id: 4, vehicle: "GHI-3456", spot: "A-05", action: "Exit", time: "12 min ago" },
  { id: 5, vehicle: "JKL-7890", spot: "D-22", action: "Entry", time: "15 min ago" },
];

export function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to AutoPark Pro management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupied" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.action === "Entry" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{activity.vehicle}</p>
                    <p className="text-sm text-gray-600">Spot: {activity.spot}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
