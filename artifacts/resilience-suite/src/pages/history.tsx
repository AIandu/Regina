import { useListAnalyses, useApproveAnalysis, getListAnalysesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { History as HistoryIcon, Eye, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function HistoryPage() {
  const { data: analyses, isLoading } = useListAnalyses();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-mono font-bold text-foreground flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-primary" />
          AUDIT TRAIL
        </h2>
        <p className="text-muted-foreground font-sans mt-3 max-w-2xl leading-relaxed">
          Review historical infrastructure analysis runs. Pending runs require manual authorization to proceed to blueprint generation.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {Array(6).fill(0).map((_, i) => (
             <div key={i} className="h-16 bg-card/50 border border-border animate-pulse rounded-lg" />
          ))}
        </div>
      ) : analyses?.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-border rounded-lg bg-card/20">
          <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto mb-6 opacity-30" />
          <h3 className="font-mono text-lg mb-2 font-bold tracking-widest text-muted-foreground">NO RECORDS FOUND</h3>
          <p className="text-muted-foreground font-sans text-sm">Initiate an analysis from the command hub to generate telemetry data.</p>
        </div>
      ) : (
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase">ID / Timestamp</th>
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase">Type</th>
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase">Title</th>
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase">Score</th>
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-[10px] tracking-widest font-mono font-bold text-muted-foreground uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses?.map(run => (
                <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-mono text-sm text-foreground">#{run.id.toString().padStart(4, '0')}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{new Date(run.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] tracking-widest font-mono font-bold bg-secondary text-secondary-foreground uppercase">
                      {run.type}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-sm max-w-[250px] truncate text-foreground" title={run.title}>
                    {run.title}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "font-mono text-sm font-bold",
                      run.confidenceScore >= 80 ? "text-primary" : run.confidenceScore >= 60 ? "text-accent" : "text-destructive"
                    )}>
                      {run.confidenceScore}%
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <ApprovalActions id={run.id} status={run.status} />
                      <Link href={`/history/${run.id}`}>
                        <button className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors group-hover:shadow-[0_0_10px_rgba(24,191,120,0.2)]">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  if (status === 'pending') return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] tracking-widest font-mono font-bold bg-accent/10 text-accent border border-accent/20 uppercase shadow-[inset_0_0_8px_rgba(251,191,36,0.1)]">PENDING</span>
  if (status === 'approved') return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] tracking-widest font-mono font-bold bg-primary/10 text-primary border border-primary/20 uppercase shadow-[inset_0_0_8px_rgba(24,191,120,0.1)]">APPROVED</span>
  return <span className="inline-flex items-center px-2 py-1 rounded text-[10px] tracking-widest font-mono font-bold bg-destructive/10 text-destructive border border-destructive/20 uppercase shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]">REJECTED</span>
}

export function ApprovalActions({ id, status }: { id: number, status: string }) {
  const queryClient = useQueryClient();
  const approve = useApproveAnalysis();

  if (status !== 'pending') return null;

  const handleDecision = (decision: 'approved' | 'rejected') => {
    approve.mutate({ id, data: { decision } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnalysesQueryKey() });
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={approve.isPending}
        onClick={() => handleDecision('approved')}
        className="px-3 py-1 text-[10px] tracking-widest font-mono font-bold bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
      >
        {approve.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "APPV"}
      </button>
      <button 
        disabled={approve.isPending}
        onClick={() => handleDecision('rejected')}
        className="px-3 py-1 text-[10px] tracking-widest font-mono font-bold bg-destructive/10 text-destructive border border-destructive/30 rounded hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-50"
      >
        {approve.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "RJCT"}
      </button>
    </div>
  )
}
