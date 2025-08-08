import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from './notes.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent implements OnInit {
  @Input() searchText: string = '';
  @Input() sortBy: string = 'created_at';
  @Output() selectNote = new EventEmitter<Note>();
  @Output() editNote = new EventEmitter<Note>();

  notes: Note[] = [];
  loading = true;

  // Remove unused NotesService injection (it was not used in this component)
  ngOnInit() {
    this.loading = false;
    // Should ideally fetch notes from parent
  }

  onSelect(note: Note) {
    this.selectNote.emit(note);
  }

  onEdit(note: Note) {
    this.editNote.emit(note);
  }
}
