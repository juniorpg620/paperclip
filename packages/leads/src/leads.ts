import { getSupabaseClient } from "./client.js";
import type { Lead, LeadUpdate, NewLead } from "./types.js";

const TABLE = "leads";

export async function createLead(input: NewLead): Promise<Lead> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Lead;
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as Lead) ?? null;
}

export async function listLeads(options?: { status?: Lead["status"] }): Promise<Lead[]> {
  let query = getSupabaseClient().from(TABLE).select().order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Lead[]) ?? [];
}

export async function updateLead(id: string, updates: LeadUpdate): Promise<Lead> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Lead;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
