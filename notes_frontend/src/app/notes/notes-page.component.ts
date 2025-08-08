import { Component } from '@angular/core';
import { NotesListComponent } from './notes-list.component';
import { NoteDetailComponent } from './note-detail.component';
import { NoteEditModalComponent } from './note-edit-modal.component';
import { Note, NotesService } from './notes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, NotesListComponent, NoteDetailComponent, NoteEditModalComponent, FormsModule],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css',
  providers: [NotesService]
})
export class NotesPageComponent {
  searchText: string = '';
  sortBy: string = 'created_at';

  notes: Note[] = [];
  selectedNote: Note | null = null;

  isEditModalOpen: boolean = false;
  editingNote: Note | null = null;

  errorMsg: string = '';

  // Remove unused notesService property to fix no-unused-vars error
  private notesService: NotesService;
  constructor(notesService: NotesService) {
    this.notesService = notesService;
  }

  ngOnInit() {
    console.log('[NotesPageComponent] ngOnInit called, loading notes');
    this.loadNotes();
  }

  async loadNotes() {
    try {
      this.errorMsg = '';
      this.notes = await this.notesService.getNotes(this.searchText, this.sortBy);
      console.log('[NotesPageComponent] Loaded notes:', this.notes);
    } catch (e: any) {
      console.error('[NotesPageComponent] Failed to load notes:', e?.message || e);
      this.notes = [];
      this.errorMsg = e?.message || 'Failed to load notes';
    }
  }

  // Handler for NotesList search or reload
  onSearch() {
    this.loadNotes();
  }

  onSortChange() {
    this.loadNotes();
  }

  openCreateModal() {
    this.editingNote = null;
    this.isEditModalOpen = true;
  }

  onSelectNote(note: Note) {
    this.selectedNote = note;
  }

  openEditModal(note: Note) {
    this.editingNote = note;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingNote = null;
  }

  async onSaveNote({ title, content }: { title: string; content: string }) {
    if (this.editingNote) {
      // update
      await this.notesService.updateNote(this.editingNote.id, title, content);
    } else {
      // create
      await this.notesService.createNote(title, content);
    }
    await this.loadNotes();
    this.closeEditModal();
  }

  async onDeleteNote(note: Note) {
    if (!note) return;
    // Browser-safe confirm dialog
    let ok = true;
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function') {
      ok = (globalThis as any).confirm('Delete this note?');
    }
    if (ok) {
      await this.notesService.deleteNote(note.id);
      this.selectedNote = null;
      await this.loadNotes();
    }
  }
}
