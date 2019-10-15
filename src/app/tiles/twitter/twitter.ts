import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';
import { TileBaseComponent } from 'src/app/shared/shared.tile';
import { Setting } from 'src/app/shared/setting.model';

@Component({
  selector: 'grid-twitter',
  templateUrl: 'twitter.html',
  styleUrls: ['twitter.scss'],
})

/**
 * Represents a Twitter tile.
 */
export class TwitterTileComponent extends TileBaseComponent {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

  /**
   * Create the twitter userdata tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      if (data) {
        this.data = data.twitter;
      }
    });
  }
}
