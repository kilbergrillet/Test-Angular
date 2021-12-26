import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MercantilService {

  constructor(private http: HttpClient) { }

  checkUser(user: string): Observable<any> {
    return this.http.get<any>('https://servicios.qamercantilandina.com.ar/api_mock_frontend/v1/usuarios?nombre=' + user);
  }

}
