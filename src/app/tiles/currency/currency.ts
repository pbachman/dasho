import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
import { Setting } from '../../../shared/setting';
import { TileBaseComponent } from '../../../shared/shared.tile';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'grid-currency',
  templateUrl: 'currency.html'
})

/**
 * Represents a currency tile.
 */
export class Currency extends TileBaseComponent {
  @Input('tile') tile: Setting;
  @Output() notify: EventEmitter<Object> = new EventEmitter<Object>();

  options: any;
  Highcharts = Highcharts;
  data: Object;
  currency: string;

  /**
   * Create the currency tile
   * @constructor
   * @param  {Events} privateevents used to subscribe to the `data:ready` event
   */
  constructor(private events: Events) {
    super();

    this.events.subscribe('data:ready', data => {
      if (data) {
        this.data = data.fixer;
        this.currency = data.fixer ? data.fixer.currency : '';
        this.setOptions();
      }
    });
  }

  /**
   * Set the options for the highchart
   */
  setOptions(): void {
    this.options = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
        height: 190,
        width: 230
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      title: {
        text: undefined
      },
      xAxis: {
        type: 'category',
        lineWidth: 0,
        tickLength: 0,
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px'
          }
        }
      },
      yAxis: {
        type: 'logarithmic'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 2,
            format: '{y:.3f}',
            style: {
              color: '#fff'
            }
          }
        }
      },
      series: [{
        name: 'Currency',
        data: this.generateDataForSeries()
      }]
    };
  }

  /**
   * Generate the array for the highchart from the service data
   * @return {Array} Values from the service, formated for the highchart.
   */
  generateDataForSeries(): any {
    const array = [];
    for (const key in this.data)
      if (key !== 'currency')
        array.push([key, this.data[key]]);

    return array;
  }

  /**
   * Static function to round a value a decimal value
   * @param  {number} value The value to round
   * @return {number} The rounded value
   */
  round(value: number): number {
    return Math.round(value * 10000) / 10000;
  }

  /**
   * Event handling from a point. Sets a new reference currency
   * @param  {Object} event Object passed from highchart
   */
  setNewReference(event): void {
    const point = event.context;
    const value = point.y;

    for (const key in this.data)
      if (key !== 'currency')
        this.data[key] = this.round(this.data[key] / value);
    point.series.setData(this.generateDataForSeries());

    this.currency = point.name;
  }
}
