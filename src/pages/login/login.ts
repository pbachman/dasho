import { Component } from '@angular/core';
import { AlertController, Events, NavController } from 'ionic-angular';
import { LanguageProvider } from '../../providers/language';
import { UserProvider } from '../../providers/user';
import { LoginService } from './login.service';

import { MainPage } from '../main/main';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
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
   * @param  {AlertController}  privatealertCtrl
   * @param  {NavController}    privatenavCtrl
   * @param  {LanguageProvider} privatelanguageProvider
   * @param  {UserData}         privateuserData
   * @param  {LoginService}     privateloginService
   * @param  {Events}           privateevents
   */
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private languageProvider: LanguageProvider,
    private userData: UserProvider,
    private loginService: LoginService,
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
    const isInvalid = this.userData.isMailInvalid(ngModel.model);
    if (isInvalid)
      ngModel.control.setErrors({ invalidMail : isInvalid });
    this.formErrors.username = isInvalid;
  }

  /**
   * Handle if the form gets submitted
   * @param {Object} form The form model
   */
  loginForm(form): void {
    const email = form.form.controls.email;
    if (this.userData.isMailInvalid(email.value))
      email.setErrors({ noMail : true });

    if (form.valid) {
      this.isLoginIn = true;
      this.loginService.login(this.user.username, this.user.password)
        .subscribe((response: any) => {
          const token = response.access_token;
          (token) ? this.userData.login(this.user.username, token)
          .subscribe(() => {
            this.navCtrl.push(MainPage);
            this.showError = false;
          }) : this.showErrorDialog(form.form.controls);
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
  showForgetPasswortPrompt(): void {
    const i18n = this.languageProvider.getLanguageStrings();
    const prompt = this.alertCtrl.create({
      title: i18n.forgetPassword.title,
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
          handler: data => {
            if (this.userData.isMailInvalid(data.email))
              return false;

            this.loginService.forgetPassword(data.email)
              .subscribe(() => {
                const alert = this.alertCtrl.create({
                  title: i18n.forgetPassword.alertTitle,
                  subTitle: i18n.forgetPassword.alertSubTitle,
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
   * Shows the error text and set the fields to pristine
   * @param {Object} controls Object with the fields
   */
  private showErrorDialog(controls): void {
    this.showError = true;
    controls.email.markAsPristine();
    controls.password.markAsPristine();
  }
}
