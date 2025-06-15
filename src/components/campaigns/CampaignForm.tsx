import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useCampaignStore } from '../../stores/campaign';
import { generateCampaignPlan } from '../../lib/gemini';
import { CampaignFormData } from '../../types';
import toast from 'react-hot-toast';

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableChannels = [
  'Google Ads',
  'Meta Ads',
  'LinkedIn Ads',
  'Email Marketing',
  'SEO',
  'Content Marketing',
];

export const CampaignForm: React.FC<CampaignFormProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const { createCampaign } = useCampaignStore();

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch 
  } = useForm<CampaignFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      business_goal: '',
      target_audience: '',
      budget: 0,
      channels: []
    }
  });

  // Watch form values for debugging
  const watchedValues = watch();

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const onSubmit = async (data: CampaignFormData) => {
    console.log('Campaign form submitted with data:', data);
    console.log('Selected channels:', selectedChannels);

    if (selectedChannels.length === 0) {
      toast.error('Please select at least one marketing channel');
      return;
    }

    if (!data.name || !data.business_goal || !data.target_audience || !data.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Generate AI campaign strategy using Gemini
      const strategy = await generateCampaignPlan(
        data.business_goal,
        data.target_audience,
        data.budget
      );

      // Create campaign with AI-generated strategy
      const campaign = await createCampaign({
        ...data,
        channels: selectedChannels,
        strategy,
        status: 'draft',
      });

      if (campaign) {
        toast.success('Campaign created successfully!');
        reset();
        setSelectedChannels([]);
        onClose();
      } else {
        toast.error('Failed to create campaign');
      }
    } catch (error) {
      console.error('Campaign creation error:', error);
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedChannels([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Campaign" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div>
          <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name *
          </label>
          <input
            id="campaign-name"
            type="text"
            {...register('name', { required: 'Campaign name is required' })}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            placeholder="e.g., Q1 Product Launch Campaign"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="business-goal" className="block text-sm font-medium text-gray-700 mb-1">
            Business Goal *
          </label>
          <textarea
            id="business-goal"
            {...register('business_goal', { required: 'Business goal is required' })}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.business_goal ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            rows={3}
            placeholder="Describe what you want to achieve with this campaign..."
          />
          {errors.business_goal && (
            <p className="text-sm text-red-600 mt-1">{errors.business_goal.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="target-audience" className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience *
          </label>
          <textarea
            id="target-audience"
            {...register('target_audience', { required: 'Target audience is required' })}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.target_audience ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            rows={3}
            placeholder="Describe your ideal customers, their demographics, interests, and behaviors..."
          />
          {errors.target_audience && (
            <p className="text-sm text-red-600 mt-1">{errors.target_audience.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget ($) *
          </label>
          <input
            id="budget"
            type="number"
            min="100"
            {...register('budget', { 
              required: 'Budget is required',
              min: { value: 100, message: 'Minimum budget is $100' },
              valueAsNumber: true
            })}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.budget ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            placeholder="5000"
          />
          {errors.budget && (
            <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Marketing Channels *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availableChannels.map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() => handleChannelToggle(channel)}
                className={`
                  p-3 rounded-lg border-2 text-left transition-all duration-200
                  ${selectedChannels.includes(channel)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <div className="font-medium">{channel}</div>
              </button>
            ))}
          </div>
          {selectedChannels.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Select at least one marketing channel
            </p>
          )}
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            <div>Debug Form Values:</div>
            <div>Name: {watchedValues.name || 'empty'}</div>
            <div>Budget: {watchedValues.budget || 'empty'}</div>
            <div>Channels: {selectedChannels.join(', ') || 'none'}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
};