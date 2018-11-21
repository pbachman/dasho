import { Component } from '@angular/core';
import { AlertController, NavController, Events } from 'ionic-angular';
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
  user: {username:string, password:string} = {username:'', password:''};
  formErrors = {
    username: false,
    password: false
  };
  showError: boolean = false;
  isLoginIn: boolean;

  /**
   * Create the login page
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
    this.events.subscribe('user:logout', () => {
      // Reset user after logout
      this.user = {
        username: '',
        password: ''
      };
    });
  }

  /**
   * Change the language
   */
  public changeLanguage(): void {
    this.languageProvider.setLanguage(this.languageProvider.currentLanguage);
  }

  /**
   * Event if the email fields get blurred. Check if the email is invalid
   * @param  {Object} ngModel Model of the email field
   */
  public onEMailBlur(ngModel): void {
    let isInvalid = UserProvider.isMailInvalid(ngModel.model);
    if (isInvalid) {
      ngModel.control.setErrors({'invalidMail': isInvalid})
    }
    this.formErrors.username = isInvalid;
  }

  /**
   * Shows the error text and set the fields to pristine
   * @param {Object} controls Object with the fields
   */
  private showErrorDialog(controls):void {
    this.showError = true;
    controls.email.markAsPristine();
    controls.password.markAsPristine();
  }

  /**
   * Handle if the form gets submitted
   * @param {Object} form The form model
   */
  public loginForm(form):void {
    let email = form.form.controls.email;
    if (UserProvider.isMailInvalid(email.value)) {
      email.setErrors({'noMail': true})
    }

    if (form.valid) {
      this.isLoginIn = true;
      this.loginService.login(this.user.username, this.user.password).subscribe((response: any) => {
        let token = response.access_token;
          if (token) {
            this.userData.login(this.user.username, token).subscribe(() => {
              this.navCtrl.push(MainPage);
              this.showError = false;
            });
          } else {
            this.showErrorDialog(form.form.controls);
          }
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
  public showForgetPasswortPrompt():void {
    const i18n = this.languageProvider.getLanguageStrings();
    let prompt = this.alertCtrl.create({
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
            if (UserProvider.isMailInvalid(data.email)) {
              return false;
            }

            this.loginService.forgetPassword(data.email).subscribe(() => {
              let alert = this.alertCtrl.create({
                title: i18n.forgetPassword.alertTitle,
                subTitle: i18n.forgetPassword.alertSubTitle,
                buttons: ['OK']
              });
              alert.present();
              return true;
            },(error) => {
              return false;
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
