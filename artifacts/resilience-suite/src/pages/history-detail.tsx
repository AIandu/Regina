import { useGetAnalysis, getGetAnalysisQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Loader2, ArrowLeft, Terminal } from "lucide-react";
import { StatusBadge, ApprovalActions } from "./history";
import { ResultCard } from "@/components/ui/result-card";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const analysisId = id ? parseInt(id, 10) : 0;
  
  const { data: analysis, isLoading } = useGetAnalysis(analysisId, {
    query: { enabled: !!analysisId, queryKey: getGetAnalysisQueryKey(analysisId) }
  });

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-mono font-bold text-muted-foreground">RECORD NOT FOUND</h2>
        <Link href="/history">
          <button className="mt-4 text-primary hover:underline font-mono text-sm tracking-widest">RETURN TO AUDIT TRAIL</button>
        </Link>
      </div>
    );
  }

  // Type cast for rendering loosely since the exact type depends on 'analysis.type'
  const inputs = analysis.inputs as Record<string, string>;
  const result = analysis.result as Record<string, any>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/history">
          <button className="p-2 bg-card border border-border rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-mono font-bold text-foreground">RECORD #{analysis.id.toString().padStart(4, '0')}</h2>
            <StatusBadge status={analysis.status} />
          </div>
          <p className="text-sm font-sans text-muted-foreground">{analysis.title} • {new Date(analysis.createdAt).toLocaleString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
           <ApprovalActions id={analysis.id} status={analysis.status} />
           {analysis.approvalNotes && (
             <div className="text-xs font-mono bg-muted p-2 rounded text-muted-foreground border border-border">
               <span className="font-bold">NOTES:</span> {analysis.approvalNotes}
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <h3 className="text-sm font-mono font-bold mb-4 border-b border-border/50 pb-2 text-primary flex items-center gap-2 tracking-widest">
              <Terminal className="w-4 h-4" />
              INPUT PARAMETERS
            </h3>
            <div className="space-y-4">
              {Object.entries(inputs).map(([key, value]) => (
                <div key={key}>
                  <div className="text-[10px] tracking-widest font-mono text-muted-foreground uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-sm font-sans text-foreground bg-background/50 border border-border/50 p-2 rounded">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
             <h3 className="text-sm font-mono font-bold mb-4 border-b border-border/50 pb-2 text-primary flex items-center gap-2 tracking-widest">
              <Terminal className="w-4 h-4" />
              RAW OUTPUT TELEMETRY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result).map(([key, value]) => {
                if (key === 'confidenceScore' || key === 'locationScore' || key === 'overallResilienceScore' || key === 'pueEstimate') {
                  return (
                    <div key={key} className="bg-background/50 border border-border/50 p-4 rounded-lg">
                      <div className="text-[10px] tracking-widest font-mono text-muted-foreground uppercase mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-3xl font-mono font-bold text-primary">{typeof value === 'number' ? value.toFixed(2) : value}{key.includes('Score') ? '%' : ''}</div>
                    </div>
                  )
                }
                return null;
              })}
            </div>
            
            <div className="mt-6 space-y-4">
              {Object.entries(result).map(([key, value]) => {
                 if (key === 'confidenceScore' || key === 'locationScore' || key === 'overallResilienceScore' || key === 'pueEstimate') return null;
                 if (!value) return null;
                 const isWarning = key.toLowerCase().includes('risk') || key.toLowerCase().includes('priority');
                 return (
                   <ResultCard 
                     key={key} 
                     title={key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} 
                     content={value as string} 
                     isWarning={isWarning}
                     fullWidth
                   />
                 )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
