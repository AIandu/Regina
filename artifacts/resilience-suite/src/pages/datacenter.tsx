import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeDatacenter } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Cpu, ArrowRight, Target } from "lucide-react";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { ResultCard } from "@/components/ui/result-card";

const schema = z.object({
  powerAvailability: z.string().min(1, "Required").default("400MW Hydro/Solar Mix"),
  climate: z.string().min(1, "Required").default("Sub-arctic, low humidity"),
  communityNeeds: z.string().min(1, "Required").default("District heating for 12,000 homes"),
  industrialDemand: z.string().min(1, "Required").default("High compute research park nearby"),
});

export default function DatacenterPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { 
      powerAvailability: "400MW Hydro/Solar Mix", 
      climate: "Sub-arctic, low humidity", 
      communityNeeds: "District heating for 12,000 homes", 
      industrialDemand: "High compute research park nearby" 
    },
  });

  const analyze = useAnalyzeDatacenter();

  function onSubmit(data: z.infer<typeof schema>) {
    analyze.mutate({ data });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-mono font-bold tracking-tight text-foreground flex items-center gap-3">
          <Cpu className="w-8 h-8 text-primary" />
          DATA CENTER HUB
        </h2>
        <p className="text-muted-foreground mt-3 font-sans max-w-2xl leading-relaxed">
          Simulate optimal datacenter placement, thermal reuse pipelines, and cooling architecture based on grid conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-mono font-bold mb-6 border-b border-border/50 pb-4 text-primary flex items-center gap-2">
              <Target className="w-4 h-4" />
              GRID PARAMETERS
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="powerAvailability" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">POWER AVAILABILITY</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="climate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">LOCAL CLIMATE</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="communityNeeds" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">COMMUNITY NEEDS</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="industrialDemand" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">INDUSTRIAL DEMAND</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <div className="pt-2">
                  <Button type="submit" className="w-full font-mono font-bold tracking-wider hover:shadow-[0_0_15px_rgba(24,191,120,0.4)] transition-all" disabled={analyze.isPending}>
                    {analyze.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                    {analyze.isPending ? "SIMULATING GRID..." : "INITIALIZE ANALYSIS"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="lg:col-span-8 min-h-[600px]">
          {analyze.isPending && (
             <div className="h-full flex flex-col items-center justify-center space-y-6 text-primary border border-dashed border-primary/20 rounded-lg bg-primary/5 min-h-[600px] shadow-[inset_0_0_50px_rgba(24,191,120,0.05)]">
                <div className="relative">
                  <Cpu className="w-16 h-16 animate-pulse opacity-50" />
                  <div className="absolute -inset-4 border-2 border-primary rounded-full animate-ping opacity-20" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-mono text-lg font-bold tracking-widest animate-pulse">OPTIMIZING TOPOLOGY</p>
                  <p className="font-mono text-xs text-primary/70">Calculating thermal vectors and PUE...</p>
                </div>
             </div>
          )}
          
          {!analyze.isPending && !analyze.data && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/20 min-h-[600px] text-muted-foreground">
               <Cpu className="w-16 h-16 mb-4 opacity-20" />
               <p className="font-mono text-sm tracking-widest">AWAITING GRID PARAMETERS</p>
            </div>
          )}

          {analyze.data && !analyze.isPending && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between border-b border-border pb-4">
                 <h3 className="text-xl font-mono font-bold text-foreground">SIMULATION RESULTS</h3>
                 <div className="flex items-center gap-4">
                   <div className="text-xs font-mono text-muted-foreground tracking-widest bg-muted px-3 py-1 rounded">SYS.ID: {analyze.data.id}</div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex items-center gap-6 shadow-sm">
                   <ScoreGauge score={analyze.data.result.confidenceScore} className="shrink-0" />
                   <div>
                     <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-2">CONFIDENCE SCORE</div>
                     <div className="text-sm font-sans text-foreground leading-relaxed">Model confidence based on thermal efficiency constraints and power history.</div>
                   </div>
                 </div>
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex flex-col justify-center shadow-sm">
                   <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-4">ESTIMATED PUE</div>
                   <div className="text-5xl font-mono font-bold text-primary">
                     {analyze.data.result.pueEstimate.toFixed(2)}
                   </div>
                   <div className="text-xs font-sans text-muted-foreground mt-2">Power Usage Effectiveness (Lower is better)</div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard title="LOCATION STRATEGY" content={analyze.data.result.locationRecommendation} />
                  <ResultCard title="COOLING ARCHITECTURE" content={analyze.data.result.coolingArchitecture} />
                  <ResultCard title="HEAT RECOVERY" content={analyze.data.result.heatRecoveryDesign} fullWidth />
                  <ResultCard title="THERMAL REUSE" content={analyze.data.result.thermalReuseOptions} />
                  <ResultCard title="ENERGY IMPACT" content={analyze.data.result.energyImpactReport} />
                  {analyze.data.result.riskFactors && (
                    <ResultCard title="RISK FACTORS" content={analyze.data.result.riskFactors} isWarning fullWidth />
                  )}
               </div>
               
               <ResultCard title="AI REASONING" content={analyze.data.result.reasoning} fullWidth />
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
