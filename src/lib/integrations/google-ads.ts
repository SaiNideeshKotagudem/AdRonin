import axios from 'axios';

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
}

export class GoogleAdsIntegration {
  private config: GoogleAdsConfig;
  private accessToken: string | null = null;

  constructor(config: GoogleAdsConfig) {
    this.config = config;
  }

  async authenticate() {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token',
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Google Ads authentication failed:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: any) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.post(
        `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/campaigns:mutate`,
        {
          operations: [{
            create: {
              name: campaignData.name,
              status: 'ENABLED',
              advertisingChannelType: 'SEARCH',
              biddingStrategyType: 'TARGET_CPA',
              campaignBudget: {
                amountMicros: campaignData.budget * 1000000,
                deliveryMethod: 'STANDARD'
              }
            }
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create Google Ads campaign:', error);
      throw error;
    }
  }

  async getCampaignPerformance(campaignId: string, dateRange: { startDate: string; endDate: string }) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.cost_micros
        FROM campaign 
        WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
      `;

      const response = await axios.post(
        `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/googleAds:searchStream`,
        { query },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get Google Ads performance:', error);
      throw error;
    }
  }

  async pauseCampaign(campaignId: string) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.post(
        `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/campaigns:mutate`,
        {
          operations: [{
            update: {
              resourceName: `customers/${this.config.customerId}/campaigns/${campaignId}`,
              status: 'PAUSED'
            },
            updateMask: 'status'
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to pause Google Ads campaign:', error);
      throw error;
    }
  }
}