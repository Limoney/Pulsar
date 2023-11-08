import {Animatable} from "../animatable";
import * as p5 from "p5";
import {P5Service} from "../../../services/p5.service";
import {gsap} from "gsap";
import {VisualizerAttributes} from "../visualizer-attributes";

export class Slice implements Animatable
{
    public static defaultFillColor = "#eeeeee";
    public static defaultStrokeColor = "#a9a9a9";
    public static angleLength = 90;
    public static bodyLength = 100;
    public static labelSize = 10;
    public static visualizerAttributes: VisualizerAttributes;
    public static readonly colors = [
        "#e74c3cff",
        "#e67e22ff",
        "#f1c40fff",
        "#2ecc71ff",
        "#3498dbff",
        "#9b59b6ff"
    ]

    private angle: number;
    private radius: number;
    private position: p5.Vector;
    public fillColor: string;
    public strokeColor: string;
    public prevFillColor: string;
    public prevStrokeColor: string;
    public strokeSize: number = 1;
    private sketch: p5;
    private value: number;
    public distanceFromCenter = 0;
    private isMarked: boolean = false;

    constructor(value: number,angle: number, radius: number, position: p5.Vector) {
        this.sketch = new P5Service().getP5Instance();
        this.angle = angle;
        this.radius = radius;
        this.position = position;
        this.fillColor = Slice.defaultFillColor;
        this.strokeColor = Slice.defaultStrokeColor;
        this.prevFillColor = Slice.defaultFillColor;
        this.prevStrokeColor = Slice.defaultStrokeColor;
        this.value = value;
    }

    update(): void {

    }
    show(): void {
        this.sketch.fill(this.fillColor);
        this.sketch.noStroke();
        
        let x1 = this.sketch.cos(this.angle) * this.radius ;
        let y1 = this.sketch.sin(this.angle) * this.radius ;

        let x2 = this.sketch.cos(this.angle + Slice.angleLength) * this.radius ;
        let y2 = this.sketch.sin(this.angle + Slice.angleLength) * this.radius ;

        const offset = this.sketch.createVector(x1+x2,y1+y2).setMag(this.distanceFromCenter);

        this.sketch.triangle(offset.x,
                             offset.y,
                          x1 + offset.x,
                          y1 + offset.y,
                          x2 + offset.x,
                          y2 + offset.y);
        
        let sliceTopCenter = this.sketch.createVector((x1+x2)/2,(y1+y2)/2);
        if(this.isMarked)
        {
            this.sketch.fill(this.strokeColor);
            this.sketch.stroke("#eeeeee");
            this.sketch.strokeWeight(this.strokeSize);
            this.sketch.circle(sliceTopCenter.x*0.9 + offset.x,sliceTopCenter.y*0.9 + offset.y,Slice.labelSize);
        }

        if(!Slice.visualizerAttributes.valueLabelsHidden)
        {
            this.sketch.noStroke();
            this.sketch.fill("#eeeeee");
            sliceTopCenter.add(sliceTopCenter.copy().setMag(Slice.labelSize));
            this.sketch.text(this.value, sliceTopCenter.x + offset.x,sliceTopCenter.y + offset.y)
        }
        // this.sketch.text(this.value, 0,0,)
    }

    async mark(color: string): Promise<void>  {
        return new Promise<void>( resolve => {
            this.prevFillColor = this.fillColor;
            this.prevStrokeColor = this.strokeColor;
            this.isMarked = true;
            gsap.to(this,{
                fillColor: this.prevFillColor + "cc",
                strokeColor: color,
                ease: "power2.inOut",
                duration: Slice.visualizerAttributes.msComputedAnimationSpeed,
                onComplete: () =>{
                    resolve();
                }
            })
        })
    }
    
    unmark(disableAnimation?: boolean): Promise<void> {
        //TODO: not to default colors
        return new Promise<void>(resolve => {
            if(!disableAnimation)
            {
                gsap.to(this,{
                    fillColor: this.prevFillColor,
                    strokeColor: this.prevStrokeColor,
                    ease: "power2.inOut",
                    duration: Slice.visualizerAttributes.msComputedAnimationSpeed,
                    onComplete: () =>{
                        this.isMarked = false;
                        resolve();
                    }
                })
            }
            else
            {
                this.fillColor = this.prevFillColor;
                this.strokeColor = this.prevStrokeColor;
                this.isMarked = false;
                resolve();
            }
        })
    }
    flash(color: string): void {
        gsap.to(this,{
            fillColor: color,
            strokeColor: color,
            ease: "power2.inOut",
            duration: Slice.visualizerAttributes.msComputedAnimationSpeed,
            repeat: 1,
            yoyo: true
        })
    }

    getBoundingBox(): { position: p5.Vector; size: p5.Vector } {
        return {position: this.sketch.createVector(), size: this.sketch.createVector()};
    }

    setPositionWithIndex(indexInArray: number, timeline?: gsap.core.Timeline): void {
        if(timeline)
        {
            const tl = Slice.animatePositionInTimeline(this,Slice.angleLength * indexInArray)
            timeline.add(tl,"<")
        }
        else
        {
            this.angle = Slice.angleLength * indexInArray;
            this.distanceFromCenter = 0;
        }
    }

    setValue(value: number): void {
        this.value = value;
    }

    valueOf() {
        return this.value;
    }

    public setColor(color: string)
    {
        this.fillColor = color;
        this.strokeColor = color;
        this.prevFillColor = color;
        this.prevStrokeColor = color;
    }

    public getAngle()
    {
        return this.angle;
    }

    public setAngle(angleDeg: number)
    {
        this.angle = angleDeg;
    }

    public getRadius()
    {
        return this.radius;
    }

    public static animatePositionInTimeline = (element: Slice, angle: number) => {
        const tl = gsap.timeline({
            // onComplete: ()=>{
            //     if(element.angle > 360)
            //     {
            //         element.angle-=360; //it shouldnt be higher than 720 so no need for modulo
            //     }
            //     else if (element.angle < 0)
            //     {
            //         element.angle+=360;
            //     }
            // }
        });
        tl.to(element,{
            distanceFromCenter: element.getRadius() * 1.1,
            duration: Slice.visualizerAttributes.msComputedAnimationSpeed,
            yoyo: true,
            repeat: 1,
            repeatDelay: Slice.visualizerAttributes.msComputedAnimationSpeed*2
        }).to(element,{
            angle: angle,
            duration: Slice.visualizerAttributes.msComputedAnimationSpeed,
        },`-=${Slice.visualizerAttributes.msComputedAnimationSpeed*2}`);
        return tl;
    }
}


/*

let elements = 3;
let radius = 100;
//let length = 95;
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES)
}

function draw() {
  background(30);

  //translate(width/2,height/2);
  fill(230,80,180)
  ellipse(0,0,24);
  fill(255);

  let length = 360/elements;
  for(let i=0;i<elements;i++)
  {
    let angle = 360/elements * i;
    let x1 = cos(angle) * radius + width/2;
    let y1 = sin(angle) * radius + height/2;
    //ellipse(x1,y1,16);

    //let newAngle = acos(length/radius);
    //newAngle = (180 - (2 * newAngle))*0.5;
    newAngle = length;
    let x2 = cos(angle + newAngle) * radius + width/2;
    let y2 = sin(angle + newAngle) * radius + height/2;
    //ellipse(x2,y2,16);
    //console.log(dist(x1,y1,x2,y2))

    triangle(width/2,height/2,x1,y1,x2,y2)
  }

}

 */
