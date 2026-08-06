import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
      <AlertCircle className="w-20 h-20 text-destructive opacity-80" />
      <div className="space-y-2">
        <h1 className="text-4xl font-mono font-bold text-foreground tracking-widest">404 NOT FOUND</h1>
        <p className="text-muted-foreground font-sans max-w-md">
          The requested system node or telemetry endpoint does not exist. Check your path or return to the command hub.
        </p>
      </div>
      <Link href="/">
        <button className="px-6 py-2 bg-primary/10 text-primary border border-primary/30 rounded font-mono font-bold tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-[inset_0_0_12px_rgba(24,191,120,0.1)]">
          INITIATE HUB RETURN
        </button>
      </Link>
    </div>
  );
}
