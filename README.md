# AutoMarkAI - Complete Marketing Automation Platform

A comprehensive AI-driven marketing automation platform with real integrations, user-editable campaigns, and payment processing. Built with modern web technologies and production-ready features.

## 🚀 Features

### 🖥️ User Dashboard
- Secure authentication with Supabase Auth
- Real-time campaign performance monitoring
- Intuitive campaign creation and management
- AI-powered insights and recommendations

### 🧠 AI Campaign Planner & Editor
- GPT-4 powered campaign strategy generation
- **User-editable AI plans** with drag-and-drop interface
- Multi-channel campaign planning (Google Ads, Meta, LinkedIn, Email)
- Visual campaign builder with ad set management
- Budget allocation optimization with real-time adjustments
- Advanced targeting options and scheduling

### ✍️ Content Generation Engine
- AI-generated ad copy, email content, and social media posts
- Platform-specific content optimization
- Rich text editor for content customization
- Bulk content generation and management
- Content performance tracking

### ⚙️ Real Execution Engine
- **Live integrations** with Google Ads, Meta Ads, LinkedIn Ads
- **Real email marketing** via SendGrid, Mailgun, or SMTP
- Campaign execution with proper error handling
- Real-time performance data synchronization
- Automated campaign optimization

### 💳 Payment & Billing System
- **Stripe integration** for secure payments
- Subscription management with multiple plans
- Credit-based system for AI generations
- Invoice generation and billing history
- Webhook handling for real-time updates

### 📈 Analytics & Optimization
- Real-time performance tracking from actual platforms
- AI-generated insights and recommendations
- Custom reporting and data export
- Multi-channel analytics with interactive charts

### 🔧 Developer Mode
- System health monitoring
- Real execution logs and debugging tools
- API configuration management
- Performance diagnostics

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI/ML**: OpenAI GPT-4 API
- **Payments**: Stripe (Subscriptions, One-time payments)
- **Integrations**: 
  - Google Ads API
  - Meta Business API
  - LinkedIn Marketing API
  - Email providers (SendGrid, Mailgun, SMTP)
- **State Management**: Zustand
- **UI Components**: Custom components with drag-and-drop
- **Charts**: Recharts
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account
- Platform API credentials (Google Ads, Meta, LinkedIn)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd automark-ai
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Required - OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key-here

# Required - Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Optional - Platform Integrations
GOOGLE_ADS_CLIENT_ID=your-google-ads-client-id
GOOGLE_ADS_CLIENT_SECRET=your-google-ads-client-secret
META_ADS_ACCESS_TOKEN=your-meta-access-token
LINKEDIN_ADS_CLIENT_ID=your-linkedin-client-id

# Optional - Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the initial migration: `supabase/migrations/20250613120055_steep_lab.sql`
3. Run the billing migration: `supabase/migrations/add_billing_tables.sql`
4. Enable email authentication in Supabase Auth settings

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create webhook endpoint pointing to your Supabase Edge Function
4. Configure webhook events: `payment_intent.succeeded`, `customer.subscription.*`

### 5. Platform API Setup (Optional)

#### Google Ads API
1. Create a Google Ads developer account
2. Apply for API access
3. Set up OAuth 2.0 credentials
4. Get developer token

#### Meta Business API
1. Create a Meta for Developers account
2. Create a business app
3. Get access token with ads_management permissions
4. Set up ad account access

#### LinkedIn Marketing API
1. Create a LinkedIn Developer account
2. Create an application
3. Apply for Marketing API access
4. Get OAuth 2.0 credentials

### 6. Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Configuration

### Real Campaign Execution

The platform supports real campaign execution on:

- **Google Ads**: Search, Display, and Shopping campaigns
- **Meta Ads**: Facebook and Instagram campaigns
- **LinkedIn Ads**: Sponsored content and message ads
- **Email Marketing**: Automated email campaigns

### Payment Plans

Three subscription tiers available:

