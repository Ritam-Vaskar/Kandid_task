import { Lead } from '@/lib/db/schema';

async function fetchLeads(campaignId?: string) {
  const url = campaignId 
    ? `/api/leads?campaignId=${campaignId}`
    : '/api/leads';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  return response.json() as Promise<Lead[]>;
}

async function createLead(data: { 
  name: string; 
  email?: string; 
  company?: string; 
  campaignId: string; 
}) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create lead');
  }
  return response.json() as Promise<Lead>;
}

async function updateLeadStatus(leadId: string, status: string) {
  const response = await fetch(`/api/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update lead status');
  }
  return response.json() as Promise<Lead>;
}

export const leadsKeys = {
  all: ['leads'] as const,
  lists: () => [...leadsKeys.all, 'list'] as const,
  list: (filters: { campaignId?: string }) => [...leadsKeys.lists(), filters] as const,
  details: (id: string) => [...leadsKeys.all, 'detail', id] as const,
};

export { fetchLeads, createLead, updateLeadStatus };
