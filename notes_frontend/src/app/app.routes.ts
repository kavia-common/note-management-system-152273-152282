import { Routes } from '@angular/router';
import { NotesPageComponent } from './notes/notes-page.component';

export const routes: Routes = [
  { path: '', component: NotesPageComponent },
  { path: '**', redirectTo: '' }
];
