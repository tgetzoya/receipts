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

  createOrUpdateLocation(location: Location) : Observable<Location> {
    if (location.id) {
      return this.http
        .put<Location>(this.baseurl + '/location/' + location.id, location, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http
        .post<Location>(this.baseurl + '/location', location, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  getLocations(): Observable<Location[]> {
    return this.http
      .get<Location[]>(this.baseurl + '/locations', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteLocation(id: number): Observable<void> {
    return this.http
      .delete<void>(this.baseurl + '/location/' + id, this.httpOptions)
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
