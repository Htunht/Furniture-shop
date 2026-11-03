import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function LoginCallbackPage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;

    navigate(session?.user.role === "admin" ? "/admin" : "/", {
      replace: true,
    });
  }, [isPending, navigate, session]);

  return (
    <div
      className="flex min-h-svh items-center justify-center gap-2"
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Signing you in...</span>
    </div>
  );
}
