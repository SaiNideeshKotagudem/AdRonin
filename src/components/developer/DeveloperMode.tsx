import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Code, 
  Activity, 
  Database, 
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ExecutionLog } from '../../types';

export const DeveloperMode: React.FC = () => {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    database: 'connected',
    openai: 'connected',
    supabase: 'connected',
  });

  useEffect(() => {
    // Simulate execution logs
    const mockLogs: ExecutionLog[] = [
      {
        id: '1',
        campaign_id: 'camp-1',
        action: 'Campaign Created',
        status: 'success',
        details: { message: 'Successfully created campaign with AI strategy' },
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        campaign_id: 'camp-1',
        action: 'Content Generation',
        status: 'success',
        details: { generated_items: 3, platform: 'Google Ads' },
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '3',
        campaign_id: 'camp-2',
        action: 'Performance Simulation',
        status: 'pending',
        details: { channels: ['Google Ads', 'Meta Ads'] },
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ];
    setLogs(mockLogs);

    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Test Supabase connection
      const { error } = await supabase.from('campaigns').select('count', { count: 'exact' });
      setSystemStatus(prev => ({
        ...prev,
        supabase: error ? 'error' : 'connected'
      }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, supabase: 'error' }));
    }
  };

  const runDiagnostics = () => {
    checkSystemStatus();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Developer Mode</h1>
        <p className="text-gray-600 mt-1">
          Monitor system status, execution logs, and debug information
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Database
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.supabase)}`}>
              {systemStatus.supabase}
            </span>
            {getStatusIcon(systemStatus.supabase)}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              OpenAI API
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.openai)}`}>
              {systemStatus.openai}
            </span>
            {getStatusIcon(systemStatus.openai)}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
              healthy
            </span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2 text-gray-600" />
              Execution Logs
            </CardTitle>
            <Button variant="outline" size="sm" onClick={runDiagnostics}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(log.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{log.action}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  Campaign: {log.campaign_id}
                </p>
                
                <div className="mt-2 p-2 bg-white rounded border text-xs text-gray-700 font-mono">
                  {JSON.stringify(log.details, null, 2)}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supabase URL
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg border text-sm font-mono">
                {import.meta.env.VITE_SUPABASE_URL ? '***configured***' : 'Not configured'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg border text-sm font-mono">
                {import.meta.env.VITE_OPENAI_API_KEY ? '***configured***' : 'Not configured'}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Environment Variables</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Make sure to configure your environment variables in the .env.local file for full functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};