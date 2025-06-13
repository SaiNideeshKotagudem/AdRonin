export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface CampaignFormData {
  name: string;
  business_goal: string;
  target_audience: string;
  budget: number;
  channels: string[];
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  roas: number;
}

export interface DashboardStats {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_conversions: number;
  avg_roas: number;
}

export interface ExecutionLog {
  id: string;
  campaign_id: string;
  action: string;
  status: 'pending' | 'success' | 'failed';
  details: any;
  timestamp: string;
}