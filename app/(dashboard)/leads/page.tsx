'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useLeadsStore } from '@/lib/stores/leads';
import { sampleLeads, sampleCampaigns } from '@/lib/data/sample-data';
import { formatDistanceToNow } from 'date-fns';
import { Search, ChevronDown, ArrowUpDown, X, ExternalLink, Clock, CheckCircle, MessageSquare, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const {
    selectedLead,
    isLeadDetailOpen,
    searchQuery,
    statusFilter,
    setSelectedLead,
    setLeadDetailOpen,
    setSearchQuery,
    setStatusFilter,
  } = useLeadsStore();

  const [sortField, setSortField] = useState<'name' | 'campaign' | 'status' | 'lastContact'>('lastContact');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort leads
  const filteredLeads = sampleLeads
    .filter((lead) => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'campaign':
          const aCampaign = sampleCampaigns.find(c => c.id === a.campaignId)?.name || '';
          const bCampaign = sampleCampaigns.find(c => c.id === b.campaignId)?.name || '';
          aValue = aCampaign.toLowerCase();
          bValue = bCampaign.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastContact':
          aValue = a.lastContactDate?.getTime() || 0;
          bValue = b.lastContactDate?.getTime() || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleLeadClick = (lead: typeof sampleLeads[0]) => {
    setSelectedLead(lead);
    setLeadDetailOpen(true);
  };

  const closeLeadDetail = () => {
    setLeadDetailOpen(false);
    setSelectedLead(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'converted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCampaignName = (campaignId: string) => {
    const campaign = sampleCampaigns.find(c => c.id === campaignId);
    return campaign?.name || 'Unknown Campaign';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invitation_sent':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'connection_status':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'follow_up':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-gray-600">Manage and track your leads across all campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-4 flex items-center space-x-1 cursor-pointer" onClick={() => setSortField('name')}>
              <span>Name</span>
              <ArrowUpDown className="h-3 w-3" />
            </div>
            <div className="col-span-3 flex items-center space-x-1 cursor-pointer" onClick={() => setSortField('campaign')}>
              <span>Campaign Name</span>
              <ArrowUpDown className="h-3 w-3" />
            </div>
            <div className="col-span-2">Activity</div>
            <div className="col-span-3 flex items-center space-x-1 cursor-pointer" onClick={() => setSortField('status')}>
              <span>Status</span>
              <ArrowUpDown className="h-3 w-3" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredLeads.map((lead, index) => (
              <div
                key={lead.id}
                className={`p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 cursor-pointer ${
                  index !== filteredLeads.length - 1 ? 'border-b' : ''
                }`}
                onClick={() => handleLeadClick(lead)}
              >
                <div className="col-span-4 flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lead.profileImage} alt={lead.name} />
                    <AvatarFallback className="bg-gray-200">
                      {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.title}</div>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-sm">{getCampaignName(lead.campaignId)}</span>
                </div>
                <div className="col-span-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className="w-1 h-6 bg-yellow-400 rounded-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      Sent {lead.lastContactDate ? formatDistanceToNow(lead.lastContactDate, { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Sheet */}
      <Sheet open={isLeadDetailOpen} onOpenChange={setLeadDetailOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px] p-0">
          {selectedLead && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl">Lead Profile</SheetTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={closeLeadDetail}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Profile Section */}
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedLead.profileImage} alt={selectedLead.name} />
                    <AvatarFallback className="bg-gray-200 text-lg">
                      {selectedLead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-1">{selectedLead.title}</p>
                    <p className="text-gray-600 mb-3">at {selectedLead.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>👥</span>
                        <span>{getCampaignName(selectedLead.campaignId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Sent 7 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Profile Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-600"
                  >
                    Additional Profile Info
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  {selectedLead.activityData && JSON.parse(selectedLead.activityData).length > 0 ? (
                    JSON.parse(selectedLead.activityData).map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Message: {activity.message}
                            {activity.message.length > 50 && (
                              <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                                See More
                              </Button>
                            )}
                          </p>
                          <div className="w-px h-6 bg-gray-200 ml-2"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No activity data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}