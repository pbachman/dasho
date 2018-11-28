import { Component, ViewChild } from '@angular/core';
import { DashboardService } from './main.service';
import { Setting } from '../../shared/setting';
import { UserProvider } from '../../providers/user';
import { NavController, FabContainer, AlertController } from 'ionic-angular';

import { Events } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginPage } from '../login/login';

declare const Packery: any;
declare const Draggabilly: any;

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
/**
 * Represents the main page.
 */
export class MainPage {
  @ViewChild('addServiceFab') addServiceFab: FabContainer;
  public pckry: any;
  public settings: Setting[];
  private isGridInitialized: boolean;
  private currentUser: string;
  private dataobject: Object;
  private error: string;

  /**
   * Create the main page
   * @param  {DashboardService} dashboardService
   * @param  {UserData}         userData
   * @param  {AlertController}  alertCtrl
   * @param  {Events}           events
   */
  constructor(
    private dashboardService: DashboardService,
    private userData: UserProvider,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private events: Events) {
    this.events.subscribe('data:ready', data => {
      this.dataobject = data;
    });
  }

  /**
   * Get the username and the settings from the services
   */
  ngOnInit(): void {
    this.userData.getUsername().subscribe((username) => {
      this.currentUser = username;
      // get all Settings for the current User
      this.dashboardService.getSettings(username).subscribe((settings) => {
        this.settings = settings;

        // get all Settings Data for the current User
        this.dashboardService.getData(username, this.settings).subscribe((response) => {
          console.log('graphql:', response.data.settings);

          this.events.publish('data:ready', response.data.settings);

          if (!this.isGridInitialized) {
            this.initGrid();
          }
        }, (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.error = 'No Connection to the Backend!';
          } else {
            this.error = error.message;
          }
        });
      }, (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.error = 'No Connection to the Backend!';
        } else {
          this.error = error.message;
          this.userData.logout();
        }

        let alert = this.alertCtrl.create({
          title: 'Error!',
          message: this.error,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: data => {
                alert.present();
                this.navCtrl.push(LoginPage);
                document.body.classList.remove('body-loading');
                return true;
              }
            }
          ]
        });
        alert.present();
      });
    });
  }

  /**
   * Add a css class to the body element to indicate loading
   */
  ngAfterViewInit(): void {
    document.body.classList.add('body-loading');
  }

  /**
   * Initalize the grid and register the drag events
   */
  private initGrid(): void {
    document.body.classList.remove('body-loading');

    let elem = document.getElementById('packery');
    this.pckry = new Packery(elem, {
      itemSelector: '.grid-item',
      gutter: 30,
      columnWidth: 100
    });

    this.isGridInitialized = true;

    this.pckry.on('dragItemPositioned', this.dragItemPositioned.bind(this));
    this.pckry.getItemElements().forEach((itemElem, i) => {
      let draggie = new Draggabilly(itemElem);
      this.pckry.bindDraggabillyEvents(draggie);
    });
  }

  /**
   * Callback if a tile get positioned
   * @param {Object} draggedItem The item who has been dragged
   */
  public dragItemPositioned(draggedItem): void {
    const ITEMS = draggedItem.layout.items;
    console.log('dragItemPositioned');
    for (let index = 0; index < ITEMS.length; index++) {
      const ELEMENT = ITEMS[index].element;
      const ID = ELEMENT.getAttribute('data-id');
      let setting = this.settings.filter(setting => setting.id === ID)[0];
      setting.position = index;
      this.dashboardService.saveSetting(this.currentUser, setting);
    }
    setTimeout(() => {
      // Repair Layout
      this.pckry.layout();
    }, 450);
  }

  /**
   *  @typedef EventData
   *  @type {Object}
   *  @property {number} tile  The tile number
   *  @property {number} id    The id, needed to get the element in the dom
   */

  /**
   * Close and hide a tile
   * @param {EventData} eventData The needed identifiers for the tiles
   */
  public hideTile(eventData: { tile: number, id: number }): void {
    let setting = this.settings.filter(setting => setting.tile === eventData.tile)[0];
    if (setting) {
      let element = document.querySelector('[data-id="' + setting.id + '"]');
      this.addServiceFab.close();
      this.pckry.remove(element);
      this.pckry.layout();

      setTimeout(() => {
        // Give the item the time to animate
        setting.visible = false;
        this.dashboardService.saveSetting(this.currentUser, setting);
      }, 500);
    }
  }

  /**
   * Show the tile
   * @param {number} tileid
   */
  public showTile(tileid: number): void {
    let setting = this.settings.filter(setting => setting.tile === tileid)[0];
    if (setting) {
      setting.visible = true;
      setting.position = this.pckry.layoutItems.length;
      this.dashboardService.saveSetting(this.currentUser, setting);

      setTimeout(() => {
        // Give the interface the needed time…
        let element = document.querySelector('[data-id="' + setting.id + '"]');
        if (element) {
          let draggie = new Draggabilly(element);
          this.pckry.appended(element);
          this.pckry.bindDraggabillyEvents(draggie);
          this.events.publish('data:ready', this.dataobject);
          this.pckry.layout();
        } else {
          // Fallback...
          this.pckry.element.classList.add('fade-out');
          setTimeout(() => {
            this.pckry.destroy();
            this.pckry.element.classList.remove('fade-out');
            this.initGrid();
          }, 200);
        }
      }, 50);
    }
  }
}
