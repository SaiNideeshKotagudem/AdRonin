import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Check, Star, Zap } from 'lucide-react';

interface SubscriptionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onPlanChange: (newPlan: string) => void;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    icon: Zap,
    features: [
      '5 campaigns per month',
      '1,000 AI generations',
      'Basic analytics',
      'Email support',
      '2 team members'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    icon: Star,
    popular: true,
    features: [
      '25 campaigns per month',
      '10,000 AI generations',
      'Advanced analytics',
      'Priority support',
      '10 team members',
      'Custom integrations',
      'A/B testing'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    icon: Check,
    features: [
      'Unlimited campaigns',
      'Unlimited AI generations',
      'Custom analytics',
      'Dedicated support',
      'Unlimited team members',
      'White-label solution',
      'API access',
      'Custom training'
    ]
  }
];

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onPlanChange
}) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan.toLowerCase());
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  const handlePlanChange = async () => {
    setLoading(true);
    try {
      // In a real app, this would call your subscription API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        onPlanChange(plan.name);
      }
    } catch (error) {
      console.error('Failed to change plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountedPrice = (price: number) => {
    return billingInterval === 'year' ? Math.round(price * 0.8) : price;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Subscription" size="xl">
      <div className="space-y-6">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === 'year'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600 font-semibold">20% off</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.name.toLowerCase() === currentPlan.toLowerCase();
            const isSelected = plan.id === selectedPlan;
            const discountedPrice = getDiscountedPrice(plan.price);

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'hover:shadow-lg'
                } ${plan.popular ? 'border-purple-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100' 
                      : 'bg-gray-100'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.popular ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${discountedPrice}
                    </span>
                    <span className="text-gray-600">/{billingInterval}</span>
                    {billingInterval === 'year' && plan.price !== discountedPrice && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">${plan.price}</span>
                        <span className="ml-1 text-green-600 font-medium">Save 20%</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePlanChange}
            loading={loading}
            disabled={selectedPlan === currentPlan.toLowerCase() || loading}
          >
            {loading ? 'Updating...' : 'Update Subscription'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};