import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <div className="p-10 text-destructive font-bold text-2xl">404 - Not Found</div>,
    children: [
      {
        index: true,
        element: (
          <div className="h-full flex flex-col gap-6">
            <h1>Dashboard</h1>
          </div>
        ),
      },
      {
        path: "/distributions",
        element: <div>Distributions Placeholder</div>
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
        element: <div>Water Sources Placeholder</div>
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

