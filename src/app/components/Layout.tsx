import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Car, DollarSign, Settings, ParkingSquare } from "lucide-react";

export function Layout() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/parking-spots", label: "Parking Spots", icon: ParkingSquare },
    { path: "/vehicles", label: "Vehicles", icon: Car },
    { path: "/revenue", label: "Revenue", icon: DollarSign },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <ParkingSquare className="w-8 h-8 text-blue-600" />
            <h1 className="font-bold text-xl">AutoPark Pro</h1>
          </div>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
