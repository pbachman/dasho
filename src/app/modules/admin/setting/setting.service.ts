import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { mergeMap } from 'rxjs/operators';
import { Tile } from '../models/tile.model';

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
   * @param {userService} userService
   */
  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  /**
   * Get all tiles
   * @return {Promise}
   */
  getTiles(): Observable<Array<Tile>> {
    return this.userService.getAccessToken()
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
  addConfigs(username: string, tile: string): Observable<string> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        return this.http.post<string>(`${this.apiUrl}/settings/${username}`, { tile }, httpOptions);
      }));
  }

  /**
   * Get unassigned tiles by a Username
   * @return {Promise}
   */
  getUnassignedTiles(username: string): Observable<Array<Tile>> {
    return this.userService.getAccessToken()
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
