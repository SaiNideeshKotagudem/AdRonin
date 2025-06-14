import axios from 'axios';

interface MetaAdsConfig {
  accessToken: string;
  adAccountId: string;
}

export class MetaAdsIntegration {
  private config: MetaAdsConfig;

  constructor(config: MetaAdsConfig) {
    this.config = config;
  }

  async createCampaign(campaignData: any) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/act_${this.config.adAccountId}/campaigns`,
        {
          name: campaignData.name,
          objective: 'CONVERSIONS',
          status: 'ACTIVE',
          daily_budget: campaignData.budget * 100, // Convert to cents
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          access_token: this.config.accessToken,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create Meta campaign:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string, dateRange: { startDate: string; endDate: string }) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${campaignId}/insights`,
        {
          params: {
            fields: 'impressions,clicks,conversions,spend,ctr,cpc,cpm',
            time_range: JSON.stringify({
              since: dateRange.startDate,
              until: dateRange.endDate
            }),
            access_token: this.config.accessToken,
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get Meta campaign performance:', error);
      throw error;
    }
  }

  async pauseCampaign(campaignId: string) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${campaignId}`,
        {
          status: 'PAUSED',
          access_token: this.config.accessToken,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to pause Meta campaign:', error);
      throw error;
    }
  }

  async createAdSet(campaignId: string, adSetData: any) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/act_${this.config.adAccountId}/adsets`,
        {
          name: adSetData.name,
          campaign_id: campaignId,
          daily_budget: adSetData.budget * 100,
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'CONVERSIONS',
          targeting: adSetData.targeting,
          status: 'ACTIVE',
          access_token: this.config.accessToken,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create Meta ad set:', error);
      throw error;
    }
  }
}