import { Injectable } from '@angular/core';
import { Setting } from '../../shared/setting.model';
import { BASE_URI } from '../../app/app.environment';
import { UserProvider } from '../../providers/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

/**
 * Represents the dashboard service.
 */
@Injectable()
export class DashboardService {
  private apiUrl = `${BASE_URI}api`;
  private graphqlUrl = `${BASE_URI}graphql`;

  /**
   * Create the dashboard service
   * @constructor
   * @param {Http} http
   * @param {UserProvider} userData
   */
  constructor(
    private http: HttpClient,
    private userData: UserProvider) { }

  /**
   * Get the settings from the passed user
   * @param {string} username
   * @return {Promise}
   */
  getSettings(username: string): Observable<Array<Setting>> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        return this.http.get<Array<Setting>>(`${this.apiUrl}/settings/${username}`, httpOptions);
      });
  }

  /**
   * Get all the data to show in the tiles
   * @param {string} username
   * @param {Object} settings
   * @return {Promise}
   */
  getData(username: string, settings: Array<Setting>): Observable<any> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        let query = `{settings(user:"${username}") {`;
        if (settings.length > 0) {
          for (let settingIndex = 0; settingIndex < settings.length; settingIndex++) {
            const settingItem = settings[settingIndex];
            if (settingItem)
              if (settingItem.schemas !== undefined && settingItem.schemas !== null)
                query += ` ${settingItem.schemas}`;
          }
          query += '}}';
        } else
          query += 'clock { datetime totalSeconds } }}';

        const BODY = JSON.stringify({
          query: query,
          user: username
        });

        return this.http.post<any>(`${this.graphqlUrl}`, BODY, httpOptions);
      });
  }

  /**
   * Service to delete a setting item
   * @param {string} username
   * @param {Object} setting A Setting Item from the user
   * @return {Promise}
   */
  deleteSetting(username: string, setting: Setting): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        return this.http.delete<boolean>(`${this.apiUrl}/settings/${username}/${setting.id}`, httpOptions);
      });
  }

  /**
   * Service to save a setting item
   * @param {string} username
   * @param {Object} setting A Setting Item from the user
   * @return {Promise}
   */
  saveSetting(username: string, setting: Setting): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          setting
        });

        return this.http.put<boolean>(`${this.apiUrl}/settings/${username}`, BODY, httpOptions);
      });
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
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          username: username,
          password: password,
          newpassword: newpassword,
          newpasswordconfirm: newpasswordconfirm
        });

        return this.http.put<boolean>(`${this.apiUrl}/changepassword`, BODY, httpOptions);
      });
  }

  /**
   * Service for invite friends
   * @param {string} username
   * @param {string} friend
   * @return {Promise}
   */
  inviteFriends(username: string, friend: string): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          username: username,
          friend: friend
        });

        return this.http.post<boolean>(`${this.apiUrl}/invite`, BODY, httpOptions);
      });
  }
}
