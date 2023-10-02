import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { AlgorithmConfigService } from 'src/app/services/algorithm-config.service';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css'],
    // animations: [
    //     algorithmPageTransition
    // ]
})
export class AlgorithmComponent {
  protected loading: boolean = true;
	protected currentAlgorithm!: AlgorithmDetails;
	protected currentAlgorithmIndex: number = 0;

	constructor(private route: ActivatedRoute, private algorithmConfig: AlgorithmConfigService) {

	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
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
