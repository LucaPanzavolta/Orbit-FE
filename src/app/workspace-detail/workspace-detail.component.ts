import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html',
  styleUrls: ['./workspace-detail.component.css']
})
export class WorkspaceDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) { }

  id: String;
  entries: Array<any>;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: false
  };
  public barChartType = 'line';
  public barChartData;
  public barChartLabels;
  public barChartLegend = true;

  addingSnapshot: boolean = false;
  comparing: boolean = false;

  getEntries(): void {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.storeService.getEntries(id)
      .subscribe(res => {
        console.log('Entries in dashboard detail', res);
        this.entries = res;
      });
  }

  showGraph(ent) {
    console.log(ent);
    //manipulation to prepare data for chart.js
    let dataY = ent.snapshots.map(snap => snap.enablers[0].score);

    //for every metric generate a data array
    let dataX = ent.snapshots.map(el => moment(el.date).format("Do MMM YY"));

    console.log('x and y ', dataX, dataY);

    this.barChartData = [
      { data: dataY, label: 'first person' }
    ];

    this.barChartLabels = dataX;
  }

  compare(ent) {
    console.log('In function compare');
    if (!this.comparing) return;

    let dataY = ent.snapshots.map(snap => snap.enablers[0].score);
    let dataX = ent.snapshots.map(el => moment(el.date).format("Do MMM YY"));

    this.barChartData = [...this.barChartData, {
      data: dataY, label: 'second person'
    }];

    console.log('updated data', this.barChartData);
  }

  addSnapshot(ent) {
    this.addingSnapshot = ent;

  }

  ngOnInit() {
    this.getEntries();
  }
}
