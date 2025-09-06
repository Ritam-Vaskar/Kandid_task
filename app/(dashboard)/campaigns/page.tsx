'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleCampaigns } from '@/lib/data/sample-data';
import { Search, Plus, Users, Send, CheckCircle, Reply, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter campaigns based on search and status
  const filteredCampaigns = sampleCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesTab = activeTab === 'all' || campaign.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (type: 'sent' | 'pending' | 'accepted' | 'replied' | 'connected', count: number) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'sent':
        return <Send {...iconProps} />;
      case 'pending':
        return <Users {...iconProps} />;
      case 'accepted':
        return <CheckCircle {...iconProps} />;
      case 'replied':
        return <Reply {...iconProps} />;
      case 'connected':
        return <CheckCircle {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const getStatusCount = (campaign: any, type: string) => {
    // For demo purposes, generate some numbers based on total leads
    const total = campaign.totalLeads;
    switch (type) {
      case 'sent':
        return Math.floor(total * 0.8);
      case 'pending':
        return Math.floor(total * 0.6);
      case 'accepted':
        return Math.floor(total * 0.4);
      case 'replied':
        return Math.floor(total * 0.2);
      default:
        return 0;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-gray-600">Manage your campaigns and track their performance.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-3">Campaign Name</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Total Leads</div>
            <div className="col-span-2">Request Status</div>
            <div className="col-span-3">Connection Status</div>
            <div className="col-span-1"></div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className={`p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 ${
                  index !== filteredCampaigns.length - 1 ? 'border-b' : ''
                }`}
              >
                {/* Campaign Name */}
                <div className="col-span-3">
                  <Link 
                    href={`/campaigns/${campaign.id}`}
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    {campaign.name}
                  </Link>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(campaign.status || '')} capitalize`}
                  >
                    {campaign.status || 'Unknown'}
                  </Badge>
                </div>

                {/* Total Leads */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('pending', campaign.totalLeads)}
                    <span className="font-medium">{campaign.totalLeads}</span>
                  </div>
                </div>

                {/* Request Status */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-green-600">
                      {getStatusIcon('accepted', 0)}
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600">
                      {getStatusIcon('pending', campaign.totalLeads)}
                      <span className="text-sm">{campaign.totalLeads}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600">
                      {getStatusIcon('replied', 0)}
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-blue-600">
                      {getStatusIcon('connected', 0)}
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/campaigns/${campaign.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator for infinite scroll (placeholder) */}
      <div className="text-center py-4 text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Loading more campaigns...</span>
        </div>
      </div>
    </div>
  );
}