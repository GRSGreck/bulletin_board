import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {Injectable} from "@angular/core";

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let isLoggedIn = this.userService.isLoggedIn();
        if (isLoggedIn) this.router.navigate(['/']);

        return !isLoggedIn;
    }
}