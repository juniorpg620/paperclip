export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewLead {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  status?: LeadStatus;
  notes?: string | null;
}

export interface LeadUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  status?: LeadStatus;
  notes?: string | null;
}
