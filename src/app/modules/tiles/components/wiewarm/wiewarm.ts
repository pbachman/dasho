import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { Events } from 'src/app/core/services/events.service';

@Component({
  selector: 'grid-wiewarm',
  templateUrl: 'wiewarm.html',
  styleUrls: ['wiewarm.scss'],
})

/**
 * Represents a Wiewarm.ch tile.
 */
export class WiewarmTileComponent extends TileBaseDirective {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

  /**
   * Create the Wiewarm.ch tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe({
      messageType: 'data:ready',
      callback: (response) => {
        if (response) {
          this.data = response.message.payload.wiewarm;
        }
      },
    });
  }
}
