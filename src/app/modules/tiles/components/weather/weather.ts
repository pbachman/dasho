import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { Events } from 'src/app/core/services/events.service';

@Component({
  selector: 'grid-weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.scss'],
})

/**
 * Represents a weather tile.
 */
export class WeatherTileComponent extends TileBaseDirective {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: any;

  /**
   * Create the weather tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe({ messageType: 'data:ready', callback: (response) => {
      if (response.message.payload.openweather) {
        this.data = response.message.payload.openweather;
      }
    }});
  }
}
