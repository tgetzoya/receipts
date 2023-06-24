import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Note } from "../../../models/note.model";
import { NotesService } from "../../../services/notes.service";

@Component({
  selector: 'app-notes-view',
  templateUrl: './notes-view.component.html',
  styleUrls: ['./notes-view.component.css']
})
export class NotesViewComponent implements OnInit {
  @Input() receiptId?: number;

  inputControl = new FormControl('');

  editable?: number;
  loading?: boolean;
  notes?: Note[];

  constructor(public notesService: NotesService) {}

  ngOnInit() {
    if (this.receiptId) {
      this.loading = true;
      this.notesService.getNotes(this.receiptId!).subscribe(resp => {
        this.notes = resp;
        this.loading = false;
      });
    } else {
      this.notes = [];
      this.resetNotesState();
    }
  }

  toggleEditable(note: Note): void {
    this.editable = note.id;
    this.inputControl.setValue(note ? note.note! : '');
  }

  checkForEscapes(event: KeyboardEvent, note: Note): void {
    if (event.key === "Escape") {
      this.inputControl.setValue(note.note ? note.note! : '');
      this.resetNotesState();
    } else if (event.key === "Enter") {
      this.saveNote(note);
    }
  }

  saveNote(note: Note): void {
    note.note = this.inputControl.value!;

    if (!note.note || note.note == '') {
      this.editable = -1;
      return;
    }

    if (!this.receiptId) {
      this.notes?.push(note);
    } else {
      if (note.id! > 0) {
        this.notesService.updateNote(note).subscribe(resp => {
          note = resp;
          this.resetNotesState();
        });
      } else {
        /* Be 100% sure that we are not using an id for the note. */
        note.id = undefined;
        this.notesService.createNote(note).subscribe(resp => {
          this.notes?.pop();
          this.notes?.push(resp);

          this.resetNotesState();
        });
      }
    }
  }

  createNewNote(): void {
    /* Don't add a second new note if there already is a first one. */
    if (this.notes!.length > 0 && this.notes?.at(-1)!.id == -1) {
      return;
    }

    let note: Note = new Note();
    note.id = -1;
    note.receiptId = this.receiptId ? this.receiptId : undefined;

    if (!this.notes) {
      this.notes = [];
    }

    this.notes!.push(note);
    this.toggleEditable(note);
  }

  removeNote(note: Note): void {
    if (this.receiptId && note.id! > -1) {
      this.notesService.deleteNote(note.id!).subscribe(() => {
        this.notes = this.notes?.filter(n => n.id! != note.id!);
      });
    } else {
      this.resetNotesState();
    }
  }

  resetNotesState(): void {
    this.editable = -1;
    this.loading = false;
    this.notes = this.notes?.filter(n => n.id! > -1);
  }

  getNotes(): Note[] {
    return this.notes!;
  }
}
