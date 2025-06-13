import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  MessageCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useCampaignStore } from '../../stores/campaign';
import { generateInsights } from '../../lib/openai';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export const Analytics: React.FC = () => {
  const { campaigns, performance, loading, fetchCampaigns, fetchPerformance } = useCampaignStore();
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchCampaigns();
    fetchPerformance();
  }, []);

  useEffect(() => {
    if (performance.length > 0) {
      generatePerformanceInsights();
    }
  }, [performance]);

  const generatePerformanceInsights = async () => {
    setLoadingInsights(true);
    try {
      const performanceData = {
        total_campaigns: campaigns.length,
        total_impressions: performance.reduce((sum, p) => sum + p.impressions, 0),
        total_clicks: performance.reduce((sum, p) => sum + p.clicks, 0),
        total_conversions: performance.reduce((sum, p) => sum + p.conversions, 0),
        total_spend: performance.reduce((sum, p) => sum + p.spend, 0),
        channels: performance.reduce((acc, p) => {
          acc[p.channel] = (acc[p.channel] || 0) + p.spend;
          return acc;
        }, {} as Record<string, number>),
      };

      const generatedInsights = await generateInsights(performanceData);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. Please check your performance data and try again.');
    }
    setLoadingInsights(false);
  };

  // Prepare chart data
  const channelPerformance = performance.reduce((acc, p) => {
    const existing = acc.find(item => item.channel === p.channel);
    if (existing) {
      existing.spend += p.spend;
      existing.conversions += p.conversions;
      existing.clicks += p.clicks;
    } else {
      acc.push({
        channel: p.channel,
        spend: p.spend,
        conversions: p.conversions,
        clicks: p.clicks,
        ctr: (p.clicks / p.impressions) * 100,
      });
    }
    return acc;
  }, [] as any[]);

  const dailyPerformance = performance.reduce((acc, p) => {
    const existing = acc.find(item => item.date === p.date);
    if (existing) {
      existing.spend += p.spend;
      existing.conversions += p.conversions;
    } else {
      acc.push({
        date: new Date(p.date).toLocaleDateString(),
        spend: p.spend,
        conversions: p.conversions,
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pieData = channelPerformance.map((item, index) => ({
    name: item.channel,
    value: item.spend,
    color: COLORS[index % COLORS.length],
  }));

  const exportReport = () => {
    toast.success('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Analyze your campaign performance and get AI insights
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {performance.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No performance data yet
          </h3>
          <p className="text-gray-600">
            Activate your campaigns to start collecting performance data
          </p>
        </Card>
      ) : (
        <>
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="spend" fill="#3B82F6" name="Spend ($)" />
                    <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Trend</CardTitle>
              </CardHeader>
              <div className="h-80">
                <ResponsiveContainer>
                  <LineChart data={dailyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Spend ($)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Conversions" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spend Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Spend Distribution</CardTitle>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Spend']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Insights */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                    AI Performance Insights
                  </CardTitle>
                </CardHeader>
                
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner text="Generating insights..." />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{insights}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={generatePerformanceInsights}
                      size="sm"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Refresh Insights
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};