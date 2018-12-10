import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, MenuController, NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { UserProvider } from '../providers/user';
import { LanguageProvider } from '../providers/language';
import { DashboardService } from '../pages/main/main.service';

@Component({
  templateUrl: 'app.html'
})

/**
 * Represent the dasho app
 */
export class DashoApp {
  @ViewChild('content') nav: NavController;
  rootPage: Object = LoginPage;
  menuEnable: boolean;
  currentUser: string;

  /**
   * Create the dasho app
   * @param  {LanguageProvider} privatelanguageProvider
   * @param  {UserData}         privateuserData
   * @param  {Events}           privateevents
   * @param  {AlertController}  privatealertCtrl
   * @param  {MenuController}   privatemenuCtrl
   * @param  {DashboardService} privatedashboardService
   */
  constructor(
    private languageProvider: LanguageProvider,
    private userData: UserProvider,
    private events: Events,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private dashboardService: DashboardService
  ) {
    this.menuEnable = false;

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn()
      .subscribe((hasLoggedIn: boolean) => {
        this.enableMenu(hasLoggedIn === true);

        if (hasLoggedIn) {
          this.nav.push(MainPage);
          this.userData.getUsername()
            .subscribe((username: string) => {
              this.currentUser = username;
            });
        }
      });

    languageProvider.initialLanguage();
    this.listenToLoginEvents();
  }

  /**
   * Log the user out and go back to the login page
   */
  logout(): void {
    this.menuCtrl.close();
    this.userData.logout();
    this.nav.pop();
    document.body.classList.remove('body-loading');
  }

  /**
   * Publish the change language event
   */
  changeLanguage(): void {
    const data = {
      key: this.languageProvider.currentLanguage
    };
    this.events.publish('user:language', data);
  }

  /**
   * Shows the dialog to change the password
   */
  showChangePasswortPrompt(): void {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = this.alertCtrl.create({
      title: i18n.changePassword.title,
      message: i18n.changePassword.message,
      inputs: [
        {
          name: 'passwordOld',
          placeholder: i18n.changePassword.passwordOld,
          type: 'password'
        }, {
          name: 'password',
          placeholder: i18n.changePassword.password,
          type: 'password'
        }, {
          name: 'passwordConfirm',
          placeholder: i18n.changePassword.passwordConfirm,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: i18n.general.cancel,
          role: 'cancel'
        },
        {
          text: i18n.changePassword.change,
          handler: data => {
            if (!data.passwordOld || !data.password || data.password !== data.passwordConfirm)
              return false;

            this.dashboardService.changePassword(this.currentUser, data.passwordOld, data.password, data.passwordConfirm)
              .subscribe(() => {
                const alert = this.alertCtrl.create({
                  title: i18n.changePassword.alertTitle,
                  subTitle: i18n.changePassword.alertSubTitle,
                  buttons: ['OK']
                });
                alert.present();

                return true;
              }, (error: string) => {

                return false;
              });
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Shows the dialog to invite a friend
   */
  inviteFriendPrompt(): void {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = this.alertCtrl.create({
      title: i18n.invite.title,
      message: i18n.invite.message,
      inputs: [
        {
          name: 'email',
          placeholder: i18n.general.email,
          type: 'text'
        }
      ],
      buttons: [
        {
          text: i18n.general.cancel,
          role: 'cancel'
        },
        {
          text: i18n.invite.send,
          handler: data => {
            if (this.userData.isMailInvalid(data.email))
              return false;

            this.dashboardService.inviteFriends(this.currentUser, data.email)
              .subscribe(() => {
                const alert = this.alertCtrl.create({
                  title: i18n.invite.alertTitle,
                  subTitle: i18n.invite.alertSubTitle.replace('%email%', data.email),
                  buttons: ['OK']
                });
                alert.present();

                return true;
              }, (error: string) => {

                return false;
              });
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Handle the menu visability and headline. Subscribe to the user events
   */
  private listenToLoginEvents(): void {
    this.events.subscribe('user:login', username => {
      this.enableMenu(true);
      this.currentUser = username;
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  /**
   * Handle the menu visability
   * @param {boolean} loggedIn
   */
  private enableMenu(loggedIn): void {
    this.menuEnable = loggedIn;
  }
}
