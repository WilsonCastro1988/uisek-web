import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url;

  constructor(
    private http: HttpClient
  ) {
    this.url = 'https://servicio-uisek-admin.herokuapp.com/';
  }

  /**EMAIL */
  notificarRegistro(email): Observable<any> {
    return this.http.post<any>(this.url + 'servicio-email/notificarRegistro', email);
  }

  notificarContacto(email): Observable<any> {
    return this.http.post<any>(this.url + 'servicio-email/notificarContacto', email);
  }
  /**FIN SERVICIO EMAIL */



}
