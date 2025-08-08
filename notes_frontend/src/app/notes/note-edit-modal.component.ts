import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './notes.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-edit-modal.component.html',
  styleUrl: './note-edit-modal.component.css'
})
export class NoteEditModalComponent {
  @Input() note?: Note | null = null; // null signifies "create new"
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ title: string; content: string }>();

  title: string = '';
  content: string = '';

  ngOnInit() {
    this.title = this.note?.title || '';
    this.content = this.note?.content || '';
  }

  onSave() {
    if (this.title.trim() && this.content.trim()) {
      this.save.emit({ title: this.title.trim(), content: this.content.trim() });
    }
  }
}
