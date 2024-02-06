import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, RouterStateSnapshot, UrlSegment } from "@angular/router"

export const canMatchGuard: CanMatchFn = (
        route: Route,
        segments: UrlSegment[]
) => {
    console.log('Can Match');
    console.log({ route, segments });
    
    return true;
};

export const canActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state:  RouterStateSnapshot
) => {
    console.log('Can Activate');
    console.log({ route, state });
    
    return true;
};



