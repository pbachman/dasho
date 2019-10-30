import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Setting } from './setting.model';

/**
 * The Base Tile
 */
export class TileBaseComponent implements OnInit {

  @Input() protected tile: Setting;
  @Output() protected notify: EventEmitter<object> = new EventEmitter<object>();

  ngOnInit(): void {
    // do nothing
  }

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
