import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { WorkspacesComponent } from '../app/workspaces/workspaces.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkspaceDetailComponent } from './workspace-detail/workspace-detail.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'dashboard', component: WorkspacesComponent },
  { path: 'dashboard/:id', component: WorkspaceDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
