import { Injectable } from '@angular/core';
import { catchError, retry } from "rxjs/operators";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Schedule } from "../models/schedule.model";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getScheduledTasks(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(environment.baseURL + '/schedule', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getScheduleById(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(environment.baseURL + '/schedule/byId/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getScheduleByLocationId(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(environment.baseURL + '/schedule/byLocationId/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getScheduleIntervals(): Observable<any> {
    return this.http.get<any>(environment.baseURL + '/schedule/intervals', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(environment.baseURL + '/schedule', schedule, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(environment.baseURL + '/schedule/' + schedule.id, schedule, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteSchedule(id: number | undefined): Observable<void> {
    return this.http.delete<void>(environment.baseURL + '/schedule/' + id, this.httpOptions)
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
