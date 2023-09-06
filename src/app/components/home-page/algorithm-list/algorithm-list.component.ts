import { Component } from '@angular/core';
import { DataViewLayoutOptions } from 'primeng/dataview';
import { Environment } from '../../../../environments/environment';
import { AlgorithmType } from 'src/app/interfaces/algorithm-details';

@Component({
	selector: 'app-algorithms',
	templateUrl: './algorithm-list.component.html',
	styleUrls: ['./algorithm-list.component.css']
})
export class AlgorithmListComponent {
	protected algorithmsRoute = Environment.algorithms.urlPrefix;
	protected algorithmList = Environment.algorithms.list;
	protected algorithmTypes: typeof AlgorithmType = AlgorithmType;
}
