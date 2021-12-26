import { Component, OnInit } from '@angular/core';
import { RootDataService } from '../services/root-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private rootDataService: RootDataService,
  ) { }

  ngOnInit(): void {
  }

  clear(): void {
    this.rootDataService.clear();
  }
}
