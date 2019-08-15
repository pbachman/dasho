import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainPage } from './main';
import { LoginPage } from '../login/login';
import { Clock } from '../tiles/clock/clock';
import { Github } from '../tiles/github/github';
import { Weather } from '../tiles/weather/weather';
import { Wiewarm } from '../tiles/wiewarm/wiewarm';
import { Currency } from '../tiles/currency/currency';
import { Google } from '../tiles/google/google';
import { News } from '../tiles/news/news';
import { Twitter } from '../tiles/twitter/twitter';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { HighchartsChartModule } from 'highcharts-angular';
import { SettingService } from '../admin/setting/setting.service';
import { LoginService } from '../login/login.service';
import { DashboardService } from './main.service';
import { UserService } from '../shared/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    HighchartsChartModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPage },
      { path: 'main', component: MainPage },
      { path: '', component: MainPage },
    ]),
    TranslateModule.forRoot(),
  ],
  declarations: [
    MainPage,
    LoginPage,
    Clock,
    Currency,
    Github,
    Google,
    News,
    Twitter,
    Weather,
    Wiewarm
  ],
  providers: [
    DashboardService,
    SettingService,
    LoginService,
    UserService
  ],
})
export class MainPageModule { }
