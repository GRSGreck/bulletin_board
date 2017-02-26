import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {UserService} from "../../user/user.service";

@Injectable()

export class NotAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let isLoggedIn = this.userService.isLoggedIn();
        if (!isLoggedIn) this.router.navigate(['login']);

        return isLoggedIn;
    }
}