import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tile } from '../../shared/tile.model';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/user.service';
import { mergeMap } from 'rxjs/operators';

/**
 * Represents the setting service.
 */
@Injectable()
export class SettingService {
  private apiUrl = `${environment.BASE_URI}api`;

  /**
   * Create the Setting service
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
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.get<Array<Tile>>(`${this.apiUrl}/tiles`, httpOptions);
      }));
  }

  /**
   * Add new Config Item
   * @return {Promise}
   */
  addConfigs(username: string, tile: string): Observable<boolean> {
    return this.userprovider.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.post<boolean>(`${this.apiUrl}/settings/${username}/${tile}`, httpOptions);
      }));
  }

  /**
   * Get unassigned tiles by a Username
   * @return {Promise}
   */
  getUnassignedTiles(username: string): Observable<Array<Tile>> {
    return this.userprovider.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.get<Array<Tile>>(`${this.apiUrl}/settings/unassigned/${username}`, httpOptions);
      }));
  }
}
