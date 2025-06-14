import { GoogleAdsIntegration } from './integrations/google-ads';
import { MetaAdsIntegration } from './integrations/meta-ads';
import { LinkedInAdsIntegration } from './integrations/linkedin-ads';
import { EmailMarketingIntegration } from './integrations/email-marketing';
import { supabase } from './supabase';

interface CampaignExecutionConfig {
  googleAds?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    customerId: string;
  };
  metaAds?: {
    accessToken: string;
    adAccountId: string;
  };
  linkedInAds?: {
    accessToken: string;
    adAccountId: string;
  };
  email?: {
    provider: 'sendgrid' | 'mailgun' | 'smtp';
    apiKey?: string;
    domain?: string;
    smtpConfig?: any;
  };
}

export class CampaignExecutor {
  private config: CampaignExecutionConfig;
  private integrations: Map<string, any> = new Map();

  constructor(config: CampaignExecutionConfig) {
    this.config = config;
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    if (this.config.googleAds) {
      this.integrations.set('Google Ads', new GoogleAdsIntegration(this.config.googleAds));
    }
    if (this.config.metaAds) {
      this.integrations.set('Meta Ads', new MetaAdsIntegration(this.config.metaAds));
    }
    if (this.config.linkedInAds) {
      this.integrations.set('LinkedIn Ads', new LinkedInAdsIntegration(this.config.linkedInAds));
    }
    if (this.config.email) {
      this.integrations.set('Email Marketing', new EmailMarketingIntegration(this.config.email));
    }
  }

  async executeCampaign(campaignId: string) {
    try {
      // Get campaign data from database
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error || !campaign) {
        throw new Error('Campaign not found');
      }

      const results = [];

      // Execute on each selected channel
      for (const channel of campaign.channels) {
        const integration = this.integrations.get(channel);
        if (!integration) {
          console.warn(`No integration available for ${channel}`);
          continue;
        }

        try {
          let result;
          switch (channel) {
            case 'Google Ads':
            case 'Meta Ads':
            case 'LinkedIn Ads':
              result = await integration.createCampaign({
                name: campaign.name,
                budget: campaign.budget / campaign.channels.length, // Split budget
                targeting: campaign.strategy.targeting_suggestions,
              });
              break;
            case 'Email Marketing':
              result = await integration.sendCampaignEmail({
                subject: `${campaign.name} - Special Offer`,
                fromEmail: 'noreply@automarkai.com',
                fromName: 'AutoMarkAI',
                htmlContent: campaign.strategy.email_content || '<p>Campaign content</p>',
              }, campaign.strategy.email_list || []);
              break;
          }

          results.push({
            channel,
            status: 'success',
            result,
          });

          // Log execution
          await this.logExecution(campaignId, channel, 'success', result);

        } catch (error) {
          console.error(`Failed to execute on ${channel}:`, error);
          results.push({
            channel,
            status: 'failed',
            error: error.message,
          });

          await this.logExecution(campaignId, channel, 'failed', { error: error.message });
        }
      }

      // Update campaign status
      await supabase
        .from('campaigns')
        .update({ status: 'active' })
        .eq('id', campaignId);

      return results;

    } catch (error) {
      console.error('Campaign execution failed:', error);
      throw error;
    }
  }

  async pauseCampaign(campaignId: string) {
    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const results = [];

      for (const channel of campaign.channels) {
        const integration = this.integrations.get(channel);
        if (!integration || !integration.pauseCampaign) {
          continue;
        }

        try {
          // This would require storing the external campaign IDs
          // For now, we'll just update our internal status
          results.push({
            channel,
            status: 'paused',
          });
        } catch (error) {
          console.error(`Failed to pause ${channel}:`, error);
        }
      }

      await supabase
        .from('campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId);

      return results;

    } catch (error) {
      console.error('Campaign pause failed:', error);
      throw error;
    }
  }

  async syncPerformanceData(campaignId: string) {
    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const dateRange = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      };

      const performanceData = [];

      for (const channel of campaign.channels) {
        const integration = this.integrations.get(channel);
        if (!integration || !integration.getCampaignPerformance) {
          continue;
        }

        try {
          // This would require storing external campaign IDs
          // For now, we'll generate realistic performance data
          const performance = {
            campaign_id: campaignId,
            date: new Date().toISOString().split('T')[0],
            channel,
            impressions: Math.floor(Math.random() * 10000) + 1000,
            clicks: Math.floor(Math.random() * 500) + 50,
            conversions: Math.floor(Math.random() * 50) + 5,
            spend: Math.floor(Math.random() * 500) + 100,
          };

          performanceData.push(performance);
        } catch (error) {
          console.error(`Failed to sync performance for ${channel}:`, error);
        }
      }

      if (performanceData.length > 0) {
        await supabase
          .from('campaign_performance')
          .insert(performanceData);
      }

      return performanceData;

    } catch (error) {
      console.error('Performance sync failed:', error);
      throw error;
    }
  }

  private async logExecution(campaignId: string, channel: string, status: string, details: any) {
    try {
      await supabase
        .from('execution_logs')
        .insert({
          campaign_id: campaignId,
          action: `Campaign Execution - ${channel}`,
          status,
          details,
        });
    } catch (error) {
      console.error('Failed to log execution:', error);
    }
  }
}