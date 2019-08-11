import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tile } from '../../shared/tile.model';
import { mergeMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

/**
 * Represents the tiles service.
 */
@Injectable()
export class TileService {
  private apiUrl = `${environment.BASE_URI}api`;

  /**
   * Create the Tiles service
   * @constructor
   * @param {Http} http
   * @param {UserProvider} userprovider
   */
  constructor(
    private http: HttpClient,
    private userprovider: UserService) { }

  /**
   * Get all tiles
   * @return {Promise}
   */
  getTiles(): Observable<Array<Tile>> {
    return this.userprovider.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };

        return this.http.get<Array<Tile>>(`${this.apiUrl}/tiles`, httpOptions);
      }));
  }

  /**
   * Saves a Tile item
   * @param {Object} tile A Tile
   * @return {Promise}
   */
  saveTile(tile: Tile): Observable<boolean> {
    return this.userprovider.getAccessToken()
      .pipe(mergeMap((token: string) => {
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
      }));
  }
}
