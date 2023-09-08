import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlgorithmDetails } from 'src/app/interfaces/algorithm-details';
import * as p5 from 'p5';
import { gsap } from 'gsap';
import { RandomDataGeneratorService } from 'src/app/services/random-data-generator.service';
import { P5Service } from 'src/app/services/p5.service';
import { BarVisualizer } from './visualizers/BarVisualizer/BarVisualizer';
import * as Hammer from 'hammerjs';
import { Subscription } from 'rxjs';


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

	protected sketch!: p5
	public canvasRef!: any;
	protected visualizer!: BarVisualizer;
	private p5Subscription!: Subscription;

	constructor(private dataGeneratorService: RandomDataGeneratorService, private p5Service: P5Service)
	{
		
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		this.p5Subscription = this.p5Service.ready().subscribe(() => {
			this.sketch = this.p5Service.getP5Instance();
			this.setupCnavas();
			this.sketch.draw = this.drawCanvas.bind(this);
		})
		
	}

	ngOnDestroy(): void {
		// this.sketch.remove();
		// this.p5Service.deleteInstance();
		// console.log("gone");
		// console.log(this.p5Service.getP5Instance());
		// this.sketch.remove();
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
		this.canvasRef = this.sketch.createCanvas(this.canvasWrapper.nativeElement.clientWidth, this.canvasWrapper.nativeElement.clientHeight);
		this.canvasRef.canvas.style.position = "absolute";
		this.canvasRef.parent("canvas-wrapper");
		this.onResize(null);
		this.visualizer = new BarVisualizer(this.dataGeneratorService.getSortedData(20,10,this.sketch.height),true);

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
		this.sketch.background(0);
		this.visualizer.updateAndShow();
	}
}
// https://github.com/AhsanAyaz/posture-buddy/blob/main/src/app/home/home.component.ts