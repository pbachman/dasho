import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardService } from '../main/main.service';
import { UserProvider } from '../../providers/user';
import { Setting } from '../../shared/setting.model';
import { Tile } from '../../shared/tile.model';

import { SettingService } from './setting.service';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;
  selectedTile: string;
  hasChanged: boolean;

  constructor(
    private dashboardService: DashboardService,
    private settingService: SettingService,
    private userData: UserProvider,
    private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.userData.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        this.loadSettings();

        // get all tiles.
        this.settingService.getUnassignedTiles(this.currentUser)
          .subscribe((tiles: Array<Tile>) => {
            this.tiles = tiles;
          }, (error: HttpErrorResponse) => this.errorHandling(error));
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  loadSettings(): void {
    // get all Settings for the current User
    this.dashboardService.getSettings(this.currentUser)
      .subscribe((settings: Array<Setting>) => {
        this.settings = settings;
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  addItem(): void {
    this.settingService.addConfigs(this.currentUser, this.selectedTile)
      .subscribe((saved: boolean) => {
        if (saved) {
          const alert = this.alertCtrl.create({
            title: 'Info!',
            message: 'Successfully saved!',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.loadSettings();
                }
              }
            ]
          });
          alert.present();
        }
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  saveItem(setting: Setting): void {
    this.hasChanged = true;
    this.dashboardService.saveSetting(this.currentUser, setting)
      .subscribe((saved: boolean) => {
        if (saved) {
          const alert = this.alertCtrl.create({
            title: 'Info!',
            message: 'Successfully saved!',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.loadSettings();
                }
              }
            ]
          });
          alert.present();
        }
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  deleteItem(setting: Setting): void {
    const alert = this.alertCtrl.create({
      title: 'Would you like to delete?',
      message: 'Successfully saved!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            alert.present();
            this.dashboardService.deleteSetting(this.currentUser, setting)
              .subscribe((deleted: boolean) => {
                if (deleted)
                  this.loadSettings();
              });
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.present();

            return true;
          }
        }
      ]
    });
    alert.present();
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
          }
        }
      ]
    });
    alert.present();
  }
}
