import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Note } from "../models/note.model";
import { environment } from "../../environment/environment";
import { catchError, retry } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getNotes(receiptId: number): Observable<Note[]> {
    return this.http.get<Note[]>(environment.baseURL + '/notes/' + receiptId, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(environment.baseURL + '/note', note, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(environment.baseURL + '/note', note, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(environment.baseURL + '/note/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => {
      return errorMessage;
    });
  }
}
