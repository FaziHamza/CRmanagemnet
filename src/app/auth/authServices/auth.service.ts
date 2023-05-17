import { environment } from './../../../environments/environment';
import { LoginModel } from './../../utility/models/login.model';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { User } from 'src/app/utility/models/User';
import { JwtService } from 'src/app/shared/services/jwt.service';
import { ApiConstants } from 'src/app/shared/common/constants';
import { AppResponse } from 'src/app/models/AppResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1)

  constructor(private router: Router, private jwtService: JwtService, private http: HttpClient
    , handler: HttpBackend) { this.http = new HttpClient(handler) }

  // 1  Set Auth
  setAuth(user: any) {
    // saving JWT sent from Server, in LocalStorage
    this.jwtService.saveToken(user.authToken);
    window.localStorage['user'] = JSON.stringify(user);
    window.localStorage['authToken'] = JSON.stringify(user?.authToken);

    // set current user data into  Observable
    this.currentUserSubject.next(user)

    // set isAuthenticated to true
    this.isAuthenticatedSubject.next(true)
  }

  // 2 getCurrent User
  getCurrentUser(): User {
    return this.currentUserSubject.value
  }

  // 3 Destroying Auth
  purgeAuth() {
    // Remove JWT from localStorage.
    this.jwtService.destroyToken();

    // Set Current User to an empty Object
    this.currentUserSubject.next({} as User);

    // Set Auth Status to false
    this.isAuthenticatedSubject.next(false);
    if (!(this.router.url === '/')) {
      this.router.navigateByUrl('/login')
    }
  }

  //   Login:
  public loginUser(model: LoginModel) {
    
    let url = environment.administration + ApiConstants.apiEndPoints.auth.login;
    return this.http.post(url, model)
  }

  // Register
  public userRegister(model: LoginModel) {
    
    // model["userName"] = model["email"];
    let url = environment.administration + ApiConstants.apiEndPoints.auth.register;
    return this.http.post(url, model);
  }
  public confirmEmail(model: any) {
    // model["userName"] = model["email"];
    let url = environment.administration + ApiConstants.apiEndPoints.auth.confirmEmail;
    return this.http.post(url, model);
  }
  sendEmail(emailSendDto): Observable<AppResponse> {
    let url = environment.administration + "XEmail/SendEamil";
    return this.http.post<AppResponse>(url, emailSendDto);
  }
  GetUserList(): Observable<AppResponse> {
    let url = environment.administration + "Account/GetUserList";
    return this.http.get<AppResponse>(url);
  }
  public sendCodeAgain(model: any) {
    // model["userName"] = model["email"];
    let url = environment.administration + ApiConstants.apiEndPoints.auth.sendCodeAgain;
    return this.http.post(url, model);
  }
  public sendSMSAgain(model: any) {
    
    // model["userName"] = model["email"];
    let url = environment.administration + ApiConstants.apiEndPoints.auth.sendSMSAgain;
    return this.http.post(url, model);
  }
  public resetPassword(model: any) {
    let url = environment.administration + ApiConstants.apiEndPoints.auth.resetPassword;
    return this.http.post(url, model);
  }
}
