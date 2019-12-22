import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

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
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private pubSub: NgxPubSubService) {
    super();
  }

  ngOnInit(): void {
    this.pubSub.subscribe('data:ready', data => {
      if (data) {
        this.data = data.openweather;
      }
    });
  }
}
