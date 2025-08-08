import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from './notes.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css'
})
export class NoteDetailComponent {
  @Input() note?: Note | null;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
