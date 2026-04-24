import { Outlet } from "react-router";
import { Navbar } from "./NavBar";

function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Technortal Furniture Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default RootLayout;
