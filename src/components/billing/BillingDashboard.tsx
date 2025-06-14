import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PaymentForm } from './PaymentForm';
import { SubscriptionManager } from './SubscriptionManager';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { stripePromise } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface BillingData {
  currentPlan: string;
  billingCycle: string;
  nextBillingDate: string;
  totalSpent: number;
  creditsRemaining: number;
  paymentMethods: any[];
  invoices: any[];
}

export const BillingDashboard: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      // In a real app, this would fetch from your billing API
      const mockBillingData: BillingData = {
        currentPlan: 'Professional',
        billingCycle: 'monthly',
        nextBillingDate: '2024-02-15',
        totalSpent: 1250.00,
        creditsRemaining: 850,
        paymentMethods: [
          {
            id: 'pm_1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            isDefault: true
          }
        ],
        invoices: [
          {
            id: 'inv_1',
            date: '2024-01-15',
            amount: 99.00,
            status: 'paid',
            description: 'Professional Plan - January 2024'
          },
          {
            id: 'inv_2',
            date: '2023-12-15',
            amount: 99.00,
            status: 'paid',
            description: 'Professional Plan - December 2023'
          }
        ]
      };

      setBillingData(mockBillingData);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (amount: number) => {
    try {
      // Create payment intent for credits
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100, currency: 'usd' })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      setShowPaymentForm(true);
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to process payment');
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    // In a real app, this would download the actual invoice
    toast.success('Invoice downloaded successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading billing information..." />
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load billing information
        </h3>
        <Button onClick={fetchBillingData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription, payment methods, and usage
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold text-gray-900">{billingData.currentPlan}</p>
              <p className="text-sm text-gray-500 capitalize">{billingData.billingCycle}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${billingData.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-green-600">This year</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{billingData.creditsRemaining}</p>
              <p className="text-sm text-gray-500">AI generations</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Billing</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(billingData.nextBillingDate).getDate()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(billingData.nextBillingDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Management */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">{billingData.currentPlan} Plan</h4>
                <p className="text-sm text-blue-700">
                  Billed {billingData.billingCycle} • Next billing: {new Date(billingData.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubscriptionManager(true)}
              >
                Manage
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddCredits(50)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Add $50 Credits
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAddCredits(100)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Add $100 Credits
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {billingData.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.brand.toUpperCase()} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="text-xs text-green-600 font-medium">Default</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPaymentForm(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingData.invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{invoice.description}</td>
                  <td className="py-3 px-4 text-gray-900">${invoice.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadInvoice(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Form Modal */}
      {showPaymentForm && stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            isOpen={showPaymentForm}
            onClose={() => setShowPaymentForm(false)}
            onSuccess={() => {
              setShowPaymentForm(false);
              fetchBillingData();
              toast.success('Payment processed successfully');
            }}
          />
        </Elements>
      )}

      {/* Subscription Manager Modal */}
      {showSubscriptionManager && (
        <SubscriptionManager
          isOpen={showSubscriptionManager}
          onClose={() => setShowSubscriptionManager(false)}
          currentPlan={billingData.currentPlan}
          onPlanChange={(newPlan) => {
            setBillingData(prev => prev ? { ...prev, currentPlan: newPlan } : null);
            setShowSubscriptionManager(false);
            toast.success(`Switched to ${newPlan} plan`);
          }}
        />
      )}
    </div>
  );
};