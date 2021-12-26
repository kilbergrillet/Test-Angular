import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RootDataService {

  userdata: {} = {};
  userVehicle: {} = {};

  constructor() { }

  saveDataUser(user: {}): void {
    this.userdata = user;
  }

  saveDataVehicle(vehicle: {}): void {
    this.userVehicle = vehicle;
  }

  getDataUser() {
    return this.userdata;
  }

  getDataVehicle() {
    return this.userVehicle;
  }

  getDataDetail() {
    let x = { user: this.userdata, vehicle: this.userVehicle };
    return x;
  }

  clear(): void {
    this.userdata = {};
    this.userVehicle = {};
  }

}
