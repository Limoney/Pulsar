import { Component } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { VisualizationAction } from 'src/app/enums/visualization-action';
import { VisualizationState } from 'src/app/enums/visualization-state';
import { VisualizationContext } from 'src/app/interfaces/visualization-context';
import { VisualizationManagerService } from 'src/app/services/visualization-manager.service';

@Component({
	selector: 'app-control-panel',
	templateUrl: './control-panel.component.html',
	styleUrls: ['./control-panel.component.css', '../ui-panel-shared.css']
})
export class ControlPanelComponent {

	protected animationSpeed: number = 30;
	protected inputValue?: number;
	protected inputIndex?: number;
	protected visualizationSearchValue?: number;
	protected utilityNumberOfElements?: number;
	protected isStepByStepEnabled:boolean = false;
	protected visualizationStates: typeof VisualizationState = VisualizationState;
	protected currentState!: VisualizationState;

	constructor(private visualizationManager: VisualizationManagerService, private router: Router)
	{
		// this.visualizationManager.getAction().subscribe((action) => {
		// 	console.log(action.action)
		// 	console.log(action.data)
		// })
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_SPEED,this.animationSpeed));
		//TODO: add QUEUE of actions
		//this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_NUMBER_OF_ELEMENTS,this.utilityNumberOfElements));
		this.visualizationManager.getVisualizationState().subscribe(currentState => {
			this.currentState = currentState;
		})
	}

	scrollNavigation(event: WheelEvent) 
	{
		const currentTarget = event.currentTarget as HTMLElement;
		if (event.deltaY > 0)
		{
			
			gsap.to(currentTarget, {
				scrollLeft: currentTarget.scrollLeft + 100,
				duration: 0.2,
				ease: "power3.out"
			})
		}
		else
		{
			gsap.to(currentTarget, {
				scrollLeft: currentTarget.scrollLeft - 100,
				duration: 0.2,
				ease: "power3.out"
			})
		}
	}

	protected push()
	{
		if(this.inputValue)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PUSH,this.inputValue));
		}
	}

	protected pop()
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.POP));
	}

	protected insert() 
	{
		if(this.inputValue && this.inputIndex)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PUSH,{
				value: this.inputValue,
				index: this.inputIndex
			}));
		}
	}

	protected remove() 
	{
		if(this.inputIndex)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REMOVE,this.inputIndex));
		}
	}

	protected clear() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.CLEAR));
	}

	protected play() 
	{
		if(this.visualizationSearchValue /*|| this.algorithDetails.type == algorithmTypes.SORTING*/)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PLAY,this.visualizationSearchValue));
			const nextState = this.isStepByStepEnabled? VisualizationState.ANIMATING_MANUAL : VisualizationState.ANIMATING_AUTO;
			this.visualizationManager.setVisualizationState(nextState);
		}
	}

	protected restart() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.RESTART));
		this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
	}

	protected stepByStep() 
	{	
		const nextStateStep = this.isStepByStepEnabled ? VisualizationAction.ENABLE_STEP_BY_STEP : VisualizationAction.DISABLE_STEP_BY_STEP
		this.visualizationManager.addAction(new VisualizationContext(nextStateStep));
		const nextStateAnim = this.isStepByStepEnabled? VisualizationState.ANIMATING_MANUAL : VisualizationState.ANIMATING_AUTO;
		this.visualizationManager.setVisualizationState(nextStateAnim);
	}

	protected nextStep() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.NEXT_STEP));
	}

	protected pause() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PUASE));
		this.visualizationManager.setVisualizationState(VisualizationState.ANIMATING_MANUAL);
	}

	protected resume() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.RESUME));
		this.visualizationManager.setVisualizationState(VisualizationState.ANIMATING_AUTO);
		this.isStepByStepEnabled = false;
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.DISABLE_STEP_BY_STEP));
		
	}

	protected setSpeed() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_SPEED,this.animationSpeed));
	}

	protected sort() 
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SORT));
	}

	protected reroll() 
	{
		if(this.utilityNumberOfElements)
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REROLL,this.utilityNumberOfElements));
	}

	protected prevPage() 
	{
		
	}

	protected nextPage() 
	{
		
	}

	protected home() 
	{
		this.router.navigate(["/"]);
	}

} 
