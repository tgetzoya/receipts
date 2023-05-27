import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from "../../environment/environment";

import { Location } from "../models/location.model";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  createOrUpdateLocation(location: Location) : Observable<Location> {
    if (location.id) {
      return this.http
        .put<Location>(environment.baseURL + '/location/' + location.id, location, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http
        .post<Location>(environment.baseURL + '/location', location, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  getLocations(): Observable<Location[]> {
    return this.http
      .get<Location[]>(environment.baseURL + '/locations', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteLocation(id: number): Observable<void> {
    return this.http
      .delete<void>(environment.baseURL + '/location/' + id, this.httpOptions)
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
