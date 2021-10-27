import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { PubsubService } from '@fsms/angular-pubsub';

@Component({
  selector: 'grid-github',
  templateUrl: 'github.html',
  styleUrls: ['github.scss'],
})

/**
 * Represents a GitHub tile.
 */
export class GithubTileComponent extends TileBaseDirective {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

  /**
   * Create the GitHub tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private pubSub: PubsubService) {
    super();
  }

  ngOnInit(): void {
    this.pubSub.subscribe({ messageType: 'data:ready', callback: (response) => {
      if (response) {
        this.data = response.message.payload.github;
      }
    }});
  }
}
