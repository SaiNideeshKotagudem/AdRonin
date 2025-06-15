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
  Filter,
  AlertCircle
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
import { generateInsights } from '../../lib/gemini';
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
        active_campaigns: campaigns.filter(c => c.status === 'active').length,
        total_impressions: performance.reduce((sum, p) => sum + p.impressions, 0),
        total_clicks: performance.reduce((sum, p) => sum + p.clicks, 0),
        total_conversions: performance.reduce((sum, p) => sum + p.conversions, 0),
        total_spend: performance.reduce((sum, p) => sum + p.spend, 0),
        channels: performance.reduce((acc, p) => {
          acc[p.channel] = (acc[p.channel] || 0) + p.spend;
          return acc;
        }, {} as Record<string, number>),
        avg_ctr: performance.length > 0 ? 
          performance.reduce((sum, p) => sum + (p.clicks / p.impressions), 0) / performance.length * 100 : 0,
        avg_conversion_rate: performance.length > 0 ?
          performance.reduce((sum, p) => sum + (p.conversions / p.clicks), 0) / performance.length * 100 : 0
      };

      const generatedInsights = await generateInsights(performanceData);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. This could be due to insufficient data or API limitations.');
    }
    setLoadingInsights(false);
  };

  // Calculate real statistics from actual data
  const realStats = {
    totalSpend: performance.reduce((sum, p) => sum + p.spend, 0),
    totalConversions: performance.reduce((sum, p) => sum + p.conversions, 0),
    totalClicks: performance.reduce((sum, p) => sum + p.clicks, 0),
    totalImpressions: performance.reduce((sum, p) => sum + p.impressions, 0),
    avgCTR: performance.length > 0 ? 
      performance.reduce((sum, p) => sum + (p.clicks / p.impressions), 0) / performance.length * 100 : 0,
    avgConversionRate: performance.length > 0 ?
      performance.reduce((sum, p) => sum + (p.conversions / p.clicks), 0) / performance.length * 100 : 0
  };

  // Prepare chart data from real performance data
  const channelPerformance = performance.reduce((acc, p) => {
    const existing = acc.find(item => item.channel === p.channel);
    if (existing) {
      existing.spend += p.spend;
      existing.conversions += p.conversions;
      existing.clicks += p.clicks;
      existing.impressions += p.impressions;
    } else {
      acc.push({
        channel: p.channel,
        spend: p.spend,
        conversions: p.conversions,
        clicks: p.clicks,
        impressions: p.impressions,
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
      existing.clicks += p.clicks;
      existing.impressions += p.impressions;
    } else {
      acc.push({
        date: new Date(p.date).toLocaleDateString(),
        spend: p.spend,
        conversions: p.conversions,
        clicks: p.clicks,
        impressions: p.impressions,
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
    const reportData = {
      summary: realStats,
      channelPerformance,
      dailyPerformance,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
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
            Real campaign performance data and AI insights powered by Google Gemini
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

      {/* Real Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900">${realStats.totalSpend.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Actual spend from campaigns</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{realStats.totalConversions}</p>
              <p className="text-sm text-gray-500">Real conversions tracked</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average CTR</p>
              <p className="text-2xl font-bold text-gray-900">{realStats.avgCTR.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Click-through rate</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{realStats.avgConversionRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Average conversion rate</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {performance.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No performance data yet
          </h3>
          <p className="text-gray-600">
            Activate your campaigns to start collecting real performance data
          </p>
        </Card>
      ) : (
        <>
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance (Real Data)</CardTitle>
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
                <CardTitle>Daily Performance Trend</CardTitle>
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
                    AI Performance Insights (Powered by Gemini)
                  </CardTitle>
                </CardHeader>
                
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner text="Generating insights with Gemini AI..." />
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