'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { sampleCampaigns } from '@/lib/data/sample-data';
import { Users, Send, CheckCircle, Reply, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function CampaignDetailsPage({ params }: PageProps) {
  const { id } = params;
  const campaign = sampleCampaigns.find(c => c.id === id);

  if (!campaign) {
    notFound();
  }

  const stats = [
    {
      title: 'Total Leads',
      value: campaign.totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Request Sent',
      value: campaign.requestSent,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Request Accepted',
      value: campaign.requestAccepted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Request Replied',
      value: campaign.requestReplied,
      icon: Reply,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const progressData = [
    {
      label: 'Leads Contacted',
      value: 0,
      max: campaign.totalLeads,
      color: 'bg-blue-500',
    },
    {
      label: 'Acceptance Rate',
      value: 0,
      max: 100,
      color: 'bg-green-500',
    },
    {
      label: 'Reply Rate',
      value: 0,
      max: 100,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl font-semibold">{campaign.name}</h1>
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800"
            >
              {campaign.status}
            </Badge>
          </div>
          <p className="text-gray-600">Manage and track your campaign performance</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="sequence">Sequence</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {progressData.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-gray-500">
                        {item.value}.0%
                      </span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">
                      Start Date:{' '}
                      {campaign.startDate
                        ? format(new Date(campaign.startDate), 'dd/MM/yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                {campaign.endDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        End Date:{' '}
                        {format(new Date(campaign.endDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Status: {campaign.status}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">
                      Conversion Rate: {campaign.conversionRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Leads associated with this campaign will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequence">
          <Card>
            <CardHeader>
              <CardTitle>Message Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Campaign message sequence and automation settings.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Configure campaign settings and preferences.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
