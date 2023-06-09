import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { EnvService } from "./envoirment.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    authReq: any;

    constructor(private router: Router, private envService: EnvService) {

     }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {

        if (err.status === 401|| err.status === 403) {
            this.clearStorage();
            this.envService.showWarning();
            // this.router.navigateByUrl('/login');
            return of(err.message);
        }
        return throwError(err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // if (req.url.includes('login')) {
        //     this.authReq = req.clone({
        //         headers: req.headers.set('generaltoken', this.envService.GeneralToken)
        //     })
        // }
        // if (!req.url.includes('StaffLoginLambdaFunction')) {
        //     this.authReq = req.clone({
        //         headers: req.headers.set('generaltoken', this.envService.GeneralToken).set('secret', 'Bearer ' + JSON.parse(localStorage.getItem('token')!))
        //     })
        // }
        let token =JSON.parse(localStorage.getItem('authToken')!);

        this.authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        return next.handle(this.authReq).pipe(catchError(x => this.handleAuthError(x)));
    }
    clearStorage() {
        // localStorage.removeItem('authToken');
        localStorage.clear();
    }
}
