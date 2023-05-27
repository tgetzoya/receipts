import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";

import { DrawAccount } from "../models/draw-account.model";

@Injectable({
  providedIn: 'root'
})
export class DrawAccountsService {
  baseurl = 'http://localhost:8080';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  createOrUpdateDrawAccount(drawAccount: DrawAccount) : Observable<DrawAccount> {
    if (drawAccount.id) {
      return this.http
        .put<DrawAccount>(this.baseurl + '/draw-account/' + drawAccount.id, drawAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http
        .post<DrawAccount>(this.baseurl + '/draw-account', drawAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  getDrawAccounts(): Observable<DrawAccount[]> {
    return this.http
      .get<DrawAccount[]>(this.baseurl + '/draw-accounts')
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteDrawAccount(id: number): Observable<void> {
    return this.http
      .delete<void>(this.baseurl + '/draw-account/' + id )
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
