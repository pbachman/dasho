import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';
import { UserService } from './core/services/user.service';
import { Router } from '@angular/router';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  menuEnable: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private languageService: LanguageService,
    private pubSub: NgxPubSubService,
    private router: Router,
    private userService: UserService
  ) {
    this.initializeApp();
    this.listenToLoginEvents();

    this.menuEnable = false;

    // decide which menu items should be hidden by current login status stored in local storage
    this.userService.hasLoggedIn()
      .subscribe((hasLoggedIn: boolean) => {
        if (hasLoggedIn) {
          this.router.navigateByUrl('/main');
        }
      });

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    languageService.initialLanguage();

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * Handle the menu visability and headline. Subscribe to the user events
   */
  private listenToLoginEvents(): void {
    this.pubSub.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.pubSub.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  /**
   * Handle the menu visability
   */
  private enableMenu(loggedIn): void {
    this.menuEnable = loggedIn;
  }
}
