import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, FabContainer, NavController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';

import { Setting } from '../../shared/setting.model';
import { UserProvider } from '../../providers/user';
import { LoginPage } from '../login/login';

import { DashboardService } from './main.service';

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
  pckry: any;
  settings: Array<Setting>;
  isGridInitialized: boolean;
  currentUser: string;
  dataobject: Object;
  error: string;

  /**
   * Create the main page
   * @param  {DashboardService} dashboardService
   * @param  {UserProvider} userData
   * @param  {AlertController} alertCtrl
   * @param  {Events} events
   */
  constructor(
    private dashboardService: DashboardService,
    private userData: UserProvider,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private events: Events) {
  }

  /**
   * Get the username and the settings from the services
   */
  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      this.dataobject = data;

      setTimeout(() => {
        this.pckry.layout();
      }, 500);
    });

    // subscribe the Event, when the Setting- or TilePage will close.
    this.navCtrl.viewDidLeave.subscribe(event => {
      if (event.name === 'SettingPage' || event.name === 'TilePage') {
        this.isGridInitialized = false;
        this.loadData();
      }
    });

    this.loadData();
  }

  /**
   * (Re-)Loads the Settings by User.
   */
  loadData(): void {
    this.userData.getUsername()
      .subscribe((username: string) => {
        this.currentUser = username;
        // get all Settings for the current User
        this.dashboardService.getSettings(username)
          .subscribe((settings: Array<Setting>) => {
            this.settings = settings;
            // get all Settings Data for the current User
            this.dashboardService.getData(username, this.settings)
              .subscribe((response: any) => {
                this.events.publish('data:ready', response.data.settings);

                if (!this.isGridInitialized)
                  this.initGrid();
              }, (error: HttpErrorResponse) => this.errorHandling(error));
          }, (error: HttpErrorResponse) => this.errorHandling(error));
      }, (error: HttpErrorResponse) => this.errorHandling(error));
  }

  /**
   * Add a css class to the body element to indicate loading
   */
  ngAfterViewInit(): void {
    document.body.classList.add('body-loading');
  }

  /**
   * Callback if a tile get positioned
   * @param {Object} draggedItem The item who has been dragged
   */
  dragItemPositioned(draggedItem): void {
    const ITEMS = draggedItem.layout.items;

    for (let index = 0; index < ITEMS.length; index++) {
      const ELEMENT = ITEMS[index].element;
      const ID = ELEMENT.getAttribute('data-id');
      const setting = this.settings.filter(s => s.id === ID)[0];
      setting.position = index;
      this.dashboardService.saveSetting(this.currentUser, setting)
        .subscribe((saved: boolean) => undefined, (error: HttpErrorResponse) => this.errorHandling(error));
    }

    setTimeout(() => {
      this.pckry.layout();
    }, 450);
  }

  /**
   * Close and hide a tile
   * @property {string} tile  The tileId
   * @property {number} id    The id, needed to get the element in the dom
   * @param {EventData} eventData The needed identifiers for the tiles
   */
  hideTile(eventData: { tile: string, id: number }): void {
    const setting = this.settings.filter(s => s.tile === eventData.tile)[0];
    if (setting) {
      const element = document.querySelector(`[data-id="${setting.id}"]`);
      this.addServiceFab.close();
      this.pckry.remove(element);
      this.pckry.layout();

      setTimeout(() => {
        setting.visible = false;
        this.dashboardService.saveSetting(this.currentUser, setting)
          .subscribe((saved: boolean) => undefined, (error: HttpErrorResponse) => this.errorHandling(error));
      }, 500);
    }
  }

  /**
   * Show the tile
   * @param {string} tileid
   */
  showTile(tileid: string): void {
    const setting = this.settings.filter(s => s.tile === tileid)[0];
    if (setting) {
      setting.visible = true;
      setting.position = this.pckry.layoutItems.length;
      this.dashboardService.saveSetting(this.currentUser, setting)
        .subscribe(() => {
          setTimeout(() => {
            const element = document.querySelector(`[data-id="${setting.id}"]`);
            if (element) {
              const draggie = new Draggabilly(element);
              this.pckry.appended(element);
              this.pckry.bindDraggabillyEvents(draggie);
              this.events.publish('data:ready', this.dataobject);
              this.pckry.layout();
            } else {
              this.pckry.element.classList.add('fade-out');
              setTimeout(() => {
                this.pckry.destroy();
                this.pckry.element.classList.remove('fade-out');
                this.initGrid();
              }, 200);
            }
          }, 50);
        }, (error: HttpErrorResponse) => this.errorHandling(error));
    }
  }

  /**
   * Initalize the grid and register the drag events
   */
  private initGrid(): void {
    document.body.classList.remove('body-loading');
    const elem = document.getElementById('packery');
    this.pckry = new Packery(elem, {
      itemSelector: '.grid-item',
      gutter: 30,
      columnWidth: 100
    });

    this.isGridInitialized = true;

    this.pckry.on('dragItemPositioned', this.dragItemPositioned.bind(this));
    this.pckry.getItemElements()
      .forEach((itemElem: any) => {
        const draggie = new Draggabilly(itemElem);
        this.pckry.bindDraggabillyEvents(draggie);
      });
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
