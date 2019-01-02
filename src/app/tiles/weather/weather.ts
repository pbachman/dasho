import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting.model';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-weather',
  templateUrl: 'weather.html'
})

/**
 * Represents a weather tile.
 */
export class Weather extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  data: Object;

  /**
   * Create the weather tile
   * @constructor
   * @param  {Events} privatevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();

    this.events.subscribe('data:ready', data => {
      if (data)
        this.data = data.openweather;
    });
  }

}
