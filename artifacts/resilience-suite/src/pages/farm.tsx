import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeFarm } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sprout, ArrowRight, Target } from "lucide-react";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { ResultCard } from "@/components/ui/result-card";

const schema = z.object({
  country: z.string().min(1, "Required").default("Kenya"),
  region: z.string().min(1, "Required").default("Rift Valley"),
  climate: z.string().min(1, "Required").default("Semi-arid"),
  soil: z.string().min(1, "Required").default("Volcanic, well-drained"),
  water: z.string().min(1, "Required").default("Seasonal rivers, 600mm annual rain"),
  population: z.string().min(1, "Required").default("1.5M, medium density"),
});

type FormValues = z.infer<typeof schema>;

export default function FarmPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "Kenya",
      region: "Rift Valley",
      climate: "Semi-arid",
      soil: "Volcanic, well-drained",
      water: "Seasonal rivers, 600mm annual rain",
      population: "1.5M, medium density",
    },
  });

  const analyze = useAnalyzeFarm();

  function onSubmit(data: FormValues) {
    analyze.mutate({ data });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-mono font-bold tracking-tight text-foreground flex items-center gap-3">
          <Sprout className="w-8 h-8 text-primary" />
          FARM INTELLIGENCE
        </h2>
        <p className="text-muted-foreground mt-3 font-sans max-w-2xl leading-relaxed">
          Initialize geographic and environmental parameters to calculate agricultural viability, water systems, and risk factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-mono font-bold mb-6 border-b border-border/50 pb-4 text-primary flex items-center gap-2">
              <Target className="w-4 h-4" />
              INPUT PARAMETERS
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">TARGET COUNTRY</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="region" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">REGION</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="climate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">CLIMATE TYPE</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="soil" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">SOIL COMPOSITION</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="water" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">WATER AVAILABILITY</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="population" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] tracking-widest text-muted-foreground">POPULATION DENSITY</FormLabel>
                    <FormControl><Input className="font-mono bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} /></FormControl>
                    <FormMessage className="text-xs font-mono" />
                  </FormItem>
                )} />
                <div className="pt-2">
                  <Button type="submit" className="w-full font-mono font-bold tracking-wider hover:shadow-[0_0_15px_rgba(24,191,120,0.4)] transition-all" disabled={analyze.isPending}>
                    {analyze.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                    {analyze.isPending ? "COMPUTING TACTICAL DATA..." : "INITIALIZE ANALYSIS"}
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
                  <Loader2 className="w-16 h-16 animate-spin opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="font-mono text-lg font-bold tracking-widest animate-pulse">PROCESSING TELEMETRY</p>
                  <p className="font-mono text-xs text-primary/70">Connecting to orbital climate models...</p>
                </div>
             </div>
          )}
          
          {!analyze.isPending && !analyze.data && (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/20 min-h-[600px] text-muted-foreground">
               <Sprout className="w-16 h-16 mb-4 opacity-20" />
               <p className="font-mono text-sm tracking-widest">AWAITING INPUT PARAMETERS</p>
            </div>
          )}

          {analyze.data && !analyze.isPending && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="flex items-center justify-between border-b border-border pb-4">
                 <h3 className="text-xl font-mono font-bold text-foreground">ANALYSIS RESULTS</h3>
                 <div className="flex items-center gap-4">
                   <div className="text-xs font-mono text-muted-foreground tracking-widest bg-muted px-3 py-1 rounded">SYS.ID: {analyze.data.id}</div>
                   <div className="text-xs font-mono font-bold text-primary flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                     LIVE
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex items-center gap-6 shadow-sm">
                   <ScoreGauge score={analyze.data.result.confidenceScore} className="shrink-0" />
                   <div>
                     <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-2">CONFIDENCE SCORE</div>
                     <div className="text-sm font-sans text-foreground leading-relaxed">Probability of successful yield based on matched climate datasets and historical markers.</div>
                   </div>
                 </div>
                 <div className="bg-card/50 border border-border p-6 rounded-lg flex items-center gap-6 shadow-sm">
                   <ScoreGauge score={analyze.data.result.locationScore} className="shrink-0" />
                   <div>
                     <div className="text-[10px] tracking-widest font-mono text-muted-foreground mb-2">LOCATION SCORE</div>
                     <div className="text-sm font-sans text-foreground leading-relaxed">Suitability of {analyze.data.inputs.region} topology for sustained infrastructure.</div>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard title="RECOMMENDED LOCATION" content={analyze.data.result.recommendedLocation} />
                  <ResultCard title="CROP STRATEGY" content={analyze.data.result.cropStrategy} />
                  <ResultCard title="WATER DESIGN" content={analyze.data.result.waterDesign} />
                  <ResultCard title="PRODUCTION ESTIMATE" content={analyze.data.result.foodProductionEstimate} />
                  <ResultCard title="ENERGY REQUIREMENTS" content={analyze.data.result.energyRequirements} fullWidth />
                  {analyze.data.result.riskFactors && (
                    <ResultCard title="RISK FACTORS" content={analyze.data.result.riskFactors} isWarning fullWidth />
                  )}
               </div>
               
               <ResultCard title="AI REASONING & LOGIC PATH" content={analyze.data.result.reasoning} fullWidth />
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
