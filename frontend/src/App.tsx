import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ForumDashboard } from "./components/forum/ForumDashboard";

import { IssueDashboard } from "./components/Issues/IssueDashboard";
import { ReportIssueForm } from "./components/Issues/ReportIssueForm";
import { UpdateIssueForm } from "./components/Issues/UpdateIssueForm";
import { WaterSourceDashboard } from "./components/water-sources/WaterSourceDashboard";
import { CreateWaterSourceForm, UpdateWaterSourceForm } from "./components/water-sources/WaterSourceForms";
import { WaterTestDashboard } from "./components/water-tests/WaterTestDashboard";
import { CreateWaterTestForm, UpdateWaterTestForm } from "./components/water-tests/WaterTestForms";
import { Link } from "react-router-dom";
import { DistributionDashboard } from "./components/distribution/DistributionDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <div className="p-10 text-destructive font-bold text-2xl">404 - Not Found</div>,
    children: [
      {
        index: true,
        element: (
          <div className="h-full flex flex-col gap-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/issues" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                 <h2 className="text-emerald-900 font-semibold text-lg mb-2">Issue Reporting Dashboard</h2>
                 <p className="text-sm text-gray-500">View, manage, and report issues regarding water infrastructure and logistics.</p>
              </Link>
              <Link to="/water-sources" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                 <h2 className="text-emerald-900 font-semibold text-lg mb-2">Water Sources</h2>
                 <p className="text-sm text-gray-500">Manage reservoirs, wells, pumps, and current fill capacities.</p>
              </Link>
              <Link to="/water-tests" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                 <h2 className="text-emerald-900 font-semibold text-lg mb-2">Water Quality Logs</h2>
                 <p className="text-sm text-gray-500">Track and review water quality tests to maintain compliance.</p>
              </Link>
            </div>
          </div>
        ),
      },
      {
        path: "/distributions",
        element: <DistributionDashboard />
      },
      {
        path: "/forum",
        element: <ForumDashboard />
      },
      {
        path: "/issues",
        element: <IssueDashboard />
      },
      {
        path: "/issues/new",
        element: <ReportIssueForm />
      },
      {
        path: "/issues/edit/:id",
        element: <UpdateIssueForm />
      },
      {
        path: "/drivers",
        element: <div>Drivers Placeholder</div>
      },
      {
        path: "/beneficiaries",
        element: <div>Beneficiaries Placeholder</div>
      },
      {
        path: "/water-sources",
        element: <WaterSourceDashboard />
      },
      {
        path: "/water-sources/new",
        element: <CreateWaterSourceForm />
      },
      {
        path: "/water-sources/edit/:id",
        element: <UpdateWaterSourceForm />
      },
      {
        path: "/water-tests",
        element: <WaterTestDashboard />
      },
      {
        path: "/water-tests/new",
        element: <CreateWaterTestForm />
      },
      {
        path: "/water-tests/edit/:id",
        element: <UpdateWaterTestForm />
      },
      {
        path: "/settings",
        element: <div>Settings Placeholder</div>
      }
    ],
  },
]);

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

export default App;

