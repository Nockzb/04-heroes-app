import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router"
import { Observable, map, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

const checkAuthStatus = (): Observable<boolean> => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return authService.checkAuthentication()
        .pipe(
            tap( isAuthenticated => console.log(isAuthenticated)),
            tap((isAuthenticated) => {
                if (isAuthenticated) {
                    router.navigate(['/heroes/list'])                    
                }
            }), 
            map(
                isAuthenticated => !isAuthenticated 
            )
        )
}

export const loginOkMatchGuard: CanMatchFn = (
        route: Route,
        segments: UrlSegment[]
) => {
    console.log('Can Match');
    console.log({ route, segments });
    
    return checkAuthStatus();
};

export const loginOkActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state:  RouterStateSnapshot
) => {
    console.log('Can Activate');
    console.log({ route, state });
    
    return checkAuthStatus();
};