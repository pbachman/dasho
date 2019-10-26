import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardService } from '../main/main.service';

import { LoginService } from './login.service';
import { AlertController, Events } from '@ionic/angular';
import { LanguageService } from '../shared/language.service';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
})

/**
 * Represent the login page
 */
export class LoginPage {
  user: { username: string, password: string } = { username: '', password: '' };
  formErrors = {
    username: false,
    password: false
  };
  showError: boolean;
  isLoginIn: boolean;

  /**
   * Create the login page
   * @constructor
   * @param  {AlertController} alertCtrl
   * @param  {LanguageProvider} languageProvider
   * @param  {UserProvider} userprovider
   * @param  {LoginService} loginService
   * @param  {DashboardService} mainService
   * @param  {Events} events
   */
  constructor(
    private alertCtrl: AlertController,
    public languageProvider: LanguageService,
    private userprovider: UserService,
    private loginService: LoginService,
    private mainService: DashboardService,
    private router: Router,
    private events: Events
  ) {
    this.showError = false;
    this.events.subscribe('user:logout', () => {
      this.user = {
        username: '',
        password: ''
      };
    });
  }

  /**
   * Change the language
   */
  changeLanguage(): void {
    this.languageProvider.setLanguage(this.languageProvider.currentLanguage);
  }

  /**
   * Event if the email fields get blurred. Check if the email is invalid
   * @param  {Object} ngModel Model of the email field
   */
  onEMailBlur(ngModel): void {
    const isInvalid = this.userprovider.isMailInvalid(ngModel.model);
    if (isInvalid) {
      ngModel.control.setErrors({ invalidMail: isInvalid });
    }
    this.formErrors.username = isInvalid;
  }

  /**
   * Handle if the form gets submitted
   * @param {Object} form The form model
   */
  loginForm(form): void {
    const email = form.form.controls.email;
    if (this.userprovider.isMailInvalid(email.value)) {
      email.setErrors({ noMail: true });
    }

    if (form.valid) {
      this.isLoginIn = true;
      this.loginService.login(this.user.username, this.user.password)
        .subscribe((response: any) => {
          const token = response.access_token;
          (token) ?
            /**
             * Sets the Token, loads the current Profile and store it locally.
             */
            this.userprovider.setsAccessToken(token)
              .subscribe(() => {
                this.mainService.getUserprofile()
                  .subscribe(user => {
                    this.userprovider.setsUserdata(user)
                      .subscribe(() => {
                        this.showError = false;
                        this.userprovider.setsUserdata(user);
                        this.events.publish('user:login', user);
                        this.router.navigateByUrl('/main');
                      });
                  });
              })
            : this.showErrorDialog(form.form.controls);
          this.isLoginIn = false;
        }, err => {
          this.showErrorDialog(form.form.controls);
          this.isLoginIn = false;
        });
    }
  }

  /**
   * Shows the Forget password promt and send the email address to the login service
   */
  async showForgetPasswortPrompt(): Promise<void> {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.forgetPassword.title,
      message: i18n.forgetPassword.message,
      inputs: [
        {
          name: 'email',
          placeholder: i18n.general.emailExample,
          type: 'email'
        }
      ],
      buttons: [
        {
          text: i18n.general.cancel,
          role: 'cancel'
        },
        {
          text: i18n.forgetPassword.send,
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

            this.loginService.forgetPassword(data.email)
              .subscribe(async () => {
                const alert = await this.alertCtrl.create({
                  header: i18n.forgetPassword.alertTitle,
                  subHeader: i18n.forgetPassword.alertSubTitle,
                  buttons: ['OK']
                });
                await alert.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error',
                  subHeader: (error.status === 0) ? 'No Connection to the Backend!' : error.message,
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

  async showSignUpPrompt(): Promise<void> {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.signup.title,
      message: i18n.signup.message,
      inputs: [
        {
          name: 'email',
          placeholder: i18n.general.emailExample,
          type: 'email'
        },
        {
          name: 'password',
          placeholder: i18n.signup.password,
          type: 'password'
        },
        {
          name: 'passwordconfirm',
          placeholder: i18n.signup.passwordconfirm,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: i18n.general.cancel,
          role: 'cancel'
        },
        {
          text: i18n.signup.send,
          handler: async data => {
            if (this.userprovider.isMailInvalid(data.email)) {
              const invalidEmailAlert = await this.alertCtrl.create({
                header: i18n.forgetPassword.alertInvalidTitle,
                subHeader: i18n.forgetPassword.alertInvalid,
                buttons: ['OK']
              });
              await invalidEmailAlert.present();

              return false;
            }

            if (data.password.length < 8 || data.passwordconfirm.length < 8 || data.password === '' ||
              data.passwordconfirm === '' || (data.password !== data.passwordconfirm)) {
              const invalidPasswordAlert = await this.alertCtrl.create({
                header: i18n.signup.alertInvalidPasswordTitle,
                subHeader: i18n.signup.alertInvalidPassword,
                buttons: ['OK']
              });
              await invalidPasswordAlert.present();

              return false;
            }

            this.loginService.signUp(data.email, data.password)
              .subscribe(async () => {
                const infoDialog = await this.alertCtrl.create({
                  header: i18n.signup.alertTitle,
                  subHeader: i18n.signup.alertSubTitle,
                  buttons: ['OK']
                });
                await infoDialog.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const errorDialog = await this.alertCtrl.create({
                  header: 'Error',
                  subHeader: (error.status === 0) ? 'No Connection to the Backend!' : error.message,
                  buttons: ['OK']
                });
                await errorDialog.present();

                return false;
              });
          }
        }
      ]
    });
    await prompt.present();
  }

  /**
   * Shows the error text and set the fields to pristine
   * @param {Object} controls Object with the fields
   */
  private showErrorDialog(controls): void {
    this.showError = true;
    controls.email.markAsPristine();
    controls.password.markAsPristine();
  }
}
