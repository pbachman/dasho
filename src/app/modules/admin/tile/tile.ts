import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Setting } from '../../tiles/models/setting.model';
import { TileService } from './tile.service';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Tile } from '../models/tile.model';
import { Router } from '@angular/router';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'tile-setting',
  templateUrl: 'tile.html'
})
export class TilePage implements OnInit {

  currentUser: string;
  error: string;
  tiles: Array<Tile>;
  settings: Array<Setting>;
  selectedTile: string;
  hasChanged: boolean;

  constructor(
    private tileService: TileService,
    private userService: UserService,
    private router: Router,
    private pubSub: NgxPubSubService,
    private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.userService.getUsername()
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

  back(): void {
    this.router.navigateByUrl('/main');
  }

  async saveItem(tile: Tile): Promise<void> {
    this.hasChanged = true;

    if (tile.baseUrl && tile.schema) {
      this.tileService.saveTile(tile)
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
                    this.getTiles();
                  }
                }
              ]
            });
            await alert.present();
          }
        }, (error: HttpErrorResponse) => this.errorHandling(error));
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Warning!',
        message: 'BaseUrl and Schema are mandatory!',
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

  /**
   * Error Handler
   * @param {HttpErrorResponse} error
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
