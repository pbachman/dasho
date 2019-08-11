import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';

import { Setting } from 'src/app/shared/setting.model';
import { TileBaseComponent } from 'src/app/shared/shared.tile';

@Component({
  selector: 'grid-github',
  templateUrl: 'github.html',
  styleUrls: ['github.scss'],
})

/**
 * Represents a GitHub tile.
 */
export class Github extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: Object;

  /**
   * Create the GitHub tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe('data:ready', data => {
      if (data)
        this.data = data.github;
    });
  }
}
