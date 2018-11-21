import { Injectable } from '@angular/core';

@Injectable()

/**
 * Represents the clock (as lazy initialisation).
 */
export class ClockSingleton {
  private static instance: ClockSingleton;
  private initialized: boolean = false;
  private secondsOffset: number = 0;

  /**
   * The constructor is set to private
   * @constructor
   */
  private constructor() { }

  /**
   * Get the instance of the singleton
   * @return {ClockSingleton} The singleton
   */
  static getInstance() {
    if (!ClockSingleton.instance) {
      ClockSingleton.instance = new ClockSingleton();
    }
    return ClockSingleton.instance;
  }

  /**
   * Set the offset between the server time and the user time
   * @param {number} serverTimeInSeconds The server time in seconds from the server answer
   */
  public setOffset(serverTimeInSeconds: number): void {
    if (!this.initialized) {
      let timeOnClient: number = this.getTimeInSeconds() - new Date().getTimezoneOffset() * 60;
      this.initialized = true;
      this.secondsOffset = timeOnClient - serverTimeInSeconds;
    }
  }

  /**
   * Get the client unix time in seconds
   * @return {number} The rounded number
   */
  private getTimeInSeconds(): number {
    return Math.round(new Date().getTime() / 1000);
  }

  /**
   *  @typedef Time
   *  @type {Object}
   *  @property {number} hour The hour
   *  @property {number} minute The minute
   *  @property {number} second The second
   */

  /**
   * Get the time with the local offset
   * @return {Time} The object with hours, minutes and seconds.
   */
  public getTime() {
    let time = this.getTimeInSeconds() + this.secondsOffset;

    return {
      hour: ~~(time / 3600 % 24),
      minute: ~~((time % 3600) / 60),
      second: time % 60
    };
  }
}
