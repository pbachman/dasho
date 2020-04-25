import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Setting } from 'src/app/modules/tiles/models/setting.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

declare const Packery: any;
declare const Draggabilly: any;

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
  styleUrls: ['./main.scss']
})
/**
 * Represents the main page.
 */
export class MainPage implements OnInit, AfterViewInit {

  pckry: any;
  settings: Array<Setting>;
  isGridInitialized: boolean;
  dataobject: object;
  error: string;
  currentUser: User;
  hasChanged: boolean;

  /**
   * Create the main page
   */
  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private router: Router,
    private menu: MenuController,
    private pubSub: NgxPubSubService) {

    this.userService.hasLoggedIn()
      .subscribe((hasLoggedIn: boolean) => {
        if (hasLoggedIn) {
          this.userService.getUser()
            .subscribe(user => {
              this.currentUser = user;
              this.pubSub.publishEvent('user:login', user);
              this.loadData();
            });
        } else {
          this.router.navigateByUrl('/login');
        }
      });

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/main' && this.hasChanged) {
        setTimeout(() => {
          if (this.pckry) {
            document.body.classList.add('body-loading');
            this.isGridInitialized = false;
            this.loadData();
          }
        }, 500);
      }
    });

    this.listenToLoginEvents();
  }

  /**
   * Get the username and the settings from the services
   */
  ngOnInit(): void {
    this.pubSub.subscribe('data:ready', data => {
      this.dataobject = data;

      setTimeout(() => {
        if (this.pckry) {
          this.pckry.layout();
        }
      }, 500);
    });

    this.pubSub.subscribe('data:changed', () => {
      console.log('data:changed');
      this.hasChanged = true;
    });
  }

  /**
   * (Re-)Loads the Settings by User.
   */
  loadData(): void {
    if (this.currentUser) {
      // get all Settings for the current User
      this.dashboardService.getSettings(this.currentUser.username)
        .subscribe((settings: Array<Setting>) => {
          this.settings = settings;
          // get all Settings Data for the current User
          this.dashboardService.getData(this.currentUser.username, this.settings)
            .subscribe((response: any) => {
              this.pubSub.publishEvent('data:ready', response.data.settings);

              if (!this.isGridInitialized) {
                this.initGrid();
              }
            }, (error: HttpErrorResponse) => this.errorHandling(error));
        }, (error: HttpErrorResponse) => this.errorHandling(error));
    } else {
      this.router.navigateByUrl('/login');
      document.body.classList.remove('body-loading');
    }
  }

  /**
   * Add a css class to the body element to indicate loading
   */
  ngAfterViewInit(): void {
    document.body.classList.add('body-loading');
  }

  /**
   * Callback if a tile get positioned
   */
  dragItemPositioned(draggedItem): void {
    const ITEMS = draggedItem.layout.items;

    for (let index = 0; index < ITEMS.length; index++) {
      const ELEMENT = ITEMS[index].element;
      const ID = ELEMENT.getAttribute('data-id');
      const setting = this.settings.filter(s => s.id === ID)[0];
      setting.position = index;
      this.dashboardService.saveSetting(this.currentUser.username, setting)
        .subscribe((saved: boolean) => undefined, (error: HttpErrorResponse) => this.errorHandling(error));
    }

    setTimeout(() => {
      this.pckry.layout();
    }, 450);
  }

  menuopen(): void {
    this.hasChanged = false;
    this.menu.enable(true, 'menu');
    this.menu.open('start');
  }

  /**
   * Close and hide a tile
   */
  hideTile(eventData: { tile: string, id: number }): void {
    const setting = this.settings.filter(s => s.tile === eventData.tile)[0];
    if (setting) {
      const element = document.querySelector(`[data-id="${setting.id}"]`);
      this.pckry.remove(element);
      this.pckry.layout();

      setTimeout(() => {
        setting.visible = false;
        this.dashboardService.saveSetting(this.currentUser.username, setting)
          .subscribe((saved: boolean) => undefined, (error: HttpErrorResponse) => this.errorHandling(error));
      }, 500);
    }
  }

  /**
   * Show the tile
   */
  showTile(tileid: string): void {
    const setting = this.settings.filter(s => s.tile === tileid)[0];
    if (setting) {
      setting.visible = true;
      setting.position = this.pckry.layoutItems.length;
      this.dashboardService.saveSetting(this.currentUser.username, setting)
        .subscribe(() => {
          setTimeout(() => {
            const element = document.querySelector(`[data-id="${setting.id}"]`);
            if (element) {
              const draggie = new Draggabilly(element);
              this.pckry.appended(element);
              this.pckry.bindDraggabillyEvents(draggie);
              this.pubSub.publishEvent('data:ready', this.dataobject);
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

    this.pckry.on('dragItemPositioned', this.dragItemPositioned.bind(this));
    this.pckry.getItemElements()
      .forEach((itemElem: any) => {
        const draggie = new Draggabilly(itemElem);
        this.pckry.bindDraggabillyEvents(draggie);
        this.isGridInitialized = true;
      });
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
          text: 'OK',
          handler: async () => {
            this.router.navigateByUrl('/login');
            document.body.classList.remove('body-loading');

            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Handle the menu visability and headline. Subscribe to the user events
   */
  private listenToLoginEvents(): void {
    this.pubSub.subscribe('user:login', user => {
      this.currentUser = user;
    });

    this.pubSub.subscribe('user:logout', () => {
      this.router.navigateByUrl('/login');
    });
  }
}
