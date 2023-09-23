import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import gsap from 'gsap';
import { InputNumber } from 'primeng/inputnumber';
import { VisualizationAction } from 'src/app/enums/visualization-action';
import { VisualizationState } from 'src/app/enums/visualization-state';
import { AlgorithmDetails, AlgorithmType } from 'src/app/interfaces/algorithm-details';
import { VisualizationContext } from 'src/app/interfaces/visualization-context';
import { AlgorithmConfigService } from 'src/app/services/algorithm-config.service';
import { ThemeService } from 'src/app/services/theme.service';
import { VisualizationManagerService } from 'src/app/services/visualization-manager.service';

@Component({
	selector: 'app-control-panel',
	templateUrl: './control-panel.component.html',
	styleUrls: ['./control-panel.component.css', '../ui-panel-shared.css']
})
export class ControlPanelComponent {

	protected animationSpeed: number = 30;

	protected numberOfElements: number = 20;
    
	protected minNumber: number = 10;

	protected maxNumber: number = 500;

	@ViewChild('inputValue')
	protected inputValue!: InputNumber;

	@ViewChild('inputIndex')
	protected inputIndex!: InputNumber;

	@ViewChild('visualizationSearchValue')
	protected visualizationSearchValue!: InputNumber;

	@ViewChild('utilityNumberOfElements')
	protected utilityNumberOfElements!: InputNumber;

	@ViewChild('utilityMaxElement')
	protected utilityMaxElement!: InputNumber;

	@ViewChild('utilityMinlElement')
	protected utilityMinElement!: InputNumber;

	@Input("algorithmDetails")
	public algorithmDetails!: AlgorithmDetails;

	@Input("algorithmIndex")
	public algorithmIndex!: number;

	protected algorithmTypes: typeof AlgorithmType = AlgorithmType;

	protected isStepByStepEnabled:boolean = false;

	protected visualizationStates: typeof VisualizationState = VisualizationState;

	protected currentVisualizationState!: VisualizationState;

	constructor(private visualizationManager: VisualizationManagerService,
				private router: Router,
				private route: ActivatedRoute,
				private themeService: ThemeService,
				protected algorithmConfig: AlgorithmConfigService)
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_SPEED,this.animationSpeed));
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REROLL,{
			count: this.numberOfElements,
			min: this.minNumber,
			max: this.maxNumber
		}));

		//this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_NUMBER_OF_ELEMENTS,this.utilityNumberOfElements));
		this.visualizationManager.getVisualizationState().subscribe(currentVisualizationState => {
			this.currentVisualizationState = currentVisualizationState;
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
		if(this.inputValue.value)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PUSH,this.inputValue.value));
		}
		else
		{
			this.animateInvalidInput(this.inputValue.input.nativeElement);
		}
	}

	protected pop()
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.POP));
	}

	protected insert()
	{
		let valid = true;
		if(!this.inputValue.value)
		{
			this.animateInvalidInput(this.inputValue.input.nativeElement);
			valid = false;
		}
		if(!this.inputIndex.value)
		{
			this.animateInvalidInput(this.inputIndex.input.nativeElement);
			valid = false;
		}

		if(valid)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.INSERT,{
				value: this.inputValue.value,
				index: this.inputIndex.value
			}));
		}
	}

	protected remove()
	{
		if(this.inputIndex.value)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REMOVE,this.inputIndex.value));
		}
		else
		{
			this.animateInvalidInput(this.inputIndex.input.nativeElement);
		}
	}

	protected clear()
	{
		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.CLEAR));
	}

	protected play()
	{
		if(this.algorithmDetails.type == AlgorithmType.Sorting || this.visualizationSearchValue.value)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.PLAY,this.visualizationSearchValue?.value));
			const nextState = this.isStepByStepEnabled? VisualizationState.ANIMATING_MANUAL : VisualizationState.ANIMATING_AUTO;
			this.visualizationManager.setVisualizationState(nextState);
		}
		else
		{
			this.animateInvalidInput(this.visualizationSearchValue.input.nativeElement);
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
		//TODO: fix this. step by step lock ui if pressed befor play
		// const nextStateAnim = this.isStepByStepEnabled? VisualizationState.ANIMATING_MANUAL : VisualizationState.ANIMATING_AUTO;
		// this.visualizationManager.setVisualizationState(nextStateAnim);
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
		let valid = true;
		if(!this.utilityNumberOfElements.value)
		{
			this.animateInvalidInput(this.utilityNumberOfElements.input.nativeElement);
			valid=false;
		}

		if(!this.utilityMaxElement.value)
		{
			this.animateInvalidInput(this.utilityMaxElement.input.nativeElement);
			valid=false;
		}

		if(!this.utilityMinElement.value)
		{
			this.animateInvalidInput(this.utilityMinElement.input.nativeElement);
			valid=false;
		}


		if(valid)
		{
			this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REROLL,{
				count: this.utilityNumberOfElements.value,
				min: this.utilityMinElement.value,
				max: this.utilityMaxElement.value
			}));
		}
	}

	protected prevPage()
	{
		if(this.algorithmIndex > 0)
		{
			console.log("going to "+(this.algorithmIndex-1));
			const nextAlgorithm: AlgorithmDetails = this.algorithmConfig.algorithms.list[this.algorithmIndex-1];
			this.router.navigate([this.algorithmConfig.algorithms.urlPrefix,nextAlgorithm.linkName]);
		}
	}

	protected nextPage()
	{
		if(this.algorithmIndex < this.algorithmConfig.algorithms.list.length-1)
		{
			console.log("going to "+(this.algorithmIndex+1));

			const nextAlgorithm: AlgorithmDetails = this.algorithmConfig.algorithms.list[this.algorithmIndex+1];
			this.router.navigate(["/algorithms",nextAlgorithm.linkName]);
		}
	}

	protected home()
	{
		this.router.navigate(["/"]);
	}

	private animateInvalidInput(inputElement: any)
	{
		gsap.to(inputElement,{
			borderColor: this.themeService.getColor("red-500"),
            ease: "bounce.inOut",
            duration: 0.5,
            repeat: 5,
            yoyo: true
        })
	}
}
