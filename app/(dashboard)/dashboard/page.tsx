'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { sampleCampaigns, sampleLeads, sampleLinkedinAccounts } from '@/lib/data/sample-data';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, Users, Send, CheckCircle, Clock, Ban } from 'lucide-react';

export default function DashboardPage() {
  // Calculate recent activity from leads
  const recentActivity = sampleLeads.slice(0, 8).map(lead => ({
    id: lead.id,
    lead: {
      name: lead.name,
      title: lead.title,
      avatar: lead.profileImage,
    },
    campaign: lead.campaignId === '3' ? 'Gynoveda' : 'BodyBuilding India',
    status: lead.status,
    timestamp: lead.lastContactDate || lead.updatedAt,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'contacted':
        return <Send className="h-4 w-4" />;
      case 'responded':
      case 'converted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <Ban className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Campaigns" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {sampleCampaigns.slice(0, 6).map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className={`p-4 flex items-center justify-between ${
                      index !== sampleCampaigns.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="font-medium">{campaign.name}</div>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Select defaultValue="recent">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Most Recent" />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="grid grid-cols-3 text-sm font-medium">
                <div>Lead</div>
                <div>Campaign</div>
                <div>Status</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-4 ${
                      index !== recentActivity.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={activity.lead.avatar} 
                            alt={activity.lead.name} 
                          />
                          <AvatarFallback className="bg-gray-200 text-xs">
                            {activity.lead.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {activity.lead.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {activity.lead.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">{activity.campaign}</div>
                      <div className="flex flex-col items-start space-y-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(activity.status)}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(activity.status)}
                            <span className="capitalize">
                              {activity.status === 'pending' ? 'Pending Approval' : 
                               activity.status === 'contacted' ? 'Sent 7 mins ago' :
                               activity.status === 'responded' ? 'Responded' :
                               activity.status === 'converted' ? 'Converted' :
                               'Do Not Contact'}
                            </span>
                          </div>
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* LinkedIn Accounts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>LinkedIn Accounts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
              <div>Account</div>
              <div>Status</div>
              <div>Requests</div>
              <div></div>
            </div>
            {sampleLinkedinAccounts.map((account) => (
              <div key={account.id} className="grid grid-cols-4 gap-4 items-center py-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={account.profileImage} alt={account.name} />
                    <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-gray-500">{account.email}</div>
                  </div>
                </div>
                <div>
                  <Badge 
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {account.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    {account.requestsUsed}/{account.requestsLimit}
                  </div>
                  <Progress 
                    value={(account.requestsUsed / account.requestsLimit) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}