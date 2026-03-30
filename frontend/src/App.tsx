import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
            {/* Header Banner - Like the image */}
            <Card className="bg-primary border-none text-primary-foreground shadow-lg overflow-hidden relative">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10 pb-2">
                <CardTitle className="text-3xl">Hello Grace!</CardTitle>
                <CardDescription className="text-primary-foreground/80 max-w-md text-base mt-2">
                  You have 3 new tasks & it is a lot of work for today! So let's start and review them.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 pb-8">
                <span className="inline-flex items-center justify-center px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg cursor-pointer text-sm font-medium">
                  Review Tasks
                </span>
              </CardContent>
            </Card>

            {/* Dashboard placeholder widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm border-border/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-primary">24</span>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">Active Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-secondary">12</span>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">Total Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-accent">342</span>
                </CardContent>
              </Card>
            </div>
          </div>
        ),
      },
      {
        path: "/distributions",
        element: <Card className="p-8"><CardTitle>Distributions Module Placeholder</CardTitle></Card>
      },
      {
        path: "/drivers",
        element: <Card className="p-8"><CardTitle>Drivers Module Placeholder</CardTitle></Card>
      },
      {
        path: "/beneficiaries",
        element: <Card className="p-8"><CardTitle>Beneficiaries Module Placeholder</CardTitle></Card>
      },
      {
        path: "/water-sources",
        element: <Card className="p-8"><CardTitle>Water Sources Module Placeholder</CardTitle></Card>
      },
      {
        path: "/settings",
        element: <Card className="p-8"><CardTitle>Settings Module Placeholder</CardTitle></Card>
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
