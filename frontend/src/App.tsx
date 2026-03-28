import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-background text-foreground">
        {/* Global Layout Boilerplate */}
        <Outlet />
      </div>
    ),
    errorElement: <div>404 - Not Found</div>,
    children: [
      {
        index: true,
        element: <div>Home Page</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
