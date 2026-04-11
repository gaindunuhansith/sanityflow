import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { LoginPage } from "./features/auth/Login";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HomePage } from "./components/HomePage";
import { ContactPage } from "./components/ContactPage";
import { DocumentationPage } from "./components/DocumentationPage";
import { HelpCenterPage } from "./components/HelpCenterPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { FeaturesPage } from "./components/FeaturesPage";
import { AboutPage } from "./components/AboutPage";
import { ForumDashboard } from "./components/forum/ForumDashboard";
import { IssueDashboard } from "./components/Issues/IssueDashboard";
import { WaterSourceDashboard } from "./components/water-sources/WaterSourceDashboard";
import { WaterTestDashboard } from "./components/water-tests/WaterTestDashboard";
import { DistributionDashboard } from "./components/distribution/DistributionDashboard";
import { BlogDashboard } from "./components/blog/BlogDashboard";
import { DriverDashboard } from "./components/drivers/DriverDashboard";
import { BeneficiaryDashboard } from "./components/beneficiaries/BeneficiaryDashboard";
import { ResourceDashboard } from "./components/inventory/ResourceDashboard";
import { SupplierDashboard } from "./components/inventory/SupplierDashboard";
import { InventoryTransactionDashboard } from "./components/inventory/InventoryTransactionDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/documentation",
    element: <DocumentationPage />
  },
  {
    path: "/help",
    element: <HelpCenterPage />
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyPage />
  },
  {
    path: "/features",
    element: <FeaturesPage />
  },
  {
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    errorElement: <div className="p-10 text-destructive font-bold text-2xl">404 - Not Found</div>,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <div className="h-full flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/dashboard/issues" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Issue Reporting Dashboard</h2>
                    <p className="text-sm text-gray-500">View, manage, and report issues regarding water infrastructure and logistics.</p>
                  </Link>
                  <Link to="/dashboard/water-sources" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Water Sources</h2>
                    <p className="text-sm text-gray-500">Manage reservoirs, wells, pumps, and current fill capacities.</p>
                  </Link>
                  <Link to="/dashboard/water-tests" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Water Quality Logs</h2>
                    <p className="text-sm text-gray-500">Track and review water quality tests to maintain compliance.</p>
                  </Link>
                  <Link to="/dashboard/distributions" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Distribution Orders</h2>
                    <p className="text-sm text-gray-500">Manage water distribution orders and delivery schedules.</p>
                  </Link>
                  <Link to="/dashboard/blog" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Blog Management</h2>
                    <p className="text-sm text-gray-500">Manage dashboard blog posts and updates for the system.</p>
                  </Link>
                  <Link to="/dashboard/resources" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Resources</h2>
                    <p className="text-sm text-gray-500">Manage inventory resources with barcode scanning capabilities.</p>
                  </Link>
                  <Link to="/dashboard/suppliers" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Suppliers</h2>
                    <p className="text-sm text-gray-500">Manage supplier information and reliability ratings.</p>
                  </Link>
                  <Link to="/dashboard/inventory-transactions" className="block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all">
                    <h2 className="text-emerald-900 font-semibold text-lg mb-2">Inventory Transactions</h2>
                    <p className="text-sm text-gray-500">Track all inventory add, remove, and transfer transactions.</p>
                  </Link>
                </div>
              </div>
            ),
          },
          {
            path: "blog",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <BlogDashboard /> }]
          },
          {
            path: "distributions",
            element: <DistributionDashboard />
          },
          {
            path: "forum",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <ForumDashboard /> }]
          },
          {
            path: "issues",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <IssueDashboard /> }]
          },
          {
            path: "drivers",
            element: <ProtectedRoute allowedRoles={['admin', 'member', 'driver']} />,
            children: [{ index: true, element: <DriverDashboard /> }]
          },
          {
            path: "beneficiaries",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <BeneficiaryDashboard /> }]
          },
          {
            path: "water-sources",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <WaterSourceDashboard /> }]
          },
          {
            path: "water-tests",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <WaterTestDashboard /> }]
          },
          {
            path: "resources",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <ResourceDashboard /> }]
          },
          {
            path: "suppliers",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <SupplierDashboard /> }]
          },
          {
            path: "inventory-transactions",
            element: <ProtectedRoute allowedRoles={['admin', 'member']} />,
            children: [{ index: true, element: <InventoryTransactionDashboard /> }]
          },
          {
            path: "settings",
            element: <div>Settings Placeholder</div>
          }
        ]
      }
    ],
  },
  {
    path: "*",
    element: <div className="p-10 text-destructive font-bold text-2xl">404 - Not Found</div>,
  }
]);

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

export default App;
