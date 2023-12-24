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
import {VisualizerAttributes} from "../../../algorithms/visualizers/visualizer-attributes";
import {PieVisualizer} from "../../../algorithms/visualizers/PieVisualizer/PieVisualizer";
import {Visualizer} from "../../../algorithms/visualizers/visualizer";
import {VisualizerFactoryService} from "../../../services/visualizer-factory.service";
import {Camera} from "../../../algorithms/utility/Camera";

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

	protected visualizer!: Visualizer;

	private numberOfElements!: number

	private maxElement!: number

	private minElement!: number;

	private p5Subscription!: Subscription;

	private prismSubscription!: Subscription;

	private actionSubscription!: Subscription;

	protected backgroundColor!: string

	protected algorithmOutput?: AlgorithmOutput;

	canvasActions: MenuItem[] = [];

    private visualizerAttributes: VisualizerAttributes;

    private selectedVisualizerType!: any;

    private camera!: Camera;

    private visualizationData: number[] = [];

	constructor(private dataGeneratorService: RandomDataGeneratorService,
				private p5Service: P5Service,
				private visualizationManager: VisualizationManagerService,
				private themeService: ThemeService,
				private prismService: PrismService,
                private visualizerFactory: VisualizerFactoryService)
	{
		this.backgroundColor = themeService.getColor("surface-b");
        this.visualizerAttributes = this.visualizationManager.getAttributes();
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
					this.camera.zoomAtPoint(this.sketch.createVector(this.sketch.width/2,this.sketch.height/2),
													   1 + this.camera.zoomSpeed);
                }
            },
            {
                icon: 'pi pi-search-minus',
                command: () => {
					this.camera.zoomAtPoint(this.sketch.createVector(this.sketch.width/2,this.sketch.height/2),
													   1 - this.camera.zoomSpeed);
                }
            },
            {
                icon: 'pi pi-undo',
                command: () => {
                   this.camera.reset();
                }
            },
        ];
	}

	ngAfterViewInit(): void {
		this.p5Subscription = this.p5Service.ready().subscribe((isP5Ready) => {
			if(isP5Ready)
			{

                setTimeout(() => {
                    this.camera = new Camera();
                    this.visualizer = this.visualizerFactory.create(this.visualizationManager.getAttributes().selectedVisualizer,
                        this.camera,
                        this.algorithmDetails.implementation,
                        this.visualizationData);

                    this.sketch = this.p5Service.getP5Instance();
                    this.setupCanvas();
                    this.sketch.draw = this.drawCanvas.bind(this);
                    const boundHandleActions = this.handleUIAction.bind(this);
                    this.actionSubscription = this.visualizationManager.getActions().subscribe((actions) => {
                        this.visualizationManager.softClear();

                        for(const action of actions)
                        {
                            boundHandleActions(action);
                        }
                    });
                },0);
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
	}

	@HostListener('window:resize', ['$event'])
	onResize(event?: any) {
        console.log("size res: " + this.canvasWrapperElement.nativeElement.clientWidth +" " + this.canvasWrapperElement.nativeElement.clientHeight);
		this.sketch.resizeCanvas(this.canvasWrapperElement.nativeElement.clientWidth, this.canvasWrapperElement.nativeElement.clientHeight);
	}

	onPanelResizeStart(event: any) {
		gsap.to(this.canvasWrapperElement.nativeElement,{
			opacity: 0,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize();
	}

	onPanelResizeEnd(event: any) {
		gsap.to(this.canvasWrapperElement.nativeElement,{
			opacity: 1,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize();
	}

	private setupCanvas()
	{
		this.canvasRef = this.sketch.createCanvas(this.canvasWrapperElement.nativeElement.clientWidth,
												  this.canvasWrapperElement.nativeElement.clientHeight,this.sketch.P2D,this.canvasElement.nativeElement);
		this.canvasRef.canvas.style.position = "absolute";
		//this.onResize(null);

        console.log("size: " + this.canvasWrapperElement.nativeElement.clientWidth +" " + this.canvasWrapperElement.nativeElement.clientHeight);

		this.canvasRef.canvas.addEventListener("wheel",(event:any)=>{
			let direction = 1;
			if(event.deltaY < 0)
				direction+=this.camera.zoomSpeed;
			else
				direction+=-this.camera.zoomSpeed;

			this.camera.zoom(direction);
		})

		let hammer = new Hammer(this.canvasRef.canvas);

		hammer.on('panstart', (event: any) => {
			this.camera.onMoveStart(event.center.x,event.center.y)
		});

		hammer.on('panend', (event: any) => {
			this.camera.onMoveEnd(event.center.x,event.center.y)
		});

		hammer.on('panmove', (event: any) => {
			this.camera.onMove(event.center.x,event.center.y);
		});
	}

	private drawCanvas()
	{
		this.sketch.background(this.backgroundColor);
		this.visualizer?.update();
	}

	private async handleUIAction(context: VisualizationContext): Promise<void>
	{
		//console.log("received "+ VisualizationAction[context.action]);
		switch(context.action)
		{
			case VisualizationAction.PUSH:
				this.visualizer.push(this.visualizer.createElement(context.data));
                this.visualizationData.push(context.data)
				break
			case VisualizationAction.POP:
				this.visualizer.pop();
                this.visualizationData.pop();
				break
			case VisualizationAction.INSERT:
				this.visualizer.insert(this.visualizer.createElement(context.data.value),context.data.index);
                this.visualizationData.splice(context.data.index, 0, context.data.value);
				break
			case VisualizationAction.REMOVE:
				this.visualizer.remove(context.data);
                this.visualizationData.splice(context.data.index,1);
				break
			case VisualizationAction.CLEAR:
				this.visualizer.clear();
                this.visualizationData = [];
				break
			case VisualizationAction.PLAY:
                this.visualizer.restart(this.visualizationData);
				this.algorithmOutput = await this.visualizer.play(context.data);
				this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
				this.flashOutput();
				this.prismService.highlightLines("");
				break
			case VisualizationAction.RESTART:
				this.visualizer.restart(this.visualizationData);
				break
			case VisualizationAction.RESUME:
				this.visualizer.resume();
				break;
			case VisualizationAction.NEXT_STEP:
				this.visualizer.nextStep();
				break
			case VisualizationAction.PUASE:
				this.visualizer.pause();
				break
			case VisualizationAction.SET_SPEED:
				this.visualizer.setSpeed(context.data);
				break
			case VisualizationAction.SORT:
				this.visualizer.sort();
                this.visualizationData.sort( (a,b) => a-b);
				break
			case VisualizationAction.REROLL:
				this.visualizationData = this.algorithmDetails.dataOrderType == AlgorithmDataOrderType.Sorted ?
                                         this.dataGeneratorService.getSortedData(context.data.count,context.data.min,context.data.max) :
                                         this.dataGeneratorService.getRandomData(context.data.count,context.data.min,context.data.max);
                if(this.visualizer)
                {
                    this.visualizer.setData(this.visualizationData);
                }
				break
            case VisualizationAction.SET_VISUALIZER:
                this.camera = new Camera();
                this.visualizer = this.visualizerFactory.create(this.visualizationManager.getAttributes().selectedVisualizer,
                                                                this.camera,
                                                                this.algorithmDetails.implementation,
                                                                this.visualizationData);
                break;
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
