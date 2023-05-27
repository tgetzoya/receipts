import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Receipt } from "../models/receipt.model";

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  baseurl = 'http://localhost:8080';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getReceipts(): Observable<Receipt[]> {
    return this.http
      .get<Receipt[]>(this.baseurl + '/receipts', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createOrUpdateReceipt(receipt: Receipt): Observable<Receipt> {
    if (receipt.id) {
      return this.http.put<Receipt>(this.baseurl + '/receipt/' + receipt.id, receipt, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http.post<Receipt>(this.baseurl + '/receipt', receipt, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  deleteReceipt(id: number): Observable<void> {
    return this.http
      .delete<void>(this.baseurl + '/receipt/' + id, this.httpOptions)
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
