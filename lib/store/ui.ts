import { create } from 'zustand';
import { Campaign, Lead } from '@/lib/db/schema';

interface UIState {
  sidebarCollapsed: boolean;
  selectedCampaign: Campaign | null;
  selectedLead: Lead | null;
  isLeadDetailsOpen: boolean;
  searchQuery: string;
  statusFilter: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setIsLeadDetailsOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  selectedCampaign: null,
  selectedLead: null,
  isLeadDetailsOpen: false,
  searchQuery: '',
  statusFilter: 'all',
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setIsLeadDetailsOpen: (open) => set({ isLeadDetailsOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
