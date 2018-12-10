import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-twitter-userdata',
  templateUrl: 'twitter.html'
})

/**
 * Represents a Twitter tile.
 */
export class Twitter extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  data: Object;

  /**
   * Create the twitter userdata tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();

    this.events.subscribe('data:ready', data => {
      if (data)
        this.data = data.twitter;
    });
  }
}
