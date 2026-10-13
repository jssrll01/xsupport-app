import { supabase } from './supabase.js';

export async function fetchReports() {
  const { data, error } = await supabase
    .from('report_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { error };
  return { data };
}

export async function updateReport(id, patch) {
  const { data, error } = await supabase
    .from('report_tickets')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteReport(id) {
  const { error } = await supabase.from('report_tickets').delete().eq('id', id);
  return { error };
}

export async function createReport(row) {
  const { data, error } = await supabase
    .from('report_tickets')
    .insert(row)
    .select()
    .single();
  return { data, error };
}
