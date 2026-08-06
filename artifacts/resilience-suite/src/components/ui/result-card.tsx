import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export function ResultCard({ 
  title, 
  content, 
  isWarning, 
  fullWidth 
}: { 
  title: string, 
  content: React.ReactNode, 
  isWarning?: boolean, 
  fullWidth?: boolean 
}) {
  return (
    <div className={cn(
      "bg-card/50 border rounded-lg p-5 backdrop-blur-sm shadow-sm transition-all duration-300", 
      isWarning ? "border-accent/50 bg-accent/5 shadow-[inset_0_0_20px_rgba(251,191,36,0.05)]" : "border-border hover:border-primary/30", 
      fullWidth && "md:col-span-2"
    )}>
      <h4 className={cn("text-xs font-mono font-bold mb-3 flex items-center gap-2 tracking-wider", isWarning ? "text-accent" : "text-muted-foreground")}>
        {isWarning && <ShieldAlert className="w-4 h-4" />}
        {title}
      </h4>
      <div className="text-sm font-sans leading-relaxed text-foreground whitespace-pre-wrap opacity-90">
        {content}
      </div>
    </div>
  )
}
