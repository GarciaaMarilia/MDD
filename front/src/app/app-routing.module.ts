import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TopicsComponent } from './pages/topics/topics.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { CreateArticleComponent } from './pages/create-article/create-article/create-article.component';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  {
    path: 'articles',
    component: ArticlesComponent,
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
  {
    path: 'topics',
    component: TopicsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
