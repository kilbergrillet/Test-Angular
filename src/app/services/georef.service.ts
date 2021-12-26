import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeorefService {

  constructor(private http: HttpClient) {
  }

  provinces(): Observable<any> {
    return this.http.get<any>('https://apis.datos.gob.ar/georef/api/provincias');
  }

  municipality(id: any): Observable<any> {
    return this.http.get<any>('https://apis.datos.gob.ar/georef/api/municipios?provincia=' + id + '&campos=id,nombre&max=135');
  }

}
