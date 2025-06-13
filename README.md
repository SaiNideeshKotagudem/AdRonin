# AutoMarkAI - AI-Powered Marketing Automation Platform

A comprehensive AI-driven marketing automation platform that helps businesses create, execute, and optimize their digital marketing campaigns across multiple channels.

## 🚀 Features

### 🖥️ User Dashboard
- Secure authentication with Supabase Auth
- Real-time campaign performance monitoring
- Intuitive campaign creation and management
- AI-powered chatbot assistant for insights

### 🧠 AI Campaign Planner
- GPT-4 powered campaign strategy generation
- Multi-channel campaign planning (Google Ads, Meta, LinkedIn, Email, SEO)
- Automated audience targeting recommendations
- Budget allocation optimization

### ✍️ Content Generation Engine
- AI-generated ad copy, email content, and social media posts
- Platform-specific content optimization
- Bulk content generation and management
- Content performance tracking

### ⚙️ Execution Engine
- Simulated campaign deployment across platforms
- Mock API integrations for testing
- Campaign execution logging and monitoring
- Modular architecture for future real API integrations

### 📈 Analytics & Optimization
- Real-time performance tracking and visualization
- AI-generated insights and recommendations
- Automated campaign optimization suggestions
- Custom reporting and data export

### 🔧 Developer Mode
- System health monitoring
- Execution logs and debugging tools
- API configuration management
- Performance diagnostics

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI/ML**: OpenAI GPT-4 API
- **State Management**: Zustand
- **Charts**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd automark-ai
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Environment
VITE_NODE_ENV=development
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration file located in `supabase/migrations/create_initial_schema.sql` in your Supabase SQL editor
3. Enable email authentication in your Supabase Auth settings

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Configuration

### Supabase Setup
1. Create a new project in Supabase
2. Go to Settings > API to get your project URL and anon key
3. Navigate to Authentication > Settings and configure:
   - Enable email provider
   - Disable email confirmations for development
4. Run the database migration to create required tables

### OpenAI Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Add the key to your `.env.local` file
3. Ensure you have sufficient credits for API usage

## 📊 Database Schema

The application uses the following main tables:

- **campaigns**: Store campaign information and AI-generated strategies
- **campaign_performance**: Track performance metrics across channels
- **generated_content**: Store AI-generated marketing content

All tables include Row Level Security (RLS) policies to ensure data privacy.

## 🎨 UI Components

The application features a modern, responsive design with:

- **Gradient-based color system** with primary blues and purples
- **Card-based layouts** with subtle shadows and rounded corners
- **Interactive charts** for data visualization
- **Responsive grid system** that adapts to all screen sizes
- **Smooth animations** and micro-interactions

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication via Supabase
- API key protection with environment variables
- Input validation and sanitization
- CORS configuration for API requests

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on git push

### Netlify Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── campaigns/      # Campaign management
│   ├── content/        # Content generation
│   ├── analytics/      # Analytics and reporting
│   └── developer/      # Developer tools
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── stores/             # Zustand state stores
├── types/              # TypeScript definitions
└── App.tsx             # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤖 AI Features

The platform integrates with OpenAI's APIs to provide:

- **Campaign Strategy Generation**: Creates comprehensive marketing strategies
- **Content Creation**: Generates platform-specific ad copy and content
- **Performance Insights**: Analyzes data and provides actionable recommendations
- **Audience Targeting**: Suggests optimal targeting parameters

## 📈 Monitoring & Analytics

- Real-time campaign performance tracking
- Multi-channel analytics with interactive charts
- AI-powered insights and recommendations
- Export capabilities for reports and data
- System health monitoring in developer mode

## 🛠️ Customization

The platform is built with modularity in mind:

- **Component-based architecture** for easy UI customization
- **Environment-based configuration** for different deployment stages
- **Mock API layer** for testing without real integrations
- **Extensible database schema** for additional features

## 📞 Support

For issues and questions:

1. Check the developer mode for system diagnostics
2. Review the execution logs for debugging information
3. Ensure all environment variables are properly configured
4. Verify Supabase and OpenAI API connectivity

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using modern web technologies and AI-powered automation.