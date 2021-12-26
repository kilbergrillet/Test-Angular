import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeorefService } from '../services/georef.service';
import { Georef } from '../interface/types'
import { MercantilService } from '../services/mercantil.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  @Output('closed') closedStream: EventEmitter<void> | undefined;

  userForm: any = this.formBuilder.group({
    dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
    email: ['', [Validators.required, Validators.email]],
    cellPhone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    telephone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    provinces: ['', Validators.required],
    municipality: ['', Validators.required],
    domicile: ['', Validators.required],
    date: ['', Validators.required],
    user: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.pattern(/(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}/)]],
  });

  controlAutocomplete = new FormControl();
  provinces: Georef[] = [];
  municipality: Georef[] = [];
  saveAllprovinces: Georef[] = [];
  saveAllmunicipality: Georef[] = [];
  switchForm: boolean = false;
  windowsProvinces: boolean = false;
  windowsMunicipality: boolean = false;
  validateUser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private geoirefService: GeorefService,
    private mercantilService: MercantilService
  ) {
  }

  ngOnInit(): void {
    this.callProvinces();
  }

  formValidation(input: string): any {
    return this.userForm.get(input)?.invalid;
  }

  callProvinces(): void {
    this.geoirefService.provinces().subscribe((response) => {
      this.saveAllprovinces = response.provincias;
      this.provinces = this.saveAllprovinces;
    });
  }

  optionProvinces(element: any): void {
    this.userForm.get('provinces').setValue(element.nombre);
    this.windowsProvinces = false;
    this.geoirefService.municipality(element.id).subscribe((response) => {
      this.saveAllmunicipality = response.municipios;
      this.municipality = this.saveAllmunicipality;
    });

  }

  optionMunicipality(element: any): void {
    this.userForm.get('municipality').setValue(element.nombre);
    this.userForm.value.municipality = element.nombre;
    this.windowsMunicipality = false;
  }

  autocomplete(event: any, option: string) {
    switch (option) {
      case 'provinces':
        if (event.target.value) {
          this.windowsProvinces = true;
          this.provinces = this.filterAutocomplete(this.saveAllprovinces, event.target.value)
        } else {
          this.windowsProvinces = false;
        }
        break;

      case 'municipality':
        if (event.target.value) {
          this.windowsMunicipality = true
          this.municipality = this.filterAutocomplete(this.saveAllmunicipality, event.target.value)
        } else {
          this.windowsMunicipality = false
        }
        break;
    }
  }

  filterAutocomplete(saveArray: Georef[], value: string): Georef[] {
    let x = [];
    return x = saveArray.filter(iten => iten.nombre.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  verifyUser(event: any): void {
    if (event.target.value) {
      this.mercantilService.checkUser(event.target.value).subscribe((response) => {
        this.validateUser = response;
        if (this.validateUser) {
          this.userForm.get('user').setErrors({ 'incorrect': true });
        } else {
          this.userForm.get('user').setErrors(null);
        }
      });
    }
  }


  selectDate(event: any): void {
    let dateSelect: any = this.userForm.get('date').value;
    let currentDate: any = new Date();
    let msDay = 60 * 60 * 24 * 1000;
    let x = Math.floor((dateSelect - currentDate) / msDay);
    let calculatedAge = x / 360;

    if (Math.abs(calculatedAge) > 18) {
      this.userForm.get('date').setErrors(null);
    } else {
      this.userForm.get('date').setErrors({ 'incorrect': true });
    }
  }

}
