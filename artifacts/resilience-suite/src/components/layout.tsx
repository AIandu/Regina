import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Cpu, ShieldAlert, History, Sprout } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const nav = [
    { href: "/", label: "HUB", icon: Activity },
    { href: "/farm", label: "FARM INTEL", icon: Sprout },
    { href: "/datacenter", label: "DATA CENTER", icon: Cpu },
    { href: "/resilience", label: "RESILIENCE SIM", icon: ShieldAlert },
    { href: "/history", label: "AUDIT TRAIL", icon: History },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Decorative ambient noise */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <aside className="w-64 border-r border-border bg-sidebar/95 backdrop-blur-xl flex-shrink-0 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-6 border-b border-border">
          <Link href="/">
            <h1 className="font-mono text-xl font-bold tracking-tight text-primary flex items-center gap-3 cursor-pointer drop-shadow-[0_0_8px_rgba(24,191,120,0.5)]">
              <ShieldAlert className="w-6 h-6" />
              <span>RESILIENCE_OS</span>
            </h1>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-mono font-bold transition-all cursor-pointer",
                  location === item.href || (item.href !== "/" && location.startsWith(item.href))
                    ? "bg-primary/10 text-primary border border-primary/30 shadow-[inset_0_0_12px_rgba(24,191,120,0.1)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-border text-xs font-mono space-y-2 bg-black/20">
          <div className="flex justify-between items-center text-primary">
            <span>SYS.STATUS</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" />ONLINE</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span>UPLINK</span>
            <span>SECURE</span>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="flex-1 overflow-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
