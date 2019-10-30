import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Setting } from 'src/app/modules/tiles/models/setting.model';
import { User } from '../models/user.model';

/**
 * Represents the dashboard service.
 */
@Injectable()
export class DashboardService {
  private apiUrl = `${environment.BASE_URI}api`;
  private graphqlUrl = `${environment.BASE_URI}graphql`;

  /**
   * Create the dashboard service
   * @constructor
   * @param {Http} http
   * @param {userService} userService
   */
  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  /**
   * Get the settings from the passed user
   * @param {string} username
   * @return {Promise}
   */
  getSettings(username: string): Observable<Array<Setting>> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.get<Array<Setting>>(`${this.apiUrl}/settings/${username}`, httpOptions);
      }));
  }

  /**
   * Get the Profiledata
   * @return {Promise}
   */
  getUserprofile(): Observable<User> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.get<User>(`${this.apiUrl}/account/current`, httpOptions);
      }));
  }

  /**
   * Get all the data to show in the tiles
   * @param {string} username
   * @param {Object} settings
   * @return {Promise}
   */
  getData(username: string, settings: Array<Setting>): Observable<any> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        let query = `{settings(user:"${username}") {`;
        if (settings.length > 0) {
          for (const settingItem of settings) {
            if (settingItem.schemas !== undefined && settingItem.schemas !== null) {
              query += ` ${settingItem.schemas}`;
            }
          }
          query += '}}';
        } else {
          query += 'clock { datetime totalSeconds } }}';
        }

        const BODY = JSON.stringify({
          query,
          user: username
        });

        return this.http.post<any>(`${this.graphqlUrl}`, BODY, httpOptions);
      }));
  }

  /**
   * Service to delete a setting item
   * @param {string} username
   * @param {Object} setting A Setting Item from the user
   * @return {Promise}
   */
  deleteSetting(username: string, setting: Setting): Observable<boolean> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.delete<boolean>(`${this.apiUrl}/settings/${username}/${setting.id}`, httpOptions);
      }));
  }

  /**
   * Service to save a setting item
   * @param {string} username
   * @param {Object} setting A Setting Item from the user
   * @return {Promise}
   */
  saveSetting(username: string, setting: Setting): Observable<boolean> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          setting
        });

        return this.http.put<boolean>(`${this.apiUrl}/settings/${username}`, BODY, httpOptions);
      }));
  }

  /**
   * Service for change to password
   * @param {string} username
   * @param {string} password
   * @param {string} newpassword
   * @param {string} newpasswordconfirm
   * @return {Promise}
   */
  changePassword(username: string, password: string, newpassword: string, newpasswordconfirm: string): Observable<boolean> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          username,
          password,
          newpassword,
          newpasswordconfirm
        });

        return this.http.put<boolean>(`${this.apiUrl}/changepassword`, BODY, httpOptions);
      }));
  }

  /**
   * Service for invite friends
   * @param {string} username
   * @param {string} friend
   * @return {Promise}
   */
  inviteFriends(username: string, friend: string): Observable<boolean> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          username,
          friend
        });

        return this.http.post<boolean>(`${this.apiUrl}/invite`, BODY, httpOptions);
      }));
  }
}
