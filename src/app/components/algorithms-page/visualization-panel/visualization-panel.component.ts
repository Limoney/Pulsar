import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlgorithmDetails } from 'src/app/interfaces/algorithm-details';
import * as p5 from 'p5';
import { gsap } from 'gsap';
import { RandomDataGeneratorService } from 'src/app/services/random-data-generator.service';
import { P5Service } from 'src/app/services/p5.service';
import { BarVisualizer } from './visualizers/BarVisualizer/BarVisualizer';
import * as Hammer from 'hammerjs';
import { Subscription } from 'rxjs';
import { VisualizationManagerService } from 'src/app/services/visualization-manager.service';
import { VisualizationContext } from 'src/app/interfaces/visualization-context';
import { ThemeService } from 'src/app/services/theme.service';
import { Bar } from './visualizers/BarVisualizer/Bar';
import { VisualizationAction } from 'src/app/enums/visualization-action';
import * as Prism from 'prismjs';
import { MenuItem, MessageService } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';
import { VisualizationState } from 'src/app/enums/visualization-state';


@Component({
	selector: 'app-visualization-panel',
	templateUrl: './visualization-panel.component.html',
	styleUrls: ['./visualization-panel.component.css']
})
export class VisualizationPanelComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input("algorithmDetails")
	public algorithmDetails!: AlgorithmDetails;

	@ViewChild("canvasWrapper")
	canvasWrapper!: ElementRef;

	@ViewChild("algorithmCode")
	algorithmCode!: ElementRef;

	protected sketch!: p5
	public canvasRef!: any;
	protected visualizer!: BarVisualizer;
	private p5Subscription!: Subscription;
	protected backgroundColor!: string

	canvasActions: MenuItem[] = [];

	constructor(private dataGeneratorService: RandomDataGeneratorService, 
				private p5Service: P5Service,
				private visualizationManager: VisualizationManagerService,
				private themeService: ThemeService)
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
		this.p5Subscription = this.p5Service.ready().subscribe((isP5Ready) => {
			
			if(isP5Ready)
			{
				this.sketch = this.p5Service.getP5Instance();
				this.setupCnavas();
				this.sketch.draw = this.drawCanvas.bind(this);
				const boundHandleActions = this.handleUIAction.bind(this);
				this.visualizationManager.getActions().subscribe((actions) => {
					this.visualizationManager.softClear();
					
					for(const action of actions)
					{
						boundHandleActions(action);
					}
				});
			}
		})
		
		// https://techincent.com/code-syntax-highlighter-angular-with-prism-js/
		Prism.highlightElement(this.algorithmCode.nativeElement,false,()=>{
			console.log("done");
		});
		
	}

	ngOnDestroy(): void {
		this.p5Subscription.unsubscribe();
		
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.sketch.resizeCanvas(this.canvasWrapper.nativeElement.clientWidth, this.canvasWrapper.nativeElement.clientHeight);
	}

	onPanelResizeStart(event: any) {
		gsap.to(this.canvasWrapper.nativeElement,{
			opacity: 0,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize(null);
	}

	onPanelResizeEnd(event: any) {
		gsap.to(this.canvasWrapper.nativeElement,{
			opacity: 1,
			duration: 0.5,
			ease: "power4.inOut"
		})
		this.onResize(null);
	}

	private setupCnavas()
	{
		this.canvasRef = this.sketch.createCanvas(this.canvasWrapper.nativeElement.clientWidth,
												  this.canvasWrapper.nativeElement.clientHeight);
		this.canvasRef.canvas.style.position = "absolute";
		this.canvasRef.parent("canvas-wrapper");
		this.onResize(null);
		this.visualizer = new BarVisualizer(this.algorithmDetails.implementation,
											this.dataGeneratorService.getSortedData(20,10,this.sketch.height));
		
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
				this.visualizer.remove(context.data.index);
				break
			case VisualizationAction.CLEAR:
				this.visualizer.clear()
				break
			case VisualizationAction.PLAY:
				const result = await this.visualizer.play(context.data) //disable step by step, need data from ui
				this.visualizationManager.setVisualizationState(VisualizationState.IDLE);
				break
			case VisualizationAction.RESTART:
				this.visualizer.restart()
				break
			case VisualizationAction.ENABLE_STEP_BY_STEP:
				this.visualizer.enableStepByStep()
				break
			case VisualizationAction.DISABLE_STEP_BY_STEP:
				this.visualizer.disableStepByStep()
				break
			case VisualizationAction.RESUME:
			case VisualizationAction.NEXT_STEP:
				this.visualizer.resume()
				break
			case VisualizationAction.PUASE:
				this.visualizer.pause()
				break
			case VisualizationAction.SET_SPEED:
				this.visualizer.setSpeed(context.data)
				break
			case VisualizationAction.SORT:
				this.visualizer.sort()
				break
			case VisualizationAction.REROLL:
				this.visualizer.setData(this.dataGeneratorService.getSortedData(context.data,10,this.sketch.height))
				break
		}
		
	}
}
// https://github.com/AhsanAyaz/posture-buddy/blob/main/src/app/home/home.component.ts