import { Injectable } from '@angular/core';
import { Setting } from '../../shared/setting';
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

  /**
   * Create the dashboard service
   * @param  {Http}     privatehttp
   * @param  {UserData} privateuserData
   */
  constructor(
    private http: HttpClient,
    private userData: UserProvider) { }

  private apiUrl = BASE_URI + 'api';
  private graphqlUrl = BASE_URI + 'graphql';

  /**
   * Get the settings from the passed user
   * @param  {string}  username
   * @return {Promise}
   */
  getSettings(username: string): Observable<Setting[]> {
    return this.userData.getAccessToken()
      .mergeMap((token) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
        return this.http.get<Setting[]>(`${this.apiUrl}/settings/${username}`, httpOptions);
      });
  }

  /**
   * Get all the data to show in the tiles
   * @param  {string}  username
   * @param  {Object}  settings
   * @return {Promise}
   */
  getData(username: string, settings: Setting[]): Observable<any> {
    return this.userData.getAccessToken()
      .mergeMap((token) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        let query = `{settings(user:"${username}") {`;
        for (var settingIndex = 0; settingIndex < settings.length; settingIndex++) {
          let settingItem = settings[settingIndex];
          if (settingItem) {
            if (settingItem.schemas !== undefined && settingItem.schemas !== null) {
              query += ' ' + settingItem.schemas;
            }
          }
        }
        query += '}}'

        const BODY = JSON.stringify({
          query: query,
          user: username
        });

        return this.http.post<any>(`${this.graphqlUrl}`, BODY, httpOptions);
      });
  }

  /**
   * Service to save the settings
   * @param  {string}  username
   * @param  {Object}  setting  The Settings from the user
   * @return {Promise}
   */
  saveSetting(username: string, setting: Setting): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token) => {
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
   * @param  {string}   username
   * @param  {string}   password
   * @param  {string}   newpassword
   * @param  {string}   newpasswordconfirm
   * @return {Promise}
   */
  changePassword(username: string, password: string, newpassword: string, newpasswordconfirm: string): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token) => {
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
   * @param  {string}   username
   * @param  {string}   friend
   * @return {Promise}
   */
  inviteFriends(username: string, friend: string): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token) => {
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
