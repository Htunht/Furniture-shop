import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function App() {
  const Navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // console.log("Session data:", session);
    if (!isPending && !session) {
      // Redirect to login page if not authenticated
      Navigate("/login");
    }
  }, [session, isPending, Navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }
  const TestAuth = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch session data:");
      }
      const data = await response.json();
      console.log("Session data from API:", data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };
  return (
    <>
      <h1>Welcome to the Furniture Store</h1>
      {session && <p>Hello, {session.user.name}</p>}
      {session && <p>Email: {session.user.email}</p>}
      {session ? (
        <Button onClick={() => signOut()}>Sign Out</Button>
      ) : (
        <p>Please sign in to access more features.</p>
      )}
      <Button onClick={() => TestAuth()}>Test Auth</Button>
    </>
  );
}

export default App;
