import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  private workspaces;
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

  getWorkspaces() {
    this.apiService.getWorkspaces()
      .subscribe(data => {
        console.log('Retrieved workspaces in getWorkspaces (STORE S.) ', data);
        this.workspaces = data.workspaces;
        console.log('data.workspaces in getWorkspaces ', data.workspaces);
        this.workspaces$.next(data.workspaces);
      });

    //return this.workspaces$;
  }

  addWorkspace(category, wsName) {
    this.apiService.addWorkspace(category, wsName)
      .subscribe(data => {
        console.log('Retrieved data in addWorkspace (STORE S.)', data);
        console.log('old state of workspaces ', this.workspaces);
        this.workspaces$.next([...this.workspaces, data]);
      });
  }

  getEntries(workspaceId) {
    this.apiService.getEntries(workspaceId)
      /* .pipe(map(response => { console.log('data in store service ', response); return this.entries = response }))
      .pipe(tap((entries: any[]) => this.entries$.next(entries))); */
      .subscribe(data => { console.log('in store service ', data); this.entries$.next(data) })

    return this.entries$;
  }
}
