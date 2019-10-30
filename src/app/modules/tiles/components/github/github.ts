import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';

@Component({
  selector: 'grid-github',
  templateUrl: 'github.html',
  styleUrls: ['github.scss'],
})

/**
 * Represents a GitHub tile.
 */
export class GithubTileComponent extends TileBaseComponent {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

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
      if (data) {
        this.data = data.github;
      }
    });
  }
}
