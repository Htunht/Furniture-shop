import { Outlet } from "react-router";
import { Navbar } from "./NavBar";
import { Footer } from "./Footer";

function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
