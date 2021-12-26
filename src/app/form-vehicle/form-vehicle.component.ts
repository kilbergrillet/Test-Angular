import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RootDataService } from '../services/root-data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MercantilService } from '../services/mercantil.service';

@Component({
  selector: 'app-form-vehicle',
  templateUrl: './form-vehicle.component.html',
  styleUrls: ['./form-vehicle.component.css']
})
export class FormVehicleComponent implements OnInit {

  userVehicle: any;
  windowsMark: boolean = false;
  windowsModel: boolean = false;
  listMark: any[] = [];
  listModel: any[] = [];
  saveAllMark: any[] = [];
  saveAllModel: any[] = [];
  listCoverage: any[] = [];
  IdMarck: any;
  switchCoverage: boolean = false;
  switchCoverageInfo: boolean = true;
  dataSave: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rootDataService: RootDataService,
    private mercantilService: MercantilService,
  ) { }

  ngOnInit(): void {
    this.dataSave = this.rootDataService.getDataVehicle();
    this.callMark();
    this.setValues();
  }

  setValues(): void {
    this.userVehicle = this.formBuilder.group({
      mark: [this.dataSave.mark ? this.dataSave.mark : '', Validators.required],
      date: [this.dataSave.date ? this.dataSave.date : '', Validators.required],
      model: [this.dataSave.model ? this.dataSave.model : '', Validators.required],
      version: [this.dataSave.version ? this.dataSave.version : '', Validators.required],
      coverage: [this.dataSave.coverage ? this.dataSave.coverage : '', Validators.required],
    });
  }

  formValidation(input: string): any {
    return this.userVehicle.get(input)?.invalid;
  }

  selectDate(event: any): void {
    let dateSelect: any = this.userVehicle.get('date').value;
    let currentDate: any = new Date();
    let msDay = 60 * 60 * 24 * 1000;
    let x = Math.floor((dateSelect - currentDate) / msDay);
    let calculatedAge = x / 360;

    if (Math.abs(calculatedAge) < 20) {
      this.userVehicle.get('date').setErrors(null);
    } else {
      this.userVehicle.get('date').setErrors({ 'incorrect': true });
    }

    let date = this.userVehicle.get('date').value.getFullYear();

    this.mercantilService.getModel(this.IdMarck, date).subscribe((response) => {
      this.saveAllModel = response
      this.listModel = this.saveAllModel;
    })

    this.callCoverage();
  }

  callCoverage(): void {
    this.mercantilService.getCoverage().subscribe((result) => {
      this.listCoverage = result;
      this.switchCoverage = true;
    })
  }

  callMark(): void {
    this.mercantilService.getMark().subscribe((response) => {
      this.saveAllMark = response
      this.listMark = this.saveAllMark;
    })
  }

  sendMark(event: any): void {
    this.windowsMark = true;
  }

  optionMark(option: any): void {
    this.userVehicle.get('mark').setValue(option.desc);
    this.IdMarck = option.codigo;
    this.windowsMark = false;
  }

  optionModel(option: any): void {
    this.userVehicle.get('model').setValue(option);
    this.windowsModel = false;
  }

  autocomplete(event: any, option: string) {
    switch (option) {
      case 'mark':
        if (event.target.value) {
          this.windowsMark = true;
          this.listMark = this.saveAllMark.filter(iten => iten.desc.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1)
        } else {
          this.windowsMark = false;
        }
        break;

      case 'model':
        if (event.target.value) {
          this.windowsModel = true
          this.listModel = this.saveAllModel.filter(iten => iten.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1)
        } else {
          this.windowsModel = false
        }
        break;
    }
  }

  sendCoverage(options: any): void {
    this.userVehicle.get('coverage').setValue(options.texto);
    this.switchCoverageInfo = false;
  }

  onSubmit(): void {
    if (this.userVehicle.invalid) {
      return;
    } else {
      this.rootDataService.saveDataVehicle(this.userVehicle.value);
      this.router.navigate([`/detail`], { relativeTo: this.route });
    }
  }

}
