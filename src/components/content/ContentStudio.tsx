import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  PenTool, 
  Image, 
  Mail, 
  MessageSquare,
  Copy,
  Download,
  Sparkles
} from 'lucide-react';
import { generateAdCopy } from '../../lib/gemini';
import toast from 'react-hot-toast';

interface GeneratedContent {
  type: 'ad_copy' | 'email' | 'social';
  platform: string;
  content: string[];
  timestamp: string;
}

export const ContentStudio: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    platform: 'Google Ads',
    contentType: 'ad_copy'
  });

  const platforms = ['Google Ads', 'Meta Ads', 'LinkedIn', 'Instagram', 'Twitter'];
  const contentTypes = [
    { id: 'ad_copy', name: 'Ad Copy', icon: PenTool },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'social', name: 'Social Media', icon: MessageSquare },
  ];

  const handleGenerate = async () => {
    if (!formData.product || !formData.audience) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const content = await generateAdCopy(
        formData.product,
        formData.audience,
        formData.platform
      );

      const newContent: GeneratedContent = {
        type: formData.contentType as 'ad_copy',
        platform: formData.platform,
        content,
        timestamp: new Date().toISOString(),
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Studio</h1>
        <p className="text-gray-600 mt-1">
          Generate AI-powered marketing content using Google Gemini (free)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Generate Content
              </CardTitle>
            </CardHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, contentType: type.id }))}
                      className={`
                        flex items-center p-3 rounded-lg border-2 text-left transition-all
                        ${formData.contentType === type.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      <type.icon className="w-4 h-4 mr-2" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Product/Service"
                value={formData.product}
                onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                placeholder="e.g., Project management software"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={formData.audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe your target audience..."
                />
              </div>

              <Button
                onClick={handleGenerate}
                loading={loading}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </Card>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner text="Generating content with Gemini AI..." />
              </div>
            )}

            {!loading && generatedContent.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <PenTool className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No content generated yet
                </h3>
                <p className="text-gray-600">
                  Fill out the form and click generate to create AI-powered content using Google Gemini
                </p>
              </div>
            )}

            {!loading && generatedContent.length > 0 && (
              <div className="space-y-6">
                {generatedContent.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md font-medium">
                          {item.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {item.content.map((text, textIndex) => (
                        <div key={textIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-900 flex-1">{text}</p>
                            <button
                              onClick={() => copyToClipboard(text)}
                              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};