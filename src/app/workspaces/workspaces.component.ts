import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent implements OnInit {

  workspaces: Object[];

  constructor(
    private storeService: StoreService
  ) { }

  addingWorkspace: boolean = false;
  metricsArr: Array<String> = [];

  categoryFormControl = new FormControl('', [
    Validators.required,
  ]);

  wsNameFormControl = new FormControl('', [
    Validators.required
  ]);

  metricsLabelFormControl = new FormControl('', [
    Validators.required
  ]);

  showForm() {
    this.addingWorkspace = true;
  }

  addWorkspace() {
    this.storeService.addWorkspace(this.categoryFormControl.value, this.wsNameFormControl.value, this.metricsArr);
  }

  addMetric() {
    this.metricsArr.push(this.metricsLabelFormControl.value);
    this.metricsLabelFormControl.reset('', { onlySelf: true });
  }


  ngOnInit() {
    this.storeService.getWorkspaces()

    this.storeService.workspaces$.subscribe(workspaces => {
      this.workspaces = workspaces;
    });
  }

}