import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

import { BASE_URI } from '../../app/app.environment';
import { UserProvider } from '../../providers/user';
import { Tile } from '../../shared/tile.model';

/**
 * Represents the tiles service.
 */
@Injectable()
export class TileService {
  private apiUrl = `${BASE_URI}api`;

  /**
   * Create the Tiles service
   * @constructor
   * @param {Http} http
   * @param {UserProvider} userData
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

  /**
   * Saves a Tile item
   * @param {Object} tile A Tile
   * @return {Promise}
   */
  saveTile(tile: Tile): Observable<boolean> {
    return this.userData.getAccessToken()
      .mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          tile
        });

        return this.http.put<boolean>(`${this.apiUrl}/tiles/${tile.name}`, BODY, httpOptions);
      });
  }
}
