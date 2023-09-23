import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { AlgorithmsPageComponent } from "../components/algorithms-page/algorithms-page.component";

export class ReuseStrategy extends BaseRouteReuseStrategy  {
    
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig && curr.component !== AlgorithmsPageComponent;
    }
}