import { Component } from '@angular/core';
import { DataViewLayoutOptions } from 'primeng/dataview';
import { Environment } from '../../../../environments/environment';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { AlgorithmConfigService } from 'src/app/services/algorithm-config.service';

@Component({
	selector: 'app-algorithm-list',
	templateUrl: './algorithm-list.component.html',
	styleUrls: ['./algorithm-list.component.css']
})
export class AlgorithmListComponent {
	protected algorithmsRoute: string;
	protected algorithmList: AlgorithmDetails[];
	protected algorithmTypes: typeof AlgorithmType = AlgorithmType;

	constructor(private algorithmConfing: AlgorithmConfigService)
	{
		this.algorithmsRoute = algorithmConfing.algorithms.urlPrefix;
		this.algorithmList = algorithmConfing.algorithms.list;
	}
}
