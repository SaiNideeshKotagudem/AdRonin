import { create } from 'zustand';
import { Campaign, CampaignPerformance } from '../types/database';
import { supabase } from '../lib/supabase';

interface CampaignState {
  campaigns: Campaign[];
  performance: CampaignPerformance[];
  loading: boolean;
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: any) => Promise<Campaign | null>;
  updateCampaign: (id: string, updates: any) => Promise<void>;
  fetchPerformance: (campaignId?: string) => Promise<void>;
  simulatePerformance: (campaignId: string) => Promise<void>;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  performance: [],
  loading: false,

  fetchCampaigns: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ campaigns: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      set({ loading: false });
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ ...campaignData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const { campaigns } = get();
      set({ campaigns: [data, ...campaigns] });
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  },

  updateCampaign: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const { campaigns } = get();
      set({
        campaigns: campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  },

  fetchPerformance: async (campaignId) => {
    try {
      let query = supabase.from('campaign_performance').select('*');
      
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      set({ performance: data || [] });
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  },

  simulatePerformance: async (campaignId) => {
    try {
      // Generate simulated performance data
      const channels = ['Google Ads', 'Meta Ads', 'LinkedIn', 'Email'];
      const today = new Date().toISOString().split('T')[0];
      
      const performanceData = channels.map(channel => ({
        campaign_id: campaignId,
        date: today,
        channel,
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 500) + 50,
        conversions: Math.floor(Math.random() * 50) + 5,
        spend: Math.floor(Math.random() * 500) + 100,
      }));

      const { error } = await supabase
        .from('campaign_performance')
        .insert(performanceData);

      if (error) throw error;
      await get().fetchPerformance(campaignId);
    } catch (error) {
      console.error('Error simulating performance:', error);
    }
  },
}));