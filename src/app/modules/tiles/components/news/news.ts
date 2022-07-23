import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileBaseDirective } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { Events } from 'src/app/core/services/events.service';

@Component({
  selector: 'grid-news',
  templateUrl: 'news.html',
  styleUrls: ['news.scss'],
})

/**
 * Represents a news tile.
 */
export class NewsTileComponent extends TileBaseDirective {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object>;
  data: any;

  /**
   * Create the news tile
   */
  constructor(private events: Events) {
    super();
  }

  ngOnInit(): void {
    this.events.subscribe({ messageType: 'data:ready', callback: (response) => {
      if (response) {
        const news = response.message.payload.news;
        if (news && news.articles) {
          news.articles.sort((a, b) => {
            const dateB = new Date(b.publishedAt).getTime();
            const dateA = new Date(a.publishedAt).getTime();

            return dateB - dateA;
          });
        }
        this.data = news;
      }
    }});

    this.events.subscribe({ messageType: 'user:language', callback: (response) => {
      if (response) {
        const store = this.data;
        this.data = {};
        setTimeout(() => {
          this.data = store;
        }, 100);
      }
    }});
  }
}
