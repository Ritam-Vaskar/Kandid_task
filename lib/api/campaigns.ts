import { Campaign } from '@/lib/db/schema';
import { useQuery } from '@tanstack/react-query';

async function fetchCampaigns() {
  const response = await fetch('/api/campaigns');
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return response.json() as Promise<Campaign[]>;
}

async function createCampaign(data: { name: string; description?: string; status?: string }) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }
  return response.json() as Promise<Campaign>;
}

export const campaignsKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignsKeys.all, 'list'] as const,
  detail: (id: string) => [...campaignsKeys.all, 'detail', id] as const,
};

export { fetchCampaigns, createCampaign };
