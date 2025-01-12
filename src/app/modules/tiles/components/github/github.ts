import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'src/app/core/services/events.service';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';

@Component({
  selector: 'grid-github',
  templateUrl: 'github.html',
  styleUrls: ['github.scss'],
  standalone: false,
})

/**
 * Represents a GitHub tile.
 */
export class GithubTileComponent extends TileBaseDirective {
  @Input() override tile: Setting | undefined;
  @Output() override notify: EventEmitter<object> = new EventEmitter<object>();
  data: object | undefined;

  /**
   * Create the GitHub tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe({ messageType: 'data:ready', callback: (response: any) => {
      if (response) {
        this.data = response.message.payload.github;
      }
    }});
  }
}
