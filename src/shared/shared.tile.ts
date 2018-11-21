import { Input, Output, EventEmitter } from '@angular/core';
import { Setting } from './setting';

/**
 * The Base Tile
 */
export class TileBaseComponent {
  @Input('tile') protected tile: Setting;
  @Output() protected notify: EventEmitter<Object> = new EventEmitter<Object>();

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
