import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-news',
  templateUrl: 'news.html'
})

/**
 * Represents a news tile.
 */
export class News extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object>;
  data: Object;

  /**
   * Create the news tile
   * @constructor
   * @param  {Events} events used to subscribe to the `data:ready` event and the `user:language` event
   */
  constructor(private events: Events) {
    super();

    this.events.subscribe('data:ready', data => {
      if (data) {
        const news = data.news;
        if (news.articles)
          news.articles.sort((a, b) => {
            const dateB = new Date(b.publishedAt).getTime();
            const dateA = new Date(a.publishedAt).getTime();

            return dateB - dateA;
          });
        this.data = news;
      }
    });

    this.events.subscribe('user:language', data => {
      if (data) {
        const store = this.data;
        this.data = {};
        setTimeout(() => {
          this.data = store;
        }, 100);
      }
    });
  }
}
