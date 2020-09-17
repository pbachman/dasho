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
  data: { desktop: { speed: number }, mobile: { speed: number, usability: number } };
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
        speedDesktop: this.data.desktop.speed,
        speedMobile: this.data.mobile.speed,
        usabilityMobile: this.data.mobile.usability
      });
    } else {
      this.options = this.pageSpeedValues({
        speedDesktop: 0,
        speedMobile: 0,
        usabilityMobile: 0
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
  pageSpeedValues({ speedDesktop, speedMobile, usabilityMobile }): any {
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
        height: 120,
        width: 230
      },
      tooltip: {
        animation: false,
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        useHTML: true,
        pointFormat: '<div class="grid-item-google-tooltip"><div style="color:{point.color};">{point.y}%</div>{series.name}</div>',
        positioner: (labelWidth: number) => {
          return {
            x: 115 - labelWidth / 2,
            y: 73
          };
        }
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '85%'],
        size: '150%',
        background: [{
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: '#eee',
          borderWidth: 0,
          shape: 'arc'
        }, {
          outerRadius: '87%',
          innerRadius: '63%',
          backgroundColor: '#eee',
          borderWidth: 0,
          shape: 'arc'
        }, {
          outerRadius: '62%',
          innerRadius: '38%',
          backgroundColor: '#eee',
          borderWidth: 0,
          shape: 'arc'
        }]
      },
      yAxis: {
        stops: [
          [0.3, '#DF5353'], // red
          [0.6, '#DDDF0D'], // yellow
          [0.9, '#55BF3B'] // green
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
        name: i18n.desktopSpeed,
        id: 'desktop-speed',
        data: [{
          radius: '112%%',
          innerRadius: '88%',
          y: speedDesktop || 0
        }]
      }, {
        name: i18n.mobileSpeed,
        id: 'mobile-speed',
        data: [{
          radius: '87%',
          innerRadius: '63%',
          y: speedMobile || 0
        }]
      }, {
        name: i18n.mobileUsability,
        id: 'mobile-usability',
        data: [{
          radius: '62%',
          innerRadius: '38%',
          y: usabilityMobile || 0
        }]
      }]
    };
  }
}
