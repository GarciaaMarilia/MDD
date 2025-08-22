import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { InitialPageComponent } from './pages/initial-page/initial-page.component';
import { CreateArticleComponent } from './pages/create-article/create-article/create-article.component';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  {
    path: 'initial-page',
    component: InitialPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-article',
    component: CreateArticleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
