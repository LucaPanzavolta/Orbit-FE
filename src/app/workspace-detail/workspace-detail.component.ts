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
  selectedEntity: any;
  addingSnapshot: boolean = false;
  comparing: boolean = false;
  metricLabels: Array<any>;

  showCorrectGraphFormControl = new FormControl('', [
    Validators.required,
  ]);

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType: string = 'bar';
  public barChartLabels: string[];
  public barChartData: any[];
  public barChartLegend = true;

  getEntries(): void {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.storeService.getEntries(id)
      .subscribe(res => {
        this.entries = res;
      });
  }

  showGraph(ent, metric) {
    if (ent) this.selectedEntity = ent;
    ent = ent ? ent : this.selectedEntity;

    //Check which metric the user wants to compare the entities against
    let metricToRender = metric ? metric.value : this.metricLabels[0];
    console.log('Showing graph for metric', metricToRender);

    //manipulation to prepare data for chart.js
    let snapToShow = ent.snapshots.filter(snap => snap.label.toLowerCase() === metricToRender.toLowerCase());
    let dataY = snapToShow.map(snap => snap.score);
    let dataX = snapToShow.map(snap => moment(snap.date).format("Do MMM YY"));

    console.log('x and y ', dataX, dataY);

    if (this.barChartData) {
      this.barChartData[0].data = dataY;
      this.barChartLabels = dataX;
    } else {
      this.barChartData = [
        { data: dataY, label: metricToRender }
      ];
      this.barChartLabels = dataX;
    }
  }

  addSnapshot(ent) {
    this.addingSnapshot = ent;
  }

  getMetricLabels() {
    let id = this.id = this.route.snapshot.paramMap.get('id');
    this.metricLabels = this.storeService.workspaces.filter(el => el._id == id)[0][`metricLabels`];
  }

  ngOnInit() {
    this.getEntries();
    this.getMetricLabels();
  }
}



/* compare(ent) {
  console.log('In function compare');
  if (!this.comparing) return;

  let dataY = ent.snapshots.map(snap => snap.enablers[0].score);
  let dataX = ent.snapshots.map(el => moment(el.date).format("Do MMM YY"));

  this.barChartData = [...this.barChartData, {
    data: dataY, label: 'second person'
  }];

  console.log('updated data', this.barChartData);
} */