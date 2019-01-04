import { Injectable } from '@angular/core';
import { BASE_URI } from '../../app/app.environment';
import { UserProvider } from '../../providers/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { Tile } from '../../shared/tile.model';

/**
 * Represents the setting service.
 */
@Injectable()
export class SettingService {
  private apiUrl = `${BASE_URI}api`;

  /**
   * Create the dashboard service
   * @constructor
   * @param {Http} http
   * @param {UserData} userData
   */
  constructor(
    private http: HttpClient,
    private userData: UserProvider) { }

  /**
   * Get all tiles
   * @return {Promise}
   */
  getTiles(): Observable<Array<Tile>> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        return this.http.get<Array<Tile>>(`${this.apiUrl}/tiles`, httpOptions);
      });
  }
}
