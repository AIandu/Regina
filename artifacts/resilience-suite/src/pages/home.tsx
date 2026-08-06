import { useGetAnalysisStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Activity, Cpu, ShieldAlert, Sprout, ArrowRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: stats, isLoading } = useGetAnalysisStats();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono text-xs font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          GLOBAL UPLINK ESTABLISHED
        </div>
        <h2 className="text-5xl font-mono font-bold text-foreground mb-4 tracking-tight drop-shadow-md">COMMAND HUB</h2>
        <p className="text-muted-foreground font-sans max-w-2xl text-lg leading-relaxed">
          AI-Guided Infrastructure Resilience Platform. Select a prototype mission to begin strategic analysis. Telemetry and structural insights are calculated in real-time.
        </p>
      </header>

      {/* STATS PANEL */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-card border border-border animate-pulse rounded-lg" />
          ))
        ) : stats ? (
          <>
            <StatCard title="TOTAL ANALYSES" value={stats.total} icon={Activity} />
            <StatCard title="RECENT (7D)" value={stats.recentCount} icon={Clock} />
            <StatCard 
              title="APPROVAL RATE" 
              value={`${Math.round((stats.byStatus.approved || 0) / Math.max(1, stats.total) * 100)}%`} 
              icon={CheckCircle2} 
              color="text-primary"
            />
            <StatCard 
              title="AVG CONFIDENCE" 
              value={`${Math.round(stats.avgConfidenceScore || 0)}%`} 
              icon={AlertTriangle} 
              color={stats.avgConfidenceScore >= 80 ? "text-primary" : "text-accent"}
            />
          </>
        ) : null}
      </section>

      {/* MISSION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <MissionCard 
          href="/farm"
          title="FARM INTELLIGENCE"
          desc="Agricultural viability analysis using geographic and environmental parameters."
          icon={Sprout}
          stats={stats ? `${stats.byType.farm || 0} RUNS` : "..."}
        />
        <MissionCard 
          href="/datacenter"
          title="DATA CENTER HUB"
          desc="AI datacenter placement, cooling architecture, and thermal reuse simulation."
          icon={Cpu}
          stats={stats ? `${stats.byType.datacenter || 0} RUNS` : "..."}
        />
        <MissionCard 
          href="/resilience"
          title="RESILIENCE SIMULATOR"
          desc="Full country structural resilience blueprint against environmental constraints."
          icon={ShieldAlert}
          stats={stats ? `${stats.byType.resilience || 0} RUNS` : "..."}
        />
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-lg flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Icon className={cn("w-16 h-16", color || "text-foreground")} />
      </div>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <span className="text-xs font-mono font-bold text-muted-foreground tracking-widest">{title}</span>
      </div>
      <div className={cn("text-4xl font-mono font-bold drop-shadow-sm relative z-10", color || "text-foreground")}>{value}</div>
    </div>
  )
}

function MissionCard({ href, title, desc, icon: Icon, stats }: any) {
  return (
    <Link href={href}>
      <div className="group flex flex-col h-full bg-card/80 backdrop-blur-sm border border-border p-8 rounded-lg transition-all duration-300 hover:bg-card hover:border-primary/50 hover:shadow-[0_0_30px_rgba(24,191,120,0.15)] hover:-translate-y-1 cursor-pointer">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          <Icon className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(24,191,120,0.8)]" />
        </div>
        <h3 className="text-xl font-mono font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed flex-1">{desc}</p>
        <div className="flex items-center justify-between mt-auto border-t border-border/50 pt-5">
          <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-2">
            <Activity className="w-3 h-3" />
            {stats}
          </span>
          <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  )
}
