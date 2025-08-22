import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AppInitService } from './services/AppInit/app-init.service';
import { HeaderComponent } from './components/header/header.component';
import { CardComponent } from './components/article-card/card.component';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { InitialPageComponent } from './pages/initial-page/initial-page.component';
import { CreateArticleComponent } from './pages/create-article/create-article/create-article.component';
import { TopicsComponent } from './pages/topics/topics.component';

export function appInitializerFactory(appInitService: AppInitService) {
  return () => appInitService.init();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InscriptionComponent,
    HeaderComponent,
    InitialPageComponent,
    CreateArticleComponent,
    ProfileComponent,
    CardComponent,
    TopicsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
