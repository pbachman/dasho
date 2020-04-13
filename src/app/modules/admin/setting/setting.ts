import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Setting } from '../../tiles/models/setting.model';
import { SettingService } from './setting.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { Tile } from '../models/tile.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage implements OnInit {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;
  selectedTile: string;
  hasChanged: boolean;

  constructor(
    private dashboardService: DashboardService,
    private settingService: SettingService,
    private userService: UserService,
    private router: Router,
    private pubSub: NgxPubSubService,
    private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.userService.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        this.loadSettings();
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  loadSettings(): void {
    // get all Settings for the current User
    this.dashboardService.getSettings(this.currentUser)
      .subscribe((settings: Array<Setting>) => {
        this.settings = settings;

        // get all unassigned tiles.
        this.settingService.getUnassignedTiles(this.currentUser)
          .subscribe((tiles: Array<Tile>) => {
            this.tiles = tiles;
          }, (error: HttpErrorResponse) => this.errorHandling(error));

      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  addItem(): void {
    this.settingService.addConfigs(this.currentUser, this.selectedTile)
      .subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Info!',
          message: 'Successfully saved!',
          backdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.pubSub.publishEvent('data:changed', null);
                this.loadSettings();
              }
            }
          ]
        });
        await alert.present();
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  saveItem(setting: Setting): void {
    this.hasChanged = true;
    this.dashboardService.saveSetting(this.currentUser, setting)
      .subscribe(async (saved: boolean) => {
        if (saved) {
          const alert = await this.alertCtrl.create({
            header: 'Info!',
            message: 'Successfully saved!',
            backdropDismiss: false,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.pubSub.publishEvent('data:changed', null);
                  this.loadSettings();
                }
              }
            ]
          });
          await alert.present();
        }
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  back(): void {
    this.router.navigateByUrl('/main');
  }

  async deleteItem(setting: Setting): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Would you like to delete?',
      message: 'Successfully saved!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dashboardService.deleteSetting(this.currentUser, setting)
              .subscribe((deleted: boolean) => {
                if (deleted) {
                  this.pubSub.publishEvent('data:changed', null);
                  this.loadSettings();
                }
              }, (error: HttpErrorResponse) => this.errorHandling(error));
          }
        },
        {
          text: 'No',
          handler: async () => {
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Error Handler
   */
  private async errorHandling(error: HttpErrorResponse): Promise<void> {
    (error.status === 0) ? this.error = 'No Connection to the Backend!' : this.error = error.error;

    const alert = await this.alertCtrl.create({
      header: 'Error!',
      message: this.error,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    await alert.present();
  }
}
