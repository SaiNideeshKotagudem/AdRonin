import nodemailer from 'nodemailer';
import axios from 'axios';

interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  apiKey?: string;
  domain?: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export class EmailMarketingIntegration {
  private config: EmailConfig;
  private transporter?: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.config.provider === 'smtp' && this.config.smtpConfig) {
      this.transporter = nodemailer.createTransporter(this.config.smtpConfig);
    }
  }

  async sendCampaignEmail(campaignData: any, recipients: string[]) {
    switch (this.config.provider) {
      case 'sendgrid':
        return this.sendWithSendGrid(campaignData, recipients);
      case 'mailgun':
        return this.sendWithMailgun(campaignData, recipients);
      case 'smtp':
        return this.sendWithSMTP(campaignData, recipients);
      default:
        throw new Error('Unsupported email provider');
    }
  }

  private async sendWithSendGrid(campaignData: any, recipients: string[]) {
    try {
      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{
            to: recipients.map(email => ({ email })),
            subject: campaignData.subject
          }],
          from: { email: campaignData.fromEmail, name: campaignData.fromName },
          content: [{
            type: 'text/html',
            value: campaignData.htmlContent
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('SendGrid email failed:', error);
      throw error;
    }
  }

  private async sendWithMailgun(campaignData: any, recipients: string[]) {
    try {
      const response = await axios.post(
        `https://api.mailgun.net/v3/${this.config.domain}/messages`,
        {
          from: `${campaignData.fromName} <${campaignData.fromEmail}>`,
          to: recipients.join(','),
          subject: campaignData.subject,
          html: campaignData.htmlContent
        },
        {
          auth: {
            username: 'api',
            password: this.config.apiKey!
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Mailgun email failed:', error);
      throw error;
    }
  }

  private async sendWithSMTP(campaignData: any, recipients: string[]) {
    if (!this.transporter) {
      throw new Error('SMTP transporter not initialized');
    }

    try {
      const results = await Promise.all(
        recipients.map(recipient =>
          this.transporter!.sendMail({
            from: `${campaignData.fromName} <${campaignData.fromEmail}>`,
            to: recipient,
            subject: campaignData.subject,
            html: campaignData.htmlContent
          })
        )
      );

      return results;
    } catch (error) {
      console.error('SMTP email failed:', error);
      throw error;
    }
  }

  async getEmailMetrics(campaignId: string) {
    // This would integrate with your email provider's analytics API
    // For now, return mock data
    return {
      sent: 1000,
      delivered: 980,
      opened: 245,
      clicked: 89,
      bounced: 20,
      unsubscribed: 5
    };
  }
}