import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useCampaignStore } from '../../stores/campaign';
import { DashboardStats } from '../../types';

export const DashboardOverview: React.FC = () => {
  const { campaigns, performance, loading, fetchCampaigns, fetchPerformance } = useCampaignStore();
  const [stats, setStats] = useState<DashboardStats>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_spend: 0,
    total_conversions: 0,
    avg_roas: 0,
  });

  useEffect(() => {
    fetchCampaigns();
    fetchPerformance();
  }, []);

  useEffect(() => {
    // Calculate stats from campaigns and performance data
    const totalSpend = performance.reduce((sum, p) => sum + p.spend, 0);
    const totalConversions = performance.reduce((sum, p) => sum + p.conversions, 0);
    const revenue = totalConversions * 50; // Assume $50 per conversion
    const roas = totalSpend > 0 ? revenue / totalSpend : 0;

    setStats({
      total_campaigns: campaigns.length,
      active_campaigns: campaigns.filter(c => c.status === 'active').length,
      total_spend: totalSpend,
      total_conversions: totalConversions,
      avg_roas: roas,
    });
  }, [campaigns, performance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Campaigns',
      value: stats.total_campaigns,
      icon: Target,
      change: '+12%',
      positive: true,
    },
    {
      title: 'Active Campaigns',
      value: stats.active_campaigns,
      icon: TrendingUp,
      change: '+8%',
      positive: true,
    },
    {
      title: 'Total Spend',
      value: `$${stats.total_spend.toLocaleString()}`,
      icon: DollarSign,
      change: '+15%',
      positive: true,
    },
    {
      title: 'Avg ROAS',
      value: `${stats.avg_roas.toFixed(2)}x`,
      icon: BarChart3,
      change: '+5%',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor your campaign performance and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                  <p className="text-sm text-gray-500">
                    Budget: ${campaign.budget.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Highlights</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {performance.slice(0, 5).map((perf, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{perf.channel}</p>
                  <p className="text-sm text-gray-500">
                    {perf.clicks} clicks • {perf.conversions} conversions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${perf.spend.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {((perf.clicks / perf.impressions) * 100).toFixed(1)}% CTR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};