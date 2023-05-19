import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        if (!localStorage.getItem('authToken')) { // or however you manage your user authentication
            this.router.navigate(['/login']); // navigate to login if not authenticated
            return false;
        }
        return true;
    }
}
