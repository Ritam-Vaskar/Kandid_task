export type Lead = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  title?: string | null;
  status: string;
  campaignId: string;
  campaign?: {
    id: string;
    name: string;
  } | null;
  lastContactDate: Date | null;
  notes: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
