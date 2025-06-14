import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/auth';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CampaignList } from './components/campaigns/CampaignList';
import { ContentStudio } from './components/content/ContentStudio';
import { Analytics } from './components/analytics/Analytics';
import { BillingDashboard } from './components/billing/BillingDashboard';
import { DeveloperMode } from './components/developer/DeveloperMode';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading AutoMarkAI..." />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'campaigns':
        return <CampaignList />;
      case 'content':
        return <ContentStudio />;
      case 'analytics':
        return <Analytics />;
      case 'billing':
        return <BillingDashboard />;
      case 'developer':
        return <DeveloperMode />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;