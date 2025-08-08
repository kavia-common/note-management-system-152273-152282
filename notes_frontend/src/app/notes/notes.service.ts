import { Injectable } from '@angular/core';

/**
 * The Note model represents a Note in the app and DB.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private supabase: any = null;
  private notesTable = 'notes';

  constructor() {}

  // PUBLIC_INTERFACE
  private async getClient(): Promise<any> {
    if (this.supabase) return this.supabase;
    if (typeof globalThis === 'undefined') {
      throw new Error('Supabase client cannot be loaded in this environment.');
    }
    let supabaseUrl = '';
    let supabaseKey = '';
    if (typeof (globalThis as any)['NG_APP_SUPABASE_URL'] !== 'undefined') {
      supabaseUrl = (globalThis as any)['NG_APP_SUPABASE_URL'] || '';
    }
    if (typeof (globalThis as any)['NG_APP_SUPABASE_KEY'] !== 'undefined') {
      supabaseKey = (globalThis as any)['NG_APP_SUPABASE_KEY'] || '';
    }
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials unavailable.');
    }
    // Dynamic import to avoid SSR/build/plugin errors
    const mod = await import('@supabase/supabase-js');
    this.supabase = mod.createClient(supabaseUrl, supabaseKey);
    return this.supabase;
  }

  // PUBLIC_INTERFACE
  async getNotes(searchText = '', sortBy = 'created_at'): Promise<Note[]> {
    const supabase = await this.getClient();
    let query = supabase.from(this.notesTable).select('*');
    if (searchText.trim()) {
      query = query.ilike('title', `%${searchText}%`);
    }
    if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'title') {
      query = query.order(sortBy, { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data || [];
  }

  // PUBLIC_INTERFACE
  async getNote(id: string): Promise<Note | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase.from(this.notesTable).select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }

  // PUBLIC_INTERFACE
  async createNote(title: string, content: string): Promise<Note> {
    const supabase = await this.getClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase.from(this.notesTable).insert([{ title, content, created_at: now, updated_at: now }]).select().single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async updateNote(id: string, title: string, content: string): Promise<Note> {
    const supabase = await this.getClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase.from(this.notesTable).update({ title, content, updated_at: now }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase.from(this.notesTable).delete().eq('id', id);
    if (error) throw error;
  }
}
