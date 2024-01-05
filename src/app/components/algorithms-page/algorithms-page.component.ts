import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { algorithmPageTransition } from 'src/app/route-animations';
import { AlgorithmConfigService } from 'src/app/services/algorithm-config.service';
import {ReplaySubject} from "rxjs";

@Component({
	selector: 'app-algorithms',
	templateUrl: './algorithms-page.component.html',
	styleUrls: ['./algorithms-page.component.css'],
	animations: [
		algorithmPageTransition
	]
})
export class AlgorithmsPageComponent implements OnInit 
{

	protected currentAlgorithm?: AlgorithmDetails;
	protected currentAlgorithmIndex: number = 0;

	constructor(private route: ActivatedRoute,
				private router: Router, 
				private algorithmConfig: AlgorithmConfigService) 
	{

	}

	ngOnInit(): void {
		const algorithmName = this.route.snapshot.params['name'];
		if(algorithmName) 
		{
			this.currentAlgorithmIndex = this.algorithmConfig.algorithms.list.map(elem => elem.linkName).indexOf(algorithmName);
			this.currentAlgorithm = this.algorithmConfig.algorithms.list[this.currentAlgorithmIndex];
		}
		else
		{
			//this.router.navigate(["/"]);
		}
	}

    // playAnim(outlet: RouterOutlet)
    // {
    //     const result = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    //     console.log("algo-amim: "+ result);
    //
    //     return result;
    // }

	test()
	{
		console.log("algo-router activated");

	}
}
