import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import MemberDetail from '@/pages/MemberDetail';
import Subscriptions from '@/pages/Subscriptions';
import Orders from '@/pages/Orders';
import Events from '@/pages/Events';
import Settings from '@/pages/Settings';
import Approvals from '@/pages/Approvals';
import Registrations from '@/pages/Registrations';
import Network from '@/pages/Network';
import Analytics from '@/pages/Analytics';
import Marketing from '@/pages/Marketing';
import Garage from '@/pages/Garage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="members/:id" element={<MemberDetail />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="orders" element={<Orders />} />
            <Route path="events" element={<Events />} />
            <Route path="registrations" element={<Registrations />} />
            <Route path="network" element={<Network />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="garage" element={<Garage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
