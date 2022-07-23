import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'src/app/core/services/events.service';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';

@Component({
  selector: 'grid-twitter',
  templateUrl: 'twitter.html',
  styleUrls: ['twitter.scss'],
})

/**
 * Represents a Twitter tile.
 */
export class TwitterTileComponent extends TileBaseDirective {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: object;

  /**
   * Create the twitter userdata tile
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
          this.data = response.message.payload.twitter;
        }
      },
    });
  }
}
