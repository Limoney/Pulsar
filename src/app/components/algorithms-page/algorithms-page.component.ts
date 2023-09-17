import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { tempName } from 'src/app/route-animations';
import { Environment } from 'src/environments/environment';

@Component({
	selector: 'app-algorithms',
	templateUrl: './algorithms-page.component.html',
	styleUrls: ['./algorithms-page.component.css'],
	animations: [
		tempName
	]
})
export class AlgorithmsPageComponent implements OnInit {

	protected loading: boolean = true;
	protected currentAlgorithm?: AlgorithmDetails;
	protected currentAlgorithmIndex: number = 0;

	constructor(private route: ActivatedRoute) { 

	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			const name = params['name'];
			if(name)
			{
				this.currentAlgorithmIndex = Environment.algorithms.list.map(elem => elem.linkName).indexOf(name);
				this.currentAlgorithm = Environment.algorithms.list[this.currentAlgorithmIndex];
			}
			this.loading = false;
		});
	}

}
