export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          business_goal: string;
          target_audience: string;
          budget: number;
          status: 'draft' | 'active' | 'paused' | 'completed';
          channels: string[];
          strategy: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          business_goal: string;
          target_audience: string;
          budget: number;
          status?: 'draft' | 'active' | 'paused' | 'completed';
          channels: string[];
          strategy?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          business_goal?: string;
          target_audience?: string;
          budget?: number;
          status?: 'draft' | 'active' | 'paused' | 'completed';
          channels?: string[];
          strategy?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_performance: {
        Row: {
          id: string;
          campaign_id: string;
          date: string;
          impressions: number;
          clicks: number;
          conversions: number;
          spend: number;
          channel: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          date: string;
          impressions: number;
          clicks: number;
          conversions: number;
          spend: number;
          channel: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          date?: string;
          impressions?: number;
          clicks?: number;
          conversions?: number;
          spend?: number;
          channel?: string;
          created_at?: string;
        };
      };
      generated_content: {
        Row: {
          id: string;
          campaign_id: string;
          content_type: 'ad_copy' | 'email' | 'social' | 'image';
          content: string;
          platform: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          content_type: 'ad_copy' | 'email' | 'social' | 'image';
          content: string;
          platform: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          content_type?: 'ad_copy' | 'email' | 'social' | 'image';
          content?: string;
          platform?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignPerformance = Database['public']['Tables']['campaign_performance']['Row'];
export type GeneratedContent = Database['public']['Tables']['generated_content']['Row'];