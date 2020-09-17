import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import * as dayjs from 'dayjs';
import ChartModuleMore from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import { TileBaseComponent } from '../../models/basetile.model';
import { Setting } from '../../models/setting.model';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

ChartModuleMore(Highcharts);
HCSoldGauge(Highcharts);

@Component({
  selector: 'grid-clock',
  templateUrl: 'clock.html',
  styleUrls: ['clock.scss'],
})

/**
 * Represents a clock tile.
 */
export class ClockTileComponent extends TileBaseComponent implements OnInit, OnDestroy {
  @Input() tile: Setting;
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();
  Highcharts: typeof Highcharts = Highcharts;
  interval: any;
  public options = {
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    chart: {
      type: 'gauge',
      backgroundColor: 'transparent',
      plotBorderWidth: 0,
      plotShadow: false,
      height: 230,
      width: 230,
      events: {
        load() {
          const chart = this;
          this.interval = setInterval(() => {
            if (chart.axes) { // not destroyed
              const hour = chart.get('hour');
              const minute = chart.get('minute');
              const second = chart.get('second');

              // run animation unless we're wrapping around from 59 to 0
              const animation = dayjs()
                .second() === 0 ? false : { easing: 'easeOutBounce' };

              hour.update(dayjs()
                .hour() + dayjs()
                  .minute() / 60, true, animation);
              minute.update(dayjs()
                .minute() * 12 / 60 + dayjs()
                  .second() * 12 / 3600, true, animation);
              second.update(dayjs()
                .second() * 12 / 60, true, animation);
            }
          }, 1000);
        }
      }
    },
    tooltip: {
      enabled: false
    },
    pane: {
      background: [{
      }, {
        backgroundColor: 1 ? {
          radialGradient: {
            cx: 0.5,
            cy: -0.4,
            r: 1.9
          },
          stops: [
            [0.5, 'rgba(255, 255, 255, 0.2)'],
            [0.5, 'rgba(200, 200, 200, 0.2)']
          ]
        } : undefined
      }]
    },
    yAxis: {
      labels: {
        distance: -20
      },
      min: 0,
      max: 12,
      lineWidth: 0,
      showFirstLabel: false,
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 5,
      minorTickPosition: 'inside',
      minorGridLineWidth: 0,
      minorTickColor: '#666',
      tickInterval: 1,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      title: {
        text: 'dasho',
        style: {
          color: '#BBB',
          fontWeight: 'normal',
          fontSize: '8px',
          lineHeight: '10px'
        },
        y: 10
      }
    },
    series: [{
      data: [{
        id: 'hour',
        y: dayjs().hour() + dayjs().minute() / 60,
        dial: {
          radius: '60%',
          baseWidth: 4,
          baseLength: '95%',
          rearLength: 0
        }
      }, {
        id: 'minute',
        y: dayjs().minute() * 12 / 60 + dayjs().second() * 12 / 3600,
        dial: {
          baseLength: '95%',
          rearLength: 0
        }
      }, {
        id: 'second',
        y: dayjs().second() * 12 / 60,
        dial: {
          radius: '100%',
          baseWidth: 1,
          rearLength: '20%'
        }
      }],
      animation: false,
      dataLabels: {
        enabled: false
      }
    }]
  };

  /**
   * Create the clock tile
   * @constructor
   * @param  {pubSub} NgxPubSubService used to subscribe to the `data:ready` event
   */
  constructor(private pubSub: NgxPubSubService) {
    super();
  }

  ngOnInit(): void {
    this.setMathBounce();

    this.pubSub.subscribe('data:ready', () => {
      this.onReady();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Clears the interval and set the options for the highchart clock
   */
  onReady(): void {
    clearInterval(this.interval);
  }

  /**
   * Animation timing function specifies the speed curve of the animation from the clockhand.
   */
  setMathBounce(): void {
    Object.defineProperty(Math, 'easeOutBounce', {
      value: (pos: number) => {
        if ((pos) < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        }

        if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        }

        if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        }

        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    });
  }
}
