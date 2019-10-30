import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Represents the login service.
 */
@Injectable()
export class LoginService {

  /**
   * Create the service
   * @param {Http} http
   */
  constructor(
    private http: HttpClient) { }

  /**
   * Login the user with oAuth
   * @param  {string}   username
   * @param  {string}   password
   * @return {Promise}
   */
  login(username: string, password: string): Observable<string> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('grant_type', 'password');
    urlSearchParams.append('client_id', 'dasho');
    urlSearchParams.append('client_secret', '$ecret');
    urlSearchParams.append('username', username);
    urlSearchParams.append('password', password);
    const BODY = urlSearchParams.toString();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<string>(`${environment.BASE_URI}oauth/token`, BODY, httpOptions);
  }

  /**
   * Send the forget password email
   * @param  {string}   email
   * @return {Promise}
   */
  forgetPassword(email: string): Observable<boolean> {
    const API_URL = `${environment.BASE_URI}api/pwdreset`;
    const BODY = JSON.stringify({
      username: email
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(API_URL, BODY, httpOptions);
  }

  /**
   * Sign up a new User
   * @param {string} email
   * @param {string} password
   * @return {Promise}
   */
  signUp(email: string, password: string): Observable<boolean> {
    const API_URL = `${environment.BASE_URI}api/account`;
    const BODY = JSON.stringify({
      email,
      password
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(API_URL, BODY, httpOptions);
  }
}
