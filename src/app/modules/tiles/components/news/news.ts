import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from '@ionic/angular';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';

@Component({
  selector: 'grid-news',
  templateUrl: 'news.html',
  styleUrls: ['news.scss'],
})

/**
 * Represents a news tile.
 */
export class NewsTileComponent extends TileBaseComponent {
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
    this.events.subscribe('data:ready', data => {
      if (data) {
        const news = data.news;
        if (news && news.articles) {
          news.articles.sort((a, b) => {
            const dateB = new Date(b.publishedAt).getTime();
            const dateA = new Date(a.publishedAt).getTime();

            return dateB - dateA;
          });
        }
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
