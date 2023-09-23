import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bottomTop } from 'src/app/route-animations';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css'],
    animations: [
        bottomTop
    ]
})
export class HomePageComponent {
    playAnim(outlet: any)
	{
		const result = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
		console.log("home-amim: "+ result);
		
		return result;
	}

    test()
    {
        console.log("homepage-route activated");
        
    }
}
