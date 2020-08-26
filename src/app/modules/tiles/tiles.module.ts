import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ClockTileComponent } from './components/clock/clock';
import { CurrencyTileComponent } from './components/currency/currency';
import { GithubTileComponent } from './components/github/github';
import { GoogleTileComponent } from './components/google/google';
import { NewsTileComponent } from './components/news/news';
import { TwitterTileComponent } from './components/twitter/twitter';
import { WeatherTileComponent } from './components/weather/weather';
import { WiewarmTileComponent } from './components/wiewarm/wiewarm';
import { HighchartsChartModule } from 'highcharts-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HighchartsChartModule,
    TranslateModule.forRoot(),
  ],
  exports: [
    ClockTileComponent,
    CurrencyTileComponent,
    GithubTileComponent,
    GoogleTileComponent,
    NewsTileComponent,
    TwitterTileComponent,
    WeatherTileComponent,
    WiewarmTileComponent
  ],
  declarations: [
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
  ]
})
export class TilesModule {}
