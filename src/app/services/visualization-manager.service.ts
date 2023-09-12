import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { VisualizationAction } from '../enums/visualization-action';
import { VisualizationContext } from '../interfaces/visualization-context';
import { VisualizationState } from '../enums/visualization-state';

@Injectable({
	providedIn: 'root'
})
export class VisualizationManagerService {

	private actionsSubject = new ReplaySubject<VisualizationContext[]>(1);
	private actions: VisualizationContext[] = []
	private visualizationStateSubject = new BehaviorSubject<VisualizationState>(VisualizationState.IDLE);
	private visualizationState = this.visualizationStateSubject.asObservable();

	constructor() {

	}

	public getVisualizationState(): Observable<VisualizationState>
	{
		return this.visualizationState;
	}

	public setVisualizationState(visualizationState: VisualizationState): void
	{
		this.visualizationStateSubject.next(visualizationState);
	}

	public addAction(action: VisualizationContext)
	{
		this.actions.push(action);
		this.actionsSubject.next(this.actions);
	}

	public softClear()
	{
		this.actions = [];
	}

	public getActions()
	{
		return this.actionsSubject.asObservable();
	}


}
