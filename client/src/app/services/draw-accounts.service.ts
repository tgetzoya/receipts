import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

import { environment } from "../../environment/environment";

import { DrawAccount } from "../models/draw-account.model";
import {DrawAccountSortOrder} from "../enums/draw-account-sort-order";

@Injectable({
  providedIn: 'root'
})
export class DrawAccountsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  createOrUpdateDrawAccount(drawAccount: DrawAccount) : Observable<DrawAccount> {
    if (drawAccount.id) {
      return this.http
        .put<DrawAccount>(environment.baseURL + '/draw-account/' + drawAccount.id, drawAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return this.http
        .post<DrawAccount>(environment.baseURL + '/draw-account', drawAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  getDrawAccounts(order?: DrawAccountSortOrder | undefined): Observable<DrawAccount[]> {
    return this.http
      .get<DrawAccount[]>(environment.baseURL + '/draw-accounts' + (order ? '/' + order : ''))
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteDrawAccount(id: number): Observable<void> {
    return this.http
      .delete<void>(environment.baseURL + '/draw-account/' + id )
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
