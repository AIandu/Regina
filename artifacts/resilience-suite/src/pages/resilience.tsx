import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeResilience } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldAlert, ArrowRight, Target } from "lucide-react";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { ResultCard } from "@/components/ui/result-card";

const schema = z.object({
  country: z.string().min(1, "Required").default("Philippines"),
  environmentalConstraints: z.string().min(1, "Required").default("Typhoon path, frequent flooding, volcanic activity"),
  infrastructureInfo: z.string().min(1, "Required").default("Fragmented grid, high reliance on fossil fuels, developing coastal defenses"),
});

export default function ResiliencePage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { 
      country: "Philippines", 
      environmentalConstraints: "Typhoon path, frequent flooding, volcanic activity", 
      infrastructureInfo: "Fragmented grid, high reliance on fossil fuels, developing coastal defenses" 
    },
  });

  const analyze = useAnalyzeResilience();

  function onSubmit(data: z.infer<typeof schema>) {
    analyze.mutate({ data });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-mono font-bold tracking-tight text-foreground flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          RESILIENCE SIMULATOR
        </h2>
        <p className="text-muted-foreground mt-3 font-sans max-w-2xl leading-relaxed">
          Generate comprehensive structural blueprints to withstand extreme environmental stress and infrastructure deficits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-mono font-bold mb-6 border-b border-border/50 pb-4 text-primary flex items-center gap-2">
              <Target className="w-4 h-4" />
              THREAT VECTORS
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">TARGET NATION/ZONE</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="environmentalConstraints" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">ENVIRONMENTAL THREATS</FormLabel>
                    <FormControl><Textarea className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 min-h-[100px]" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="infrastructureInfo" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">CURRENT INFRASTRUCTURE BASELINE</FormLabel>
                    <FormControl><Textarea className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 min-h-[100px]" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <div className="pt-2">
                  <Button type="submit" className="w-full font-mono font-bold tracking-wider hover:shadow-[0_0_15px_rgba(24,191,120,0.4)] transition-all" disabled={analyze.isPending}>
                    {analyze.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                    {analyze.isPending ? "RUNNING SIMULATIONS..." : "GENERATE BLUEPRINT"}
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
                  <ShieldAlert className="w-16 h-16 animate-pulse opacity-50" />
                  <div className="absolute -inset-6 border border-primary rounded-full animate-[spin_3s_linear_infinite] opacity-30 border-t-transparent" />
                  <div className="absolute -inset-2 border border-primary rounded-full animate-[spin_2s_linear_infinite_reverse] opacity-50 border-b-transparent" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-mono text-lg font-bold tracking-widest animate-pulse text-primary">STRESS TESTING INFRASTRUCTURE</p>
                  <p className="font-mono text-xs text-primary/70">Evaluating risk scenarios and blueprint phasing...</p>
                </div>
             </div>
          )}
          
          {!analyze.isPending && !analyze.data && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/20 min-h-[600px] text-muted-foreground">
               <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
               <p className="font-mono text-sm tracking-widest">AWAITING THREAT VECTORS</p>
            </div>
          )}

          {analyze.data && !analyze.isPending && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between border-b border-border pb-4">
                 <h3 className="text-xl font-mono font-bold text-foreground">RESILIENCE BLUEPRINT</h3>
                 <div className="flex items-center gap-4">
                   <div className="text-xs font-mono text-muted-foreground tracking-widest bg-muted px-3 py-1 rounded">SYS.ID: {analyze.data.id}</div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex items-center gap-6 shadow-sm">
                   <ScoreGauge score={analyze.data.result.overallResilienceScore} className="shrink-0" />
                   <div>
                     <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-2">SURVIVABILITY RATING</div>
                     <div className="text-sm font-sans text-foreground leading-relaxed">Estimated ability to withstand targeted environmental events post-deployment.</div>
                   </div>
                 </div>
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex items-center gap-6 shadow-sm">
                   <ScoreGauge score={analyze.data.result.confidenceScore} className="shrink-0" />
                   <div>
                     <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-2">MODEL CONFIDENCE</div>
                     <div className="text-sm font-sans text-foreground leading-relaxed">System confidence in the simulated outcomes and phasing logic.</div>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <ResultCard title="STRATEGIC BLUEPRINT" content={analyze.data.result.blueprint} fullWidth />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultCard title="RISK SCENARIOS" content={analyze.data.result.riskScenarios} />
                    <ResultCard title="DEPLOYMENT PHASES" content={analyze.data.result.deploymentPhases} />
                  </div>
                  {analyze.data.result.priorityActions && (
                    <ResultCard title="IMMEDIATE PRIORITY ACTIONS" content={analyze.data.result.priorityActions} isWarning fullWidth />
                  )}
               </div>
               
               <ResultCard title="ANALYTICAL EXPLANATION" content={analyze.data.result.explanation} fullWidth />
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
