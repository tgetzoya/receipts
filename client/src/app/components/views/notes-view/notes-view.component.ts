import { Component, Input, OnChanges } from '@angular/core';
import { Note } from "../../../models/note.model";
import { NotesService } from "../../../services/notes.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-notes-view',
  templateUrl: './notes-view.component.html',
  styleUrls: ['./notes-view.component.css']
})
export class NotesViewComponent implements OnChanges {
  notes?: Note[];
  @Input() receiptId?: number;

  inputControl = new FormControl('');

  editable?: number;

  constructor(public notesService: NotesService) {}

  ngOnChanges() {
    if (this.receiptId) {
      this.notesService.getNotes(this.receiptId!).subscribe(resp => this.notes = resp);
    } else {
      console.log("No receiptId given");
    }
  }

  protected toggleEditable(note: Note): void {
    this.editable = note.id;
    this.inputControl.setValue(note ? note.note! : '');
  }

  protected checkForEscapes(event: KeyboardEvent, note: Note): void {
    if (event.key === "Escape") {
      this.inputControl.setValue(note.note ? note.note! : '');
      this.editable = -1;
      this.notes = this.notes?.filter(n => n.id! > 0);
    } else if (event.key === "Enter") {
      this.createOrUpdateNote(note);
    }
  }

  protected createOrUpdateNote(note: Note): void {
    note.note = this.inputControl.value!;

    if (!note.note || note.note == '') {
      this.editable = -1;
      return;
    }

    if (note.id! > 0) {
      this.notesService.updateNote(note).subscribe(resp => {
        this.editable = -1;
        this.notes = this.notes?.filter(n => n.id! != note.id!);
      });
    } else {
      note.id = undefined;
      this.notesService.createNote(note).subscribe(resp => {
        this.editable = -1;
        this.notes = this.notes?.filter(n => n.id! != note.id!);
      });
    }
  }

  protected createNewNote(): void {
    let note: Note = new Note();
    note.id = -1;
    note.receiptId = this.receiptId;
    note.note = '';

    this.notes?.push(note);
    this.toggleEditable(note);
  }

  protected removeNote(note: Note): void {
    if (note.id! < 0) {
      this.notes = this.notes?.filter(n => n.id! != note.id!);
      return;
    }

    this.notesService.deleteNote(note.id!).subscribe(resp => {
      this.notes = this.notes?.filter(n => n.id! != note.id!);
    });
  }
}
