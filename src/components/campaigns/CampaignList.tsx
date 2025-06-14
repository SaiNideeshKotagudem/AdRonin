import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CampaignForm } from './CampaignForm';
import { CampaignEditor } from './CampaignEditor';
import { 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Edit3,
  BarChart3,
  Settings
} from 'lucide-react';
import { useCampaignStore } from '../../stores/campaign';
import { Campaign } from '../../types/database';
import { CampaignExecutor } from '../../lib/campaign-executor';
import toast from 'react-hot-toast';

export const CampaignList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [executingCampaigns, setExecutingCampaigns] = useState<Set<string>>(new Set());
  const { campaigns, loading, fetchCampaigns, updateCampaign, simulatePerformance } = useCampaignStore();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusToggle = async (campaign: Campaign) => {
    if (campaign.status === 'active') {
      // Pause campaign
      await updateCampaign(campaign.id, { status: 'paused' });
      toast.success('Campaign paused');
    } else {
      // Activate campaign - this will trigger real execution
      setExecutingCampaigns(prev => new Set(prev).add(campaign.id));
      
      try {
        // Initialize campaign executor with mock config for demo
        const executor = new CampaignExecutor({
          // In production, these would come from user's connected accounts
          googleAds: {
            clientId: 'demo',
            clientSecret: 'demo',
            refreshToken: 'demo',
            customerId: 'demo'
          },
          metaAds: {
            accessToken: 'demo',
            adAccountId: 'demo'
          }
        });

        // Execute campaign on real platforms
        const results = await executor.executeCampaign(campaign.id);
        
        // Update campaign status
        await updateCampaign(campaign.id, { status: 'active' });
        
        // Start performance data sync
        await executor.syncPerformanceData(campaign.id);
        
        toast.success(`Campaign activated on ${results.length} platforms`);
      } catch (error) {
        console.error('Campaign execution failed:', error);
        toast.error('Failed to activate campaign');
      } finally {
        setExecutingCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(campaign.id);
          return newSet;
        });
      }
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowEditor(true);
  };

  const handleSaveCampaign = async (updatedCampaign: Partial<Campaign>) => {
    if (selectedCampaign) {
      await updateCampaign(selectedCampaign.id, updatedCampaign);
      toast.success('Campaign updated successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Manage your AI-powered marketing campaigns with real platform integrations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first AI-powered marketing campaign with real platform integrations
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const isExecuting = executingCampaigns.has(campaign.id);
            
            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isExecuting ? 'Activating...' : campaign.status}
                        </span>
                        {campaign.strategy?.budget_allocation && (
                          <span className="text-xs text-gray-500">
                            AI Optimized
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Budget: ${campaign.budget.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {campaign.channels.length} channels
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Channels:</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map((channel, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Strategy Preview */}
                  {campaign.strategy && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-purple-700 mb-1">
                        <Settings className="w-4 h-4 mr-1" />
                        AI Strategy
                      </div>
                      <p className="text-xs text-purple-600 line-clamp-2">
                        {campaign.strategy.strategy || 'Multi-channel optimization with AI targeting'}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(campaign)}
                        disabled={isExecuting}
                        className="flex-1"
                      >
                        {isExecuting ? (
                          <LoadingSpinner size="sm" />
                        ) : campaign.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                        className="flex-1"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Stats
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CampaignForm 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
      />

      {selectedCampaign && (
        <CampaignEditor
          campaign={selectedCampaign}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setSelectedCampaign(null);
          }}
          onSave={handleSaveCampaign}
        />
      )}
    </div>
  );
};