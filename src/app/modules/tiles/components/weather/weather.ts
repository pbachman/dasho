import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';

@Component({
  selector: 'grid-weather',
  templateUrl: 'weather.html',
  styleUrls: ['weather.scss'],
})

/**
 * Represents a weather tile.
 */
export class WeatherTileComponent extends TileBaseComponent {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: any;

  /**
   * Create the weather tile
   * @constructor
   * @param  {Events} privatevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      if (data) {
        this.data = data.openweather;
      }
    });
  }
}
