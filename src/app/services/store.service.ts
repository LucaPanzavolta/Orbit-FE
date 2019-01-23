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
  private entries$: Subject<any[]> = new Subject();

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
      .subscribe(data => { console.log('in store service ', data); this.entries$.next(data) });
    return this.entries$;
  }
}

/* .pipe(map(response => { console.log('data in store service ', response); return this.entries = response }))
.pipe(tap((entries: any[]) => this.entries$.next(entries))); */