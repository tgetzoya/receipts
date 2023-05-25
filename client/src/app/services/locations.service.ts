import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Location } from "../models/location.model";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  baseurl = 'http://localhost:8080';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http
      .get<Location[]>(this.baseurl + '/locations')
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteLocation(id: number): Observable<void> {
    return this.http
      .delete<void>(this.baseurl + '/location/' + id)
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
