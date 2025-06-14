import axios from 'axios';

interface LinkedInAdsConfig {
  accessToken: string;
  adAccountId: string;
}

export class LinkedInAdsIntegration {
  private config: LinkedInAdsConfig;

  constructor(config: LinkedInAdsConfig) {
    this.config = config;
  }

  async createCampaign(campaignData: any) {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/adCampaignsV2',
        {
          account: `urn:li:sponsoredAccount:${this.config.adAccountId}`,
          name: campaignData.name,
          type: 'SPONSORED_CONTENT',
          status: 'ACTIVE',
          costType: 'CPC',
          dailyBudget: {
            amount: campaignData.budget.toString(),
            currencyCode: 'USD'
          },
          unitCost: {
            amount: '2.00',
            currencyCode: 'USD'
          },
          objectiveType: 'WEBSITE_CONVERSIONS'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create LinkedIn campaign:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string, dateRange: { startDate: string; endDate: string }) {
    try {
      const response = await axios.get(
        'https://api.linkedin.com/v2/adAnalyticsV2',
        {
          params: {
            q: 'analytics',
            pivot: 'CAMPAIGN',
            campaigns: `List(urn:li:sponsoredCampaign:${campaignId})`,
            dateRange: `(start:(year:${dateRange.startDate.split('-')[0]},month:${parseInt(dateRange.startDate.split('-')[1])},day:${parseInt(dateRange.startDate.split('-')[2])}),end:(year:${dateRange.endDate.split('-')[0]},month:${parseInt(dateRange.endDate.split('-')[1])},day:${parseInt(dateRange.endDate.split('-')[2])}))`,
            fields: 'impressions,clicks,conversions,costInUsd,clickThroughRate'
          },
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get LinkedIn campaign performance:', error);
      throw error;
    }
  }

  async pauseCampaign(campaignId: string) {
    try {
      const response = await axios.post(
        `https://api.linkedin.com/v2/adCampaignsV2/${campaignId}`,
        {
          status: 'PAUSED'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to pause LinkedIn campaign:', error);
      throw error;
    }
  }
}