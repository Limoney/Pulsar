import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlgorithmDataOrderType, AlgorithmDetails } from 'src/app/interfaces/algorithm-details';
import * as p5 from 'p5';
import { gsap } from 'gsap';
import { RandomDataGeneratorService } from 'src/app/services/random-data-generator.service';
import { P5Service } from 'src/app/services/p5.service';
import * as Hammer from 'hammerjs';
import { Subscription } from 'rxjs';
import { VisualizationManagerService } from 'src/app/services/visualization-manager.service';
import { VisualizationContext } from 'src/app/interfaces/visualization-context';
import { ThemeService } from 'src/app/services/theme.service';
import { VisualizationAction } from 'src/app/enums/visualization-action';
import * as Prism from 'prismjs';
import { MenuItem, MessageService } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';
import { VisualizationState } from 'src/app/enums/visualization-state';
import { BarVisualizer } from 'src/app/algorithms/visualizers/BarVisualizer/BarVisualizer';
import { Bar } from 'src/app/algorithms/visualizers/BarVisualizer/Bar';
import { AlgorithmOutput } from 'src/app/interfaces/algorithm-output';
import { PrismService } from 'src/app/services/prism.service';


@Component({
	selector: 'app-visualization-panel',
	templateUrl: './visualization-panel.component.html',
	styleUrls: ['./visualization-panel.component.css']
})
export class VisualizationPanelComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input("algorithmDetails")
	public algorithmDetails!: AlgorithmDetails;

	@ViewChild("canvasWrapper")
	canvasWrapperElement!: ElementRef;

	@ViewChild("algorithmCode")
	algorithmCodeElement!: ElementRef;

	@ViewChild("pre")
	preElement!: ElementRef;

	@ViewChild("output")
	algorithmOutputElement!: ElementRef;

	@ViewChild("canvasElement")
	canvasElement!: ElementRef;

	protected sketch!: p5

	public canvasRef!: any;

	protected visualizer!: BarVisualizer;

	private numberOfElements!: number

	private maxElement!: number

	private minElement!: number;

	private p5Subscription!: Subscription;

	private prismSubscription!: Subscription;

	private actionSubscription!: Subscription;

	protected backgroundColor!: string

	protected algorithmOutput?: AlgorithmOutput;

	canvasActions: MenuItem[] = [];

	constructor(private dataGeneratorService: RandomDataGeneratorService, 
				private p5Service: P5Service,
				private visualizationManager: VisualizationManagerService,
				private themeService: ThemeService,
				private prismService: PrismService)
	{
		this.backgroundColor = themeService.getColor("surface-b");
		Bar.defaultFillColor = themeService.getColor("primary-color");
		Bar.defaultStrokeColor = themeService.getColor("primary-600");
	}

	ngOnInit(): void {
		
		//prevent dial from closing after selecting one of the options
		SpeedDial.prototype.onItemClick = function (e: MouseEvent, item: MenuItem) {
			if (item.command) {
				item.command({ originalEvent: e, item });
			}
			this.isItemClicked = true;
		
		};
		this.canvasActions = [
            {
                icon: 'pi pi-search-plus',
                command: () => {
					this.visualizer.camera.zoomAtPoint(this.sketch.createVector(this.sketch.width/2,this.sketch.height/2),
													   1 + this.visualizer.camera.zoomSpeed);
                }
            },
            {
                icon: 'pi pi-search-minus',
                command: () => {
					this.visualizer.camera.zoomAtPoint(this.sketch.createVector(this.sketch.width/2,this.sketch.height/2),
													   1 - this.visualizer.camera.zoomSpeed);
                }
            },
            {
                icon: 'pi pi-undo',
                command: () => {
                   this.visualizer.camera.reset();
                }
            },
        ];
	}

	ngAfterViewInit(): void {
		console.log("IM NEW");
		
		this.p5Subscription = this.p5Service.ready().subscribe((isP5Ready) => {
			if(isP5Ready)
			{
				
				this.sketch = this.p5Service.getP5Instance();
				this.setupCnavas();
				this.sketch.draw = this.drawCanvas.bind(this);
				const boundHandleActions = this.handleUIAction.bind(this);
				this.actionSubscription = this.visualizationManager.getActions().subscribe((actions) => {
					this.visualizationManager.softClear();
					
					for(const action of actions)
					{
						boundHandleActions(action);
					}
				});
			}
		})
		
		// https://techincent.com/code-syntax-highlighter-angular-with-prism-js/
		this.prismSubscription = this.prismService.getHighlightedLines().subscribe((lines) => {
			this.preElement.nativeElement.dataset.line = lines;
			Prism.highlightElement(this.algorithmCodeElement.nativeElement);
		})
		
	}

	ngOnDestroy(): void {
		this.prismService.highlightLines("");
		this.p5Subscription.unsubscribe();
		this.prismSubscription.unsubscribe();
		this.actionSubscription.unsubscribe();
		console.log("destroyed");
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.sketch.resizeCanvas(this.canvasWrapperElement.nativeElement.clientWidth, this.canvasWrapperElement.nativeElement.clientHeight);
	}

	onPanelResizeStart(event: any) {
		gsap.to(this.canvasWrapperElement.nativeElement,{
			opacity: 0,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize(null);
	}

	onPanelResizeEnd(event: any) {
		gsap.to(this.canvasWrapperElement.nativeElement,{
			opacity: 1,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize(null);
	}

	private setupCnavas()
	{
		this.canvasRef = this.sketch.createCanvas(this.canvasWrapperElement.nativeElement.clientWidth,
												  this.canvasWrapperElement.nativeElement.clientHeight,this.sketch.P2D,this.canvasElement.nativeElement);
		this.canvasRef.canvas.style.position = "absolute";
		this.onResize(null);
		
		this.visualizer = new BarVisualizer(this.algorithmDetails.implementation,[]);
		
		this.canvasRef.canvas.addEventListener("wheel",(event:any)=>{
			let direction = 1;
			if(event.deltaY < 0)
				direction+=this.visualizer.camera.zoomSpeed;
			else
				direction+=-this.visualizer.camera.zoomSpeed;
	
			this.visualizer.camera.zoom(direction);
		})
		
		let hammer = new Hammer(this.canvasRef.canvas);

		hammer.on('panstart', (event: any) => {
			this.visualizer.camera.onMoveStart(event.center.x,event.center.y)
		});
		
		hammer.on('panend', (event: any) => {
			this.visualizer.camera.onMoveEnd(event.center.x,event.center.y)
		});

		hammer.on('panmove', (event: any) => {
			this.visualizer.camera.onMove(event.center.x,event.center.y);
		});
	}

	private drawCanvas()
	{
		this.sketch.background(this.backgroundColor);
		this.visualizer.updateAndShow();
	}

	private async handleUIAction(context: VisualizationContext)
	{
		console.log("recived "+ VisualizationAction[context.action]);
		switch(context.action)
		{
			case VisualizationAction.PUSH:
				this.visualizer.push(context.data);
				break
			case VisualizationAction.POP:
				this.visualizer.pop();
				break
			case VisualizationAction.INSERT:
				this.visualizer.insert(context.data.value,context.data.index);
				break
			case VisualizationAction.REMOVE:
				this.visualizer.remove(context.data);
				break
			case VisualizationAction.CLEAR:
				this.visualizer.clear();
				break
			case VisualizationAction.PLAY:
				this.algorithmOutput = await this.visualizer.play(context.data);
				this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
				this.flashOutput();
				this.prismService.highlightLines("");
				break
			case VisualizationAction.RESTART:
				this.visualizer.restart();
				break
			case VisualizationAction.ENABLE_STEP_BY_STEP:
				this.visualizer.enableStepByStep();
				break
			case VisualizationAction.DISABLE_STEP_BY_STEP:
				this.visualizer.disableStepByStep();
				break
			case VisualizationAction.RESUME:
			case VisualizationAction.NEXT_STEP:
				this.visualizer.resume();
				break
			case VisualizationAction.PUASE:
				this.visualizer.pause();
				break
			case VisualizationAction.SET_SPEED:
				this.visualizer.setSpeed(context.data);
				break
			case VisualizationAction.SORT:
				this.visualizer.sort();
				break
			case VisualizationAction.REROLL:
				const data = this.algorithmDetails.dataOrderType == AlgorithmDataOrderType.Sorted ? 
					 this.dataGeneratorService.getSortedData(context.data.count,context.data.min,context.data.max) : 
					 this.dataGeneratorService.getRandomData(context.data.count,context.data.min,context.data.max);
				this.visualizer.setData(data);
				break
		}
	}

	private flashOutput()
	{
		gsap.to(this.algorithmOutputElement.nativeElement,{
			backgroundColor: this.themeService.getColor("primary-color"),
            ease: "sine.out",
            duration: 1,
            repeat: 1,
            yoyo: true
        })
	}
}
// https://github.com/AhsanAyaz/posture-buddy/blob/main/src/app/home/home.component.ts