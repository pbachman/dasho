import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';

import { Setting } from 'src/app/shared/setting.model';
import { TileBaseComponent } from 'src/app/shared/shared.tile';

@Component({
  selector: 'grid-wiewarm',
  templateUrl: 'wiewarm.html',
  styleUrls: ['wiewarm.scss'],
})

/**
 * Represents a Wiewarm.ch tile.
 */
export class WiewarmTileComponent extends TileBaseComponent {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

  /**
   * Create the Wiewarm.ch tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      if (data) {
        this.data = data.wiewarm;
      }
    });
  }
}
