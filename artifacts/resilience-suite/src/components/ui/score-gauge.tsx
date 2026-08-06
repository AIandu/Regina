import { cn } from "@/lib/utils";

export function ScoreGauge({ score, className }: { score: number, className?: string }) {
  const isHigh = score >= 80;
  const isMedium = score >= 60 && score < 80;

  const colorClass = isHigh ? "text-primary" : isMedium ? "text-accent" : "text-destructive";
  const bgClass = isHigh ? "bg-primary" : isMedium ? "bg-accent" : "bg-destructive";

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted shadow-inner">
        <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center z-10 border border-border shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          <span className={cn("text-2xl font-mono font-bold", colorClass)}>{score}%</span>
        </div>
        <svg className="w-full h-full transform -rotate-90 absolute z-20 drop-shadow-[0_0_8px_currentColor]" viewBox="0 0 100 100" style={{ color: "transparent" }}>
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="var(--color-muted)" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="46" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="6" 
            strokeDasharray={`${score * 2.89} 289`}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", colorClass)} 
          />
        </svg>
      </div>
    </div>
  );
}
