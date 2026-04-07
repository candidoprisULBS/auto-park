import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 45200 },
  { month: "Feb", revenue: 52800 },
  { month: "Mar", revenue: 48600 },
  { month: "Apr", revenue: 61200 },
  { month: "May", revenue: 68500 },
  { month: "Jun", revenue: 73100 },
  { month: "Jul", revenue: 69900 },
  { month: "Aug", revenue: 75400 },
  { month: "Sep", revenue: 71200 },
  { month: "Oct", revenue: 78600 },
  { month: "Nov", revenue: 82300 },
  { month: "Dec", revenue: 79500 },
];

const paymentMethods = [
  { name: "Credit Card", value: 45, color: "#3b82f6" },
  { name: "Cash", value: 25, color: "#10b981" },
  { name: "Mobile Payment", value: 20, color: "#f59e0b" },
  { name: "Subscription", value: 10, color: "#8b5cf6" },
];

const recentTransactions = [
  { id: 1, vehicle: "ABC-1234", amount: "$15.50", method: "Credit Card", time: "10 min ago" },
  { id: 2, vehicle: "DEF-5678", amount: "$24.00", method: "Cash", time: "25 min ago" },
  { id: 3, vehicle: "GHI-9012", amount: "$12.00", method: "Mobile Pay", time: "45 min ago" },
  { id: 4, vehicle: "JKL-3456", amount: "$29.00", method: "Credit Card", time: "1h ago" },
  { id: 5, vehicle: "MNO-7890", amount: "$17.00", method: "Credit Card", time: "1h 15m ago" },
  { id: 6, vehicle: "PQR-2345", amount: "$29.00", method: "Cash", time: "1h 30m ago" },
  { id: 7, vehicle: "STU-6789", amount: "$8.50", method: "Mobile Pay", time: "2h ago" },
  { id: 8, vehicle: "VWX-0123", amount: "$18.50", method: "Subscription", time: "2h 15m ago" },
];

export function Revenue() {
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthly = (totalRevenue / monthlyRevenue.length).toFixed(0);
  const todayRevenue = "2,847";
  const pendingPayments = "8";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
        <p className="text-gray-600 mt-1">Track income and payment analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${todayRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Monthly</p>
                <p className="text-2xl font-bold text-gray-900">${avgMonthly}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.vehicle}</p>
                    <p className="text-sm text-gray-600">{transaction.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{transaction.amount}</p>
                  <p className="text-sm text-gray-500">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
