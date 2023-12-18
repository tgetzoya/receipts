import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from "../../environment/environment";

import { Receipt } from "../models/receipt.model";

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getReceiptYears(): Observable<number[]> {
    return this.http
      .get<number[]>(environment.baseURL + '/receipts/years', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getReceipts(year: string): Observable<Receipt[]> {
    return this.http
      .get<Receipt[]>(environment.baseURL + '/receipts/' + year, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getReceiptsByDateAndLocation(date: string, locationId: any): Observable<Receipt[]> {
    return this.http
      .get<Receipt[]>(environment.baseURL + '/receipts/date/' + date + '/location/' + locationId, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createOrUpdateReceipt(receipt: Receipt): Observable<Receipt> {
    if (receipt.id) {
      return this.http.put<Receipt>(environment.baseURL + '/receipt/' + receipt.id, receipt, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http.post<Receipt>(environment.baseURL + '/receipt', receipt, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  deleteReceipt(id: number): Observable<void> {
    return this.http
      .delete<void>(environment.baseURL + '/receipt/' + id, this.httpOptions)
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
