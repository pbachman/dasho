import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { AlertController, MenuController, Events } from '@ionic/angular';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';
import { DashboardService } from '../main/main.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'dasho-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  currentUser: User;
  settings: any;

  constructor(
    private languageProvider: LanguageService,
    private alertCtrl: AlertController,
    private userprovider: UserService,
    private dashboardService: DashboardService,
    private router: Router,
    private menuCtrl: MenuController,
    private events: Events
  ) {
    this.events.subscribe('user:login', user => {
      this.currentUser = user;
    });
  }

  ngOnInit() { }

  /**
   * Shows the dialog to change the password
   */
  async showChangePasswortPrompt(): Promise<void> {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.changePassword.title,
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
            if (!data.passwordOld || !data.password || data.password !== data.passwordConfirm) {
              return false;
            }

            this.dashboardService.changePassword(this.currentUser.username, data.passwordOld, data.password, data.passwordConfirm)
              .subscribe(async () => {
                const alert = await this.alertCtrl.create({
                  header: i18n.changePassword.alertTitle,
                  subHeader: i18n.changePassword.alertSubTitle,
                  buttons: ['OK']
                });
                await alert.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error!',
                  message: error.error,
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await alert.present();

                return false;
              });
          }
        }
      ]
    });
    await prompt.present();
  }

  /**
   * Shows the dialog to invite a friend
   */
  async inviteFriendPrompt(): Promise<void> {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.invite.title,
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
          handler: async data => {
            if (this.userprovider.isMailInvalid(data.email)) {
              const alert = await this.alertCtrl.create({
                header: i18n.forgetPassword.alertInvalidTitle,
                subHeader: i18n.forgetPassword.alertInvalid,
                buttons: ['OK']
              });
              await alert.present();

              return false;
            }

            this.dashboardService.inviteFriends(this.currentUser.username, data.email)
              .subscribe(async () => {
                const alert = await this.alertCtrl.create({
                  header: i18n.invite.alertTitle,
                  subHeader: i18n.invite.alertSubTitle.replace('%email%', data.email),
                  translucent: true,
                  buttons: ['OK']
                });
                await alert.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error!',
                  message: error.error,
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await alert.present();

                return false;
              });
          }
        }
      ]
    });
    await prompt.present();
  }

  /**
   * Shows the Settings dialog
   */
  configureTileSettings(): void {
    this.dashboardService.getSettings(this.currentUser.username)
      .subscribe((settings: any) => {
        this.settings = settings;
        this.menuCtrl.close();
        this.router.navigateByUrl('/admin');
      });
  }

  /**
   * Shows the Tiles dialog
   */
  configureTiles(): void {
    this.menuCtrl.close();
    this.router.navigateByUrl('/tile');
  }

  /**
   * Log the user out and go back to the login page
   */
  logout(): void {
    this.menuCtrl.close();
    this.userprovider.logout();
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
}
