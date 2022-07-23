import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MainModule } from './modules/main/main.module';
import { CoreModule } from './core/core.module';
import { TilesModule } from './modules/tiles/tiles.module';
import { IonicStorageModule } from '@ionic/storage-angular';

/**
 * Set the paths for the tranlsations
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    MainModule,
    CoreModule,
    TilesModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy, useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
