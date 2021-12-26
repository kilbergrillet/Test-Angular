import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeorefService } from '../services/georef.service';
import { Georef } from '../interface/types'
import { MercantilService } from '../services/mercantil.service';
import { RootDataService } from '../services/root-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  @Output('closed') closedStream: EventEmitter<void> | undefined;
  userForm: any;
  controlAutocomplete = new FormControl();
  provinces: Georef[] = [];
  municipality: Georef[] = [];
  saveAllprovinces: Georef[] = [];
  saveAllmunicipality: Georef[] = [];
  switchForm: boolean = false;
  windowsProvinces: boolean = false;
  windowsMunicipality: boolean = false;
  validateUser: boolean = false;
  dataSave: any;

  constructor(
    private formBuilder: FormBuilder,
    private geoirefService: GeorefService,
    private mercantilService: MercantilService,
    private rootDataService: RootDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.dataSave = this.rootDataService.getDataUser();
    this.setValues();
    this.callProvinces();
  }

  setValues(): void {
    this.userForm = this.formBuilder.group({
      dni: [this.dataSave.dni ? this.dataSave.dni : '', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      lastName: [this.dataSave.lastName ? this.dataSave.lastName : '', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      name: [this.dataSave.name ? this.dataSave.name : '', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: [this.dataSave.email ? this.dataSave.email : '', [Validators.required, Validators.email]],
      cellPhone: [this.dataSave.cellPhone ? this.dataSave.cellPhone : '', [Validators.required, Validators.pattern("^[0-9]*$")]],
      telephone: [this.dataSave.telephone ? this.dataSave.telephone : '', [Validators.required, Validators.pattern("^[0-9]*$")]],
      provinces: [this.dataSave.provinces ? this.dataSave.provinces : '', Validators.required],
      municipality: [this.dataSave.municipality ? this.dataSave.municipality : '', Validators.required],
      domicile: [this.dataSave.domicile ? this.dataSave.domicile : '', Validators.required],
      date: [this.dataSave.date ? this.dataSave.date : '', Validators.required],
      user: [this.dataSave.user ? this.dataSave.user : '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: [this.dataSave.password ? this.dataSave.password : '', [Validators.required, Validators.pattern(/(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}/)]],
    });
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
    let calculatedAge = x / 365;

    if (Math.abs(calculatedAge) > 18) {
      this.userForm.get('date').setErrors(null);
    } else {
      this.userForm.get('date').setErrors({ 'incorrect': true });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    } else {
      this.rootDataService.saveDataUser(this.userForm.value);
      this.router.navigate([`/formVehicle`], { relativeTo: this.route });
    }
  }

}
