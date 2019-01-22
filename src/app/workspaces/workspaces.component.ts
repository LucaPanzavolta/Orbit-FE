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

  categoryFormControl = new FormControl('', [
    Validators.required,
  ]);

  wsNameFormControl = new FormControl('', [
    Validators.required
  ]);

  showForm() {
    this.addingWorkspace = true;
  }

  addWorkspace() {
    this.storeService.addWorkspace(this.categoryFormControl.value, this.wsNameFormControl.value)
  }


  ngOnInit() {
    this.storeService.getWorkspaces()
    /*  .subscribe(workspaces => this.workspaces = workspaces); */

    this.storeService.workspaces$.subscribe(workspaces => {
      console.log('New workspaces received in component ', workspaces);
      this.workspaces = workspaces;
    });
  }

}