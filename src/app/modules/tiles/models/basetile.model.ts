import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Setting } from './setting.model';

/**
 * The Base Tile
 */
@Directive()
export class TileBaseDirective {

  @Input() protected tile: Setting;
  @Output() protected notify: EventEmitter<object> = new EventEmitter<object>();

  /**
   * Function to remove the tile from the screen
   */
  onClose(): void {
    this.notify.emit({
      id: this.tile.id,
      tile: this.tile.tile
    });
  }
}
