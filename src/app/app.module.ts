import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MomentModule } from 'angular2-moment';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Http } from '@angular/http';
import { HighchartsChartModule } from 'highcharts-angular';

import { LoginService } from '../pages/login/login.service';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user';
import { LanguageProvider } from '../providers/language';
import { DashboardService } from '../pages/main/main.service';
import { MainPage } from '../pages/main/main';
import { ArraySort } from '../shared/shared.sort';
import { SettingPage } from '../pages/setting/setting';
import { SettingService } from '../pages/setting/setting.service';
import { TilePage } from '../pages/tile/tile';
import { TileService } from '../pages/tile/tile.service';

import { DashoApp } from './app.component';
import { Clock } from './tiles/clock/clock';
import { Currency } from './tiles/currency/currency';
import { Github } from './tiles/github/github';
import { News } from './tiles/news/news';
import { Google } from './tiles/google/google';
import { Twitter } from './tiles/twitter/twitter';
import { Weather } from './tiles/weather/weather';

/**
 * Set the paths for the tranlsations
 */
export function createTranslateLoader(http: Http): TranslateStaticLoader {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    DashoApp,
    LoginPage,
    MainPage,
    SettingPage,
    TilePage,
    Clock,
    Currency,
    Github,
    News,
    Google,
    Twitter,
    Weather,
    ArraySort
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    MomentModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(DashoApp),
    HighchartsChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DashoApp,
    LoginPage,
    MainPage,
    SettingPage,
    TilePage
  ],
  providers: [
    UserProvider,
    LanguageProvider,
    DashboardService,
    SettingService,
    LoginService,
    TileService
  ]
})

/**
 * Represents the App Module
 */
export class AppModule { }
