import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { tempName } from 'src/app/route-animations';
import { AlgorithmConfigService } from 'src/app/services/algorithm-config.service';
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

	constructor(private route: ActivatedRoute, private algorithmConfig: AlgorithmConfigService) { 

	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			const name = params['name'];
			if(name)
			{
				this.currentAlgorithmIndex = this.algorithmConfig.algorithms.list.map(elem => elem.linkName).indexOf(name);
				this.currentAlgorithm = this.algorithmConfig.algorithms.list[this.currentAlgorithmIndex];
			}
			this.loading = false;
		});
	}

}
