import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { AlertController, MenuController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../models/user.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'dasho-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  currentUser: User;
  settings: any;

  constructor(
    public languageService: LanguageService,
    private alertCtrl: AlertController,
    private userService: UserService,
    private dashboardService: DashboardService,
    private router: Router,
    private menuCtrl: MenuController,
    private pubSub: NgxPubSubService
  ) {
    this.pubSub.subscribe('user:login', user => this.currentUser = user);
  }

  ngOnInit() { }

  /**
   * Shows the dialog to change the password
   */
  async showChangePasswortPrompt(): Promise<void> {
    this.menuCtrl.close();
    const i18n = this.languageService.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.changePassword.title,
      message: i18n.changePassword.message,
      backdropDismiss: false,
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
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await alert.present();
                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error!',
                  message: (error.status === 0) ? 'No Connection to the Backend!' : error.error,
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
    this.menuCtrl.close();
    const i18n = this.languageService.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.invite.title,
      message: i18n.invite.message,
      backdropDismiss: false,
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
            if (this.userService.isMailInvalid(data.email)) {
              const alert = await this.alertCtrl.create({
                header: i18n.forgetPassword.alertInvalidTitle,
                subHeader: i18n.forgetPassword.alertInvalid,
                backdropDismiss: false,
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
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await alert.present();
                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error!',
                  message: (error.status === 0) ? 'No Connection to the Backend!' : error.error,
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
        this.router.navigateByUrl('/setting');
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
    this.userService.logout();
    document.body.classList.remove('body-loading');
  }

  /**
   * Publish the change language event
   */
  changeLanguage(): void {
    const data = {
      key: this.languageService.currentLanguage
    };
    this.pubSub.publishEvent('user:language', data);
  }

  /**
   * Closes the Menu, before the language dialog shows up.
   */
  showChangeLanguage(): void {
    this.menuCtrl.close();
  }
}
