import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { DashboardService } from '../main/main.service';
import { UserProvider } from '../../providers/user';
import { Setting } from '../../shared/setting.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { SettingService } from './setting.service';
import { Tile } from '../../shared/tile.model';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;

  constructor(
    private dashboardService: DashboardService,
    private settingService: SettingService,
    private userData: UserProvider,
    private alertCtrl: AlertController,
    private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.userData.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        // get all Settings for the current User
        this.dashboardService.getSettings(username)
          .subscribe((settings: Array<Setting>) => {
            this.settings = settings;
          }, (error: HttpErrorResponse) => this.errorHandling(error));
      }, (error: HttpErrorResponse) => this.errorHandling(error));

    // get all tiles.
    this.settingService.getTiles()
      .subscribe((tiles: Array<Tile>) => {
        this.tiles = tiles;
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  /**
   * Error Handler
   * @param {HttpErrorResponse} error
   */
  private errorHandling(error: HttpErrorResponse): void {
    (error.status === 0) ? this.error = 'No Connection to the Backend!' : this.error = error.message;

    const alert = this.alertCtrl.create({
      title: 'Error!',
      message: this.error,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.present();
            this.navCtrl.push(LoginPage);
            document.body.classList.remove('body-loading');

            return true;
          }
        }
      ]
    });
    alert.present();
  }
}