- **Starter** ($29/month): 5 campaigns, 1,000 AI generations
- **Professional** ($99/month): 25 campaigns, 10,000 AI generations
- **Enterprise** ($299/month): Unlimited campaigns and generations

### AI Features

- **Campaign Strategy Generation**: Creates comprehensive marketing strategies
- **Content Creation**: Generates platform-specific ad copy and content
- **Performance Optimization**: AI-powered budget and targeting recommendations
- **Audience Insights**: Advanced targeting suggestions based on campaign goals

## 📊 Database Schema

### Core Tables
- **campaigns**: Campaign information and AI-generated strategies
- **campaign_performance**: Real performance metrics from platforms
- **generated_content**: AI-generated marketing content

### Billing Tables
- **user_subscriptions**: Stripe subscription management
- **user_credits**: Credit-based usage tracking
- **execution_logs**: Campaign execution and API call logs

All tables include Row Level Security (RLS) policies for data privacy.

## 🎨 UI/UX Features

- **Drag-and-Drop Campaign Builder**: Visual interface for campaign creation
- **Real-time Collaboration**: Multiple team members can edit campaigns
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: User preference-based theming
- **Interactive Charts**: Real-time performance visualization
- **Rich Text Editor**: Advanced content creation tools

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication via Supabase
- API key encryption and secure storage
- Stripe PCI compliance for payment processing
- Rate limiting on API endpoints
- Input validation and sanitization

## 🚀 Deployment

### Production Deployment

1. **Environment Variables**: Set all production environment variables
2. **Database**: Run all migrations in production Supabase instance
3. **Stripe**: Configure production webhooks and API keys
4. **Platform APIs**: Set up production API credentials
5. **Build**: `npm run build`
6. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

### Webhook Configuration

Set up webhooks for real-time data synchronization:

- **Stripe**: Payment and subscription events
- **Google Ads**: Campaign performance updates
- **Meta**: Ad delivery and performance data
- **LinkedIn**: Campaign metrics and insights

## 📈 Monitoring & Analytics

- Real-time campaign performance tracking
- Multi-platform analytics dashboard
- AI-powered insights and recommendations
- Custom reporting with data export
- System health monitoring
- API usage and rate limit tracking

## 🛠️ Development

### Project Structure

```
src/
├── components/
│   ├── billing/           # Payment and subscription components
│   ├── campaigns/         # Campaign management and editor
│   ├── content/           # Content generation studio
│   ├── analytics/         # Performance analytics
│   └── ui/               # Reusable UI components
├── lib/
│   ├── integrations/      # Platform API integrations
│   ├── stripe.ts         # Payment processing
│   └── campaign-executor.ts # Campaign execution engine
├── stores/               # Zustand state management
└── types/               # TypeScript definitions

supabase/
├── functions/           # Edge functions for webhooks
└── migrations/         # Database schema migrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤖 AI Integration

The platform integrates with OpenAI's APIs to provide:

- **Campaign Strategy Generation**: Creates comprehensive marketing strategies
- **Content Creation**: Generates platform-specific ad copy and content
- **Performance Insights**: Analyzes data and provides actionable recommendations
- **Audience Targeting**: Suggests optimal targeting parameters
- **Budget Optimization**: AI-powered budget allocation across channels

## 💰 Cost Optimization

The platform is designed to be cost-effective:

- **Efficient API Usage**: Smart caching and rate limiting
- **Serverless Architecture**: Pay-per-use with Supabase Edge Functions
- **Optimized Queries**: Minimal database operations
- **CDN Integration**: Fast content delivery
- **Resource Pooling**: Shared resources across users

## 📞 Support & Documentation

- **Developer Mode**: Built-in debugging and diagnostics
- **Execution Logs**: Detailed API call and error logging
- **Health Monitoring**: System status and performance metrics
- **API Documentation**: Comprehensive integration guides

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using modern web technologies, real API integrations, and AI-powered automation. Ready for production deployment with enterprise-grade features.