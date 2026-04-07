import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ParkingSpots } from "./pages/ParkingSpots";
import { Vehicles } from "./pages/Vehicles";
import { Revenue } from "./pages/Revenue";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "parking-spots", Component: ParkingSpots },
      { path: "vehicles", Component: Vehicles },
      { path: "revenue", Component: Revenue },
      { path: "settings", Component: Settings },
    ],
  },
]);
