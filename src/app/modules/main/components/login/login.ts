import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../../../core/services/login.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { UserService } from '../../../../core/services/user.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

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
   * @param  {languageService} languageService
   * @param  {userService} userService
   * @param  {LoginService} loginService
   * @param  {DashboardService} mainService
   * @param  {pubSub} NgxPubSubService
   */
  constructor(
    private alertCtrl: AlertController,
    public languageService: LanguageService,
    private userService: UserService,
    private loginService: LoginService,
    private mainService: DashboardService,
    private router: Router,
    private pubSub: NgxPubSubService
  ) {
    this.showError = false;
    this.pubSub.subscribe('user:logout', () => {
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
    this.languageService.setLanguage(this.languageService.currentLanguage);
  }

  /**
   * Event if the email fields get blurred. Check if the email is invalid
   * @param  {Object} ngModel Model of the email field
   */
  onEMailBlur(ngModel): void {
    const isInvalid = this.userService.isMailInvalid(ngModel.model);
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
    if (this.userService.isMailInvalid(email.value)) {
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
            this.userService.setsAccessToken(token)
              .subscribe(() => {
                this.mainService.getUserprofile()
                  .subscribe(user => {
                    this.userService.setsUserdata(user)
                      .subscribe(() => {
                        this.showError = false;
                        this.userService.setsUserdata(user);
                        this.pubSub.publishEvent('user:login', user);
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
    const i18n = this.languageService.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.forgetPassword.title,
      message: i18n.forgetPassword.message,
      backdropDismiss: false,
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

            this.loginService.forgetPassword(data.email)
              .subscribe(async () => {
                const alert = await this.alertCtrl.create({
                  header: i18n.forgetPassword.alertTitle,
                  subHeader: i18n.forgetPassword.alertSubTitle,
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await alert.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const alert = await this.alertCtrl.create({
                  header: 'Error',
                  subHeader: (error.status === 0) ? 'No Connection to the Backend!' : error.error,
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

  async showSignUpPrompt(): Promise<void> {
    const i18n = this.languageService.getLanguageStrings();
    const prompt = await this.alertCtrl.create({
      header: i18n.signup.title,
      message: i18n.signup.message,
      backdropDismiss: false,
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
            if (this.userService.isMailInvalid(data.email)) {
              const invalidEmailAlert = await this.alertCtrl.create({
                header: i18n.forgetPassword.alertInvalidTitle,
                subHeader: i18n.forgetPassword.alertInvalid,
                backdropDismiss: false,
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
                backdropDismiss: false,
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
                  backdropDismiss: false,
                  buttons: ['OK']
                });
                await infoDialog.present();

                return true;
              }, async (error: HttpErrorResponse) => {
                const errorDialog = await this.alertCtrl.create({
                  header: 'Error',
                  subHeader: (error.status === 0) ? 'No Connection to the Backend!' : error.error,
                  backdropDismiss: false,
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
