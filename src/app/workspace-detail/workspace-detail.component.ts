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
  addingSnapshot: any = false;
  metricLabels: Array<any>;

  showCorrectGraphFormControl = new FormControl('', [
    Validators.required,
  ]);
  dateFormControl = new FormControl('', [
    Validators.required
  ]);
  scoreFormControl = new FormControl('', [
    Validators.required
  ]);
  metricForSnapshotFormControl = new FormControl('', [
    Validators.required
  ]);
  commentFormControl = new FormControl('', [
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
    this.storeService.getEntries(id);
    this.storeService.entries$.subscribe(res => this.entries = res);
  }

  showGraph(ent, metric) {
    if (ent) this.selectedEntity = ent;
    if (!ent) ent = this.selectedEntity;

    //Check which metric the user wants to compare the entities against
    let metricToRender = metric ? metric.value : this.metricLabels[0];
    console.log('Showing graph for metric', metricToRender);

    //Particular case from metric ALL - the data has to be manipulated differently
    if (metricToRender === "All") {
      let allMetricsArr = [];
      let dataY = {}
      ent.snapshots.forEach(snap => !allMetricsArr.includes(snap.label) && allMetricsArr.push(snap.label));

      allMetricsArr.forEach((label, index) => {
        let correctSnaps = ent.snapshots.filter(snap => snap.label === label);
        dataY[`${label}`] = [correctSnaps.shift().score, correctSnaps.pop().score];

        this.barChartData[index] = { data: dataY[`${label}`], label: label }
      });

      this.barChartLabels = ["Beginning", "End"];

      console.log('THIS.BARCHARTDATA & THIS.BARCHARTLABELS', this.barChartData, this.barChartLabels);
    } else {
      //We enter this block of code if the metricToRender is not "All"

      //manipulation to prepare data for chart.js
      let snapToShow = ent.snapshots.filter(snap => snap.label.toLowerCase() === metricToRender.toLowerCase());
      let dataY = snapToShow.map(snap => snap.score);
      let dataX = snapToShow.map(snap => moment(snap.date).format("Do MMM YY"));

      console.log('x and y ', dataX, dataY);

      if (this.barChartData) {
        if (this.barChartData[1]) this.barChartData.splice(1, 1);
        this.barChartData[0].data = dataY;
        this.barChartData[0].label = metricToRender;
        this.barChartLabels = dataX;
      } else {
        this.barChartData = [
          { data: dataY, label: metricToRender }
        ];
        this.barChartLabels = dataX;
      }
    }
  }

  renderAddSnapshotCard(ent) {
    this.addingSnapshot = ent;
  }

  addNewSnapshot() {
    //read all form fields
    let date = this.dateFormControl.value;
    let label = this.metricForSnapshotFormControl.value;
    let score = this.scoreFormControl.value;
    let comment = this.commentFormControl.value;
    let payload = {
      date,
      label,
      score,
      comment
    };

    //passing workspace Id, entry Id and payload
    this.storeService.addNewSnapshot(this.id, this.addingSnapshot._id, payload);
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
