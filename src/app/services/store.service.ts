import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  public workspaces;
  public workspaces$: Subject<any> = new Subject();

  public entries;
  public entries$: Subject<any[]> = new Subject();

  private currentUser: any;
  public currentUser$: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService
  ) { }

  login(email, password) {
    return this.apiService.login(email, password)
      .pipe(map(res => {
        //if successfull login
        if (res.token) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          //setting internal private property
          this.currentUser = res;
          //publishing data for subscribers
          return this.currentUser;
        }
        return res;
      }));
  }

  signup(name ,email, password) {
    return this.apiService.signup(name, email, password)
      .pipe(map(res => {
        //if successfull login
        if (res.token) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          //setting internal private property
          this.currentUser = res;
          //publishing data for subscribers
          return this.currentUser;
        }
        return res;
      }));
  }

  verifyToken() {
    return this.apiService.verifyToken()
      .pipe( map((res: any) => {
        // if token was found
        if (res && res.token) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          //setting internal private property
          this.currentUser = res;
          //publishing data for subscribers
          return this.currentUser;
        }
        return res;
      }));
  }

  getWorkspaces() {
    this.apiService.getWorkspaces()
      .subscribe((data: any) => {
        this.workspaces = data.workspaces;
        this.workspaces$.next(this.workspaces);
      });
  }

  addWorkspace(category, wsName, metricsArr) {
    this.apiService.addWorkspace(category, wsName, metricsArr)
      .subscribe(data => {
        this.workspaces = [...this.workspaces, data];
        this.workspaces$.next(this.workspaces);
      });
  }

  getEntries(workspaceId) {
    this.apiService.getEntries(workspaceId)
      .subscribe(data => {
        console.log('in store service ', data);
        this.entries = data;
        this.entries$.next(data);
      });
  }

  addNewSnapshot(workspaceId, entryId, payload) {
    this.apiService.addNewSnapshot(workspaceId, entryId, payload)
      .subscribe(snapshot => {
        this.entries.filter(entry => entry._id == entryId)[0].snapshots.push(snapshot)
        let index = this.entries.findIndex(entry => entry._id == entryId);
        //updating store
        this.entries[index].snapshots.push(snapshot);
        //publishing
        this.entries$.next(this.entries);
      });
  }
}

/* .pipe(map(response => { console.log('data in store service ', response); return this.entries = response }))
.pipe(tap((entries: any[]) => this.entries$.next(entries))); */