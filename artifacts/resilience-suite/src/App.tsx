import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Layout } from '@/components/layout';
import Home from '@/pages/home';
import FarmPage from '@/pages/farm';
import DatacenterPage from '@/pages/datacenter';
import ResiliencePage from '@/pages/resilience';
import HistoryPage from '@/pages/history';
import HistoryDetailPage from '@/pages/history-detail';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/farm" component={FarmPage} />
        <Route path="/datacenter" component={DatacenterPage} />
        <Route path="/resilience" component={ResiliencePage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/history/:id" component={HistoryDetailPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
