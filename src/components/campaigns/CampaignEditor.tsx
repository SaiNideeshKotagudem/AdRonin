import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  DollarSign,
  Target,
  Calendar,
  Users,
  Settings,
  Eye
} from 'lucide-react';
import { Campaign } from '../../types/database';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CampaignEditorProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCampaign: Partial<Campaign>) => void;
}

interface AdSet {
  id: string;
  name: string;
  budget: number;
  targeting: any;
  adCreatives: AdCreative[];
}

interface AdCreative {
  id: string;
  headline: string;
  description: string;
  imageUrl?: string;
  callToAction: string;
}

export const CampaignEditor: React.FC<CampaignEditorProps> = ({
  campaign,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedCampaign, setEditedCampaign] = useState<Partial<Campaign>>(campaign);
  const [activeTab, setActiveTab] = useState('overview');
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [showAdSetModal, setShowAdSetModal] = useState(false);
  const [editingAdSet, setEditingAdSet] = useState<AdSet | null>(null);

  useEffect(() => {
    setEditedCampaign(campaign);
    // Initialize ad sets from campaign strategy
    if (campaign.strategy?.ad_sets) {
      setAdSets(campaign.strategy.ad_sets);
    }
  }, [campaign]);

  const handleSave = () => {
    const updatedCampaign = {
      ...editedCampaign,
      strategy: {
        ...editedCampaign.strategy,
        ad_sets: adSets,
      },
    };
    onSave(updatedCampaign);
    onClose();
  };

  const handleBudgetAllocation = (channel: string, percentage: number) => {
    const updatedStrategy = {
      ...editedCampaign.strategy,
      budget_allocation: {
        ...editedCampaign.strategy?.budget_allocation,
        [channel]: percentage,
      },
    };
    setEditedCampaign(prev => ({ ...prev, strategy: updatedStrategy }));
  };

  const addAdSet = () => {
    const newAdSet: AdSet = {
      id: `adset-${Date.now()}`,
      name: 'New Ad Set',
      budget: 100,
      targeting: {},
      adCreatives: [],
    };
    setEditingAdSet(newAdSet);
    setShowAdSetModal(true);
  };

  const saveAdSet = (adSet: AdSet) => {
    if (adSets.find(as => as.id === adSet.id)) {
      setAdSets(prev => prev.map(as => as.id === adSet.id ? adSet : as));
    } else {
      setAdSets(prev => [...prev, adSet]);
    }
    setShowAdSetModal(false);
    setEditingAdSet(null);
  };

  const deleteAdSet = (adSetId: string) => {
    setAdSets(prev => prev.filter(as => as.id !== adSetId));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(adSets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAdSets(items);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'budget', name: 'Budget & Bidding', icon: DollarSign },
    { id: 'targeting', name: 'Targeting', icon: Target },
    { id: 'adsets', name: 'Ad Sets', icon: Settings },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Campaign Editor" size="xl">
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 pr-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Campaign Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Campaign Name"
                    value={editedCampaign.name || ''}
                    onChange={(e) => setEditedCampaign(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    label="Total Budget ($)"
                    type="number"
                    value={editedCampaign.budget || 0}
                    onChange={(e) => setEditedCampaign(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Goal
                </label>
                <ReactQuill
                  value={editedCampaign.business_goal || ''}
                  onChange={(value) => setEditedCampaign(prev => ({ ...prev, business_goal: value }))}
                  theme="snow"
                  style={{ height: '120px', marginBottom: '50px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <ReactQuill
                  value={editedCampaign.target_audience || ''}
                  onChange={(value) => setEditedCampaign(prev => ({ ...prev, target_audience: value }))}
                  theme="snow"
                  style={{ height: '120px', marginBottom: '50px' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Budget Allocation</h3>
              <div className="space-y-4">
                {editedCampaign.channels?.map((channel) => (
                  <div key={channel} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">{channel}</h4>
                      <p className="text-sm text-gray-600">
                        ${Math.round((editedCampaign.budget || 0) * (editedCampaign.strategy?.budget_allocation?.[channel] || 0) / 100)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editedCampaign.strategy?.budget_allocation?.[channel] || 0}
                        onChange={(e) => handleBudgetAllocation(channel, parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm font-medium w-12">
                        {editedCampaign.strategy?.budget_allocation?.[channel] || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'targeting' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Targeting Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Min Age" type="number" placeholder="18" />
                      <Input label="Max Age" type="number" placeholder="65" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>All</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    <Input label="Interest Keywords" placeholder="technology, business, marketing" />
                    <div className="flex flex-wrap gap-2">
                      {['Technology', 'Business', 'Marketing', 'Entrepreneurship'].map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full cursor-pointer hover:bg-blue-200"
                        >
                          {interest} ×
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'adsets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ad Sets</h3>
                <Button onClick={addAdSet}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ad Set
                </Button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="adsets">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {adSets.map((adSet, index) => (
                        <Draggable key={adSet.id} draggableId={adSet.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 border border-gray-200 rounded-lg bg-white"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{adSet.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Budget: ${adSet.budget} • {adSet.adCreatives.length} creatives
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingAdSet(adSet);
                                      setShowAdSetModal(true);
                                    }}
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteAdSet(adSet.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Campaign Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Ad Scheduling</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium mb-2">{day}</div>
                      <div className="space-y-1">
                        {Array.from({ length: 24 }, (_, hour) => (
                          <div
                            key={hour}
                            className="h-2 bg-gray-200 rounded cursor-pointer hover:bg-blue-300"
                            title={`${hour}:00`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Ad Set Modal */}
      {showAdSetModal && editingAdSet && (
        <AdSetEditor
          adSet={editingAdSet}
          isOpen={showAdSetModal}
          onClose={() => {
            setShowAdSetModal(false);
            setEditingAdSet(null);
          }}
          onSave={saveAdSet}
        />
      )}
    </Modal>
  );
};

// Ad Set Editor Component
interface AdSetEditorProps {
  adSet: AdSet;
  isOpen: boolean;
  onClose: () => void;
  onSave: (adSet: AdSet) => void;
}

const AdSetEditor: React.FC<AdSetEditorProps> = ({ adSet, isOpen, onClose, onSave }) => {
  const [editedAdSet, setEditedAdSet] = useState<AdSet>(adSet);

  const handleSave = () => {
    onSave(editedAdSet);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Ad Set" size="lg">
      <div className="space-y-6">
        <Input
          label="Ad Set Name"
          value={editedAdSet.name}
          onChange={(e) => setEditedAdSet(prev => ({ ...prev, name: e.target.value }))}
        />
        
        <Input
          label="Budget ($)"
          type="number"
          value={editedAdSet.budget}
          onChange={(e) => setEditedAdSet(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
        />

        <div>
          <h4 className="font-medium mb-4">Ad Creatives</h4>
          <div className="space-y-4">
            {editedAdSet.adCreatives.map((creative, index) => (
              <div key={creative.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Headline"
                    value={creative.headline}
                    onChange={(e) => {
                      const updatedCreatives = [...editedAdSet.adCreatives];
                      updatedCreatives[index] = { ...creative, headline: e.target.value };
                      setEditedAdSet(prev => ({ ...prev, adCreatives: updatedCreatives }));
                    }}
                  />
                  <Input
                    label="Call to Action"
                    value={creative.callToAction}
                    onChange={(e) => {
                      const updatedCreatives = [...editedAdSet.adCreatives];
                      updatedCreatives[index] = { ...creative, callToAction: e.target.value };
                      setEditedAdSet(prev => ({ ...prev, adCreatives: updatedCreatives }));
                    }}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={creative.description}
                    onChange={(e) => {
                      const updatedCreatives = [...editedAdSet.adCreatives];
                      updatedCreatives[index] = { ...creative, description: e.target.value };
                      setEditedAdSet(prev => ({ ...prev, adCreatives: updatedCreatives }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => {
                const newCreative: AdCreative = {
                  id: `creative-${Date.now()}`,
                  headline: 'New Headline',
                  description: 'New description',
                  callToAction: 'Learn More',
                };
                setEditedAdSet(prev => ({
                  ...prev,
                  adCreatives: [...prev.adCreatives, newCreative]
                }));
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Creative
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Ad Set
        </Button>
      </div>
    </Modal>
  );
};