import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainPage } from './components/main/main';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';
import { TilesModule } from '../tiles/tiles.module';
import { LoginPage } from './components/login/login';

@NgModule({
  imports: [
    CoreModule,
    TilesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'main', component: MainPage },
      { path: 'login', component: LoginPage },
    ]),
    TranslateModule.forRoot(),
  ],
  declarations: [
    MainPage,
    LoginPage
  ],
})
export class MainModule { }
