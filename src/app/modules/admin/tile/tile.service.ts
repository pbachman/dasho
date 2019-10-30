import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { Tile } from '../models/tile.model';

/**
 * Represents the tiles service.
 */
@Injectable()
export class TileService {
  private apiUrl = `${environment.BASE_URI}api`;

  /**
   * Create the Tiles service
   */
  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  /**
   * Get all tiles
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
   * Saves a Tile item
   */
  saveTile(tile: Tile): Observable<boolean> {
    return this.userService.getAccessToken()
      .pipe(mergeMap((token: string) => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          })
        };

        const BODY = JSON.stringify({
          tile
        });

        return this.http.put<boolean>(`${this.apiUrl}/tiles/${tile.name}`, BODY, httpOptions);
      }));
  }
}
