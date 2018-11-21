import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting';
import { ClockSingleton } from '../../../providers/clockSingleton';
import { TileBaseComponent } from '../../../shared/shared.tile';

@Component({
  selector: 'grid-clock',
  templateUrl: 'clock.html'
})

/**
 * Represents a clock tile.
 */
export class Clock extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();
  options: any | boolean = false;
  private interval: any;
  private clockSingleton = ClockSingleton.getInstance();

  /**
   * Create the clock tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();

    this.setMathBounce();
    this.events.subscribe('data:ready', data => {
      this.onReady();
    });
  }

  /**
   *  @typedef Angles
   *  @type {Object}
   *  @property {number} hours The angle for the hour clockhand.
   *  @property {number} minutes he angle for the minute clockhand.
   *  @property {number} seconds he angle for the second clockhand.
   */

  /**
   * Get the angles for the clock. The time is taken from the clockSingleton
   * @return {Angles} The object with the angles for hours, minutes and seconds for the clock.
   */
  private getAngles() {
    const time = this.clockSingleton.getTime();

    return {
      hours: time.hour + time.minute / 60,
      minutes: time.minute * 12 / 60 + time.second * 12 / 3600,
      seconds: time.second * 12 / 60
    };
  }

  /**
   * Clear the interval and set the options for the highchart clock
   */
  private onReady(): void {
    clearInterval(this.interval);

    let now = this.getAngles();

    this.options = {
      credits: {
        enabled: false
      },
      title: {
        text: null
      },
      chart: {
        type: 'gauge',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
        height: 230,
        width: 230
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
          } : null
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
          y: now.hours,
          dial: {
            radius: '60%',
            baseWidth: 4,
            baseLength: '95%',
            rearLength: 0
          }
        }, {
          id: 'minute',
          y: now.minutes,
          dial: {
            baseLength: '95%',
            rearLength: 0
          }
        }, {
          id: 'second',
          y: now.seconds,
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

  }

  /**
   * Initate the interval who make the clock move.
   */
  public moveClock(event): void {
    let chart = event.context;
    this.interval = setInterval(() => {

      let now = this.getAngles();

      if (chart.axes) { // not destroyed
        let hour = chart.get('hour');
        let minute = chart.get('minute');
        let second = chart.get('second');

        // run animation unless we're wrapping around from 59 to 0
        let animation = now.seconds === 0 ? false : { easing: 'easeOutBounce' };

        hour.update(now.hours, true, animation);
        minute.update(now.minutes, true, animation);
        second.update(now.seconds, true, animation);
      }
    }, 1000);
  }

  /**
   * Animation timing function specifies the speed curve of the animation from the clockhand.
   */
  private setMathBounce(): void {
    Object.defineProperty(Math, 'easeOutBounce', {
      value: function (pos) {
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
    })
  }

}
