import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RootDataService {

  userdata: {} = {};

  constructor() { }

  saveDataUser(user: {}): void {
    this.userdata = user;
    console.log(this.userdata)
  }

}
