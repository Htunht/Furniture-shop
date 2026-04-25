import { useRouteError, Link } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorScreen() {
  const error = useRouteError() as any;
  
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center p-6 font-inter text-[#2C2926]">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-600 w-12 h-12" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-outfit uppercase tracking-tighter">Something went wrong.</h1>
          <p className="text-[#8B857A] text-sm leading-relaxed">
            We encountered an unexpected error while trying to load this architectural piece. 
            {error?.message && (
              <span className="block mt-2 font-mono text-[10px] bg-stone-100 p-3 rounded">
                Error Details: {error.message}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="h-12 px-8 rounded-none uppercase font-bold tracking-widest text-[10px] border-[#2C2926] text-[#2C2926] hover:bg-[#2C2926] hover:text-white"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link to="/">
            <Button className="h-12 px-8 rounded-none uppercase font-bold tracking-widest text-[10px] bg-[#2C2926] text-white w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-8 opacity-20">
           <span className="font-outfit font-bold uppercase tracking-tighter text-2xl">Tiger Balm</span>
        </div>
      </div>
    </div>
  );
}
