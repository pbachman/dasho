import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainPage } from './main';
import { LoginPage } from '../login/login';
import { ClockTileComponent } from '../tiles/clock/clock';
import { GithubTileComponent } from '../tiles/github/github';
import { WeatherTileComponent } from '../tiles/weather/weather';
import { WiewarmTileComponent } from '../tiles/wiewarm/wiewarm';
import { CurrencyTileComponent } from '../tiles/currency/currency';
import { GoogleTileComponent } from '../tiles/google/google';
import { NewsTileComponent } from '../tiles/news/news';
import { TwitterTileComponent } from '../tiles/twitter/twitter';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { HighchartsChartModule } from 'highcharts-angular';
import { LoginService } from '../login/login.service';
import { DashboardService } from './main.service';
import { SettingService } from '../admin/setting/setting.service';

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
    ClockTileComponent,
    CurrencyTileComponent,
    GithubTileComponent,
    GoogleTileComponent,
    NewsTileComponent,
    TwitterTileComponent,
    WeatherTileComponent,
    WiewarmTileComponent
  ],
  providers: [
    DashboardService,
    LoginService,
    SettingService
  ],
})
export class MainPageModule { }
