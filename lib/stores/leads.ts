'use client';

import { create } from 'zustand';
import type { LeadWithRelations } from '@/lib/db/schema';

interface LeadsStore {
  selectedLead: LeadWithRelations | null;
  isLeadDetailOpen: boolean;
  searchQuery: string;
  statusFilter: string;
  setSelectedLead: (lead: LeadWithRelations | null) => void;
  setLeadDetailOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
}

export const useLeadsStore = create<LeadsStore>((set) => ({
  selectedLead: null,
  isLeadDetailOpen: false,
  searchQuery: '',
  statusFilter: 'all',
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setLeadDetailOpen: (open) => set({ isLeadDetailOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));