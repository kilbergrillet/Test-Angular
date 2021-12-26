import { Component, OnInit } from '@angular/core';
import { RootDataService } from '../services/root-data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  datailData: any = {};

  constructor(
    private rootDataService: RootDataService
  ) { }

  ngOnInit(): void {
    this.datailData = this.rootDataService.getDataDetail();
  }

  clear(): void {
    this.rootDataService.clear();
  }

}
