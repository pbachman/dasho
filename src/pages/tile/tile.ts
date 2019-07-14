import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';

import { UserProvider } from '../../providers/user';
import { Setting } from '../../shared/setting.model';
import { Tile } from '../../shared/tile.model';

import { TileService } from './tile.service';

@Component({
  selector: 'tile-setting',
  templateUrl: 'tile.html'
})
export class TilePage {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;
  selectedTile: string;

  constructor(
    private tileService: TileService,
    private userData: UserProvider,
    private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.userData.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        this.getTiles();

      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  getTiles(): void {
    // get all tiles.
    this.tileService.getTiles()
      .subscribe((tiles: Array<Tile>) => {
        this.tiles = tiles;
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  saveItem(tile: Tile): void {
    this.tileService.saveTile(tile)
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
                  this.getTiles();
                }
              }
            ]
          });
          alert.present();
        }
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
          }
        }
      ]
    });
    alert.present();
  }
}
