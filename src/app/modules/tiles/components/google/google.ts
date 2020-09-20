import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LanguageService } from 'src/app/core/services/language.service';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'grid-google',
  templateUrl: 'google.html',
  styleUrls: ['google.scss'],
})

/**
 * Represents a Google tile.
 */
export class GoogleTileComponent extends TileBaseComponent {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  data: { finalUrl, categories: { performance: number } };
  options: object;
  Highcharts: typeof Highcharts = Highcharts;

  /**
   * Create the pagespeed tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` and the `user:language` event
   */
  constructor(
    private pubSub: NgxPubSubService,
    private languageService: LanguageService) {
    super();
  }

  ngOnInit(): void {
    this.pubSub.subscribe('data:ready', data => {
      if (data) {
        this.data = data.googleapi;
      }
      this.setOptions();
    });

    this.pubSub.subscribe('user:language', data => {
      setTimeout(() => {
        this.setOptions();
      }, 100);
    });
  }

  /**
   * Set options for the highchart
   */
  setOptions(): void {
    if (this.data) {
      this.options = this.pageSpeedValues({
        performance: this.data.categories?.performance,
      });
    } else {
      this.options = this.pageSpeedValues({
        performance: 0,
      });
    }
  }

  /**
   * Return the options for the highchart
   * @param  {number} speedDesktop    The value for the desktop speed
   * @param  {number} speedMobile     The value for the mobile speed
   * @param  {number} usabilityMobile The value for the desktop usability
   * @return {Object} Represents the options for the highchart
   */
  pageSpeedValues({ performance }): any {
    const i18n = this.languageService.getLanguageStrings().tiles.pagespeed;

    return {
      title: {
        text: undefined
      },
      credits: {
        enabled: false
      },
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
        height: 145,
        width: 230
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
          fontSize: '12px'
        },
        valueSuffix: '%',
        pointFormat: '<span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
        positioner(labelWidth) {
          return {
            x: (this.chart.chartWidth - labelWidth) / 2,
            y: (this.chart.plotHeight / 2)
          };
        }
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: '#eee',
          borderWidth: 0,
          shape: 'arc'
        }]
      },
      yAxis: {
        stops: [
          [0.5, '#0cce6b'], // green
        ],
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          }
        }
      },
      series: [{
        name: i18n.performance,
        id: 'performance',
        data: [{
          radius: '112%%',
          innerRadius: '88%',
          y: performance || 0
        }]
      }]
    };
  }
}
