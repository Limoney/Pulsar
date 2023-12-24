import {Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import gsap from 'gsap';
import {InputNumber} from 'primeng/inputnumber';
import {VisualizationAction} from 'src/app/enums/visualization-action';
import {VisualizationState} from 'src/app/enums/visualization-state';
import {AlgorithmDetails, AlgorithmType} from 'src/app/interfaces/algorithm-details';
import {VisualizationContext} from 'src/app/interfaces/visualization-context';
import {AlgorithmConfigService} from 'src/app/services/algorithm-config.service';
import {ThemeService} from 'src/app/services/theme.service';
import {VisualizationManagerService} from 'src/app/services/visualization-manager.service';
import {VisualizerFactoryService} from "../../../services/visualizer-factory.service";
import { ControlPanelAutoState, ControlPanelIdleState, ControlPanelManualState } from 'src/app/interfaces/control-panel-state';

@Component({
	selector: 'app-control-panel',
	templateUrl: './control-panel.component.html',
	styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent {

	protected animationSpeed: number;

	protected numberOfElements: number = 20;

	protected minNumber: number = 10;

	protected maxNumber: number = 500;

    protected selectedVisualizer: any;

    protected hideLabels: boolean;

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

	protected visualizationStates: typeof VisualizationState = VisualizationState;

	private idleState = new ControlPanelIdleState();

	private autoState = new ControlPanelAutoState();

	private manualState = new ControlPanelManualState();

	protected state = this.idleState;

	constructor(private visualizationManager: VisualizationManagerService,
				private router: Router,
				private route: ActivatedRoute,
				private themeService: ThemeService,
				protected algorithmConfig: AlgorithmConfigService,
                protected visualizerFactory: VisualizerFactoryService)
	{
        this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.REROLL,{
            count: this.numberOfElements,
            min: this.minNumber,
            max: this.maxNumber
        }));

        this.animationSpeed = this.visualizationManager.getAttributes().animationSpeedPercent;

        const selectedName = this.visualizationManager.getAttributes().selectedVisualizer;
        const selectedIndex = this.visualizerFactory.visualizerList.map(element => element.name).indexOf(selectedName);
        this.selectedVisualizer = this.visualizerFactory.visualizerList[selectedIndex];

		this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_SPEED,this.animationSpeed));


		//this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_NUMBER_OF_ELEMENTS,this.utilityNumberOfElements));
		this.visualizationManager.getVisualizationState().subscribe(currentVisualizationState => {
			this.setState(currentVisualizationState);
		})

        this.hideLabels = this.visualizationManager.getAttributes().valueLabelsHidden;
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
			this.visualizationManager.setVisualizationState(VisualizationState.ANIMATING_AUTO);
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
		// this.isStepByStepEnabled = false;
		// this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.DISABLE_STEP_BY_STEP));

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

    public toggleLabels()
    {
        this.visualizationManager.getAttributes().valueLabelsHidden = this.hideLabels;
        if(this.hideLabels)
        {
            //this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.HIDE_LABELS));
        }
        else
        {
            //this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SHOW_LABELS));
        }
    }

    protected setVisualizer()
    {
        this.visualizationManager.getAttributes().selectedVisualizer = this.selectedVisualizer.name;
        this.visualizationManager.addAction(new VisualizationContext(VisualizationAction.SET_VISUALIZER))
    }

	protected prevPage()
	{
		if(this.algorithmIndex > 0)
		{
            this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
			const nextAlgorithm: AlgorithmDetails = this.algorithmConfig.algorithms.list[this.algorithmIndex-1];
			this.router.navigate([this.algorithmConfig.algorithms.urlPrefix,nextAlgorithm.linkName]);
		}
	}

	protected nextPage()
	{
		if(this.algorithmIndex < this.algorithmConfig.algorithms.list.length-1)
		{
            this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
			const nextAlgorithm: AlgorithmDetails = this.algorithmConfig.algorithms.list[this.algorithmIndex+1];
			this.router.navigate(["/algorithms",nextAlgorithm.linkName]);
		}
	}

	protected home()
	{
        this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
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

	private setState(visualizationState: VisualizationState){
		console.log(VisualizationState[visualizationState]);
		
		switch(visualizationState){
			case VisualizationState.IDLE:
				this.state = this.idleState;
				break;
			case VisualizationState.ANIMATING_AUTO:
				this.state = this.autoState;
				break;
			case VisualizationState.ANIMATING_MANUAL:
				this.state = this.manualState;
				break;
		}
	}
}
