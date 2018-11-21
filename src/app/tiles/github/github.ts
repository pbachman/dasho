import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-github',
  templateUrl: 'github.html'
})

/**
 * Represents a GitHub tile.
 */
export class Github extends TileBaseComponent  {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  data: Object;

  /**
   * Create the GitHub tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();

    this.events.subscribe('data:ready', data => {
      if (data) {
        this.data = data.github;
      }
    });
  }
}
