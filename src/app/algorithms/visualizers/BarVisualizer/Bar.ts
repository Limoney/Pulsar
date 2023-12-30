import { gsap } from "gsap";
import * as p5 from "p5";
import { P5Service } from "src/app/services/p5.service";
import {Animatable} from "../animatable";
import {VisualizerAttributes} from "../visualizer-attributes";

export class Bar implements Animatable
{
    public static defaultFillColor: string;
    public static defaultStrokeColor: string;
    public static width: number = 100;
    public static visualizerAttributes: VisualizerAttributes;

    public fillColor: string;
    public strokeColor: string;
    public strokeSize: number = 1;
    public position: p5.Vector;
    public value: number;
    private sketch: p5;

    constructor(x: number,y: number,w: number,v: number)
    {
        this.sketch = P5Service.getP5Instance();
        this.position = this.sketch.createVector(x,y)
        this.value = v;
        this.fillColor = Bar.defaultFillColor;
        this.strokeColor = Bar.defaultStrokeColor;
    }

    update()
    {
        //this.position.y = this.sketch.height;
    }

    show()
    {
        this.sketch.fill(this.fillColor);
        this.sketch.stroke(this.strokeColor);
        this.sketch.rect(this.position.x,this.position.y,Bar.width,-this.value);

        if(!Bar.visualizerAttributes.valueLabelsHidden)
        {
            this.sketch.fill(255);
            this.sketch.noStroke();
            this.sketch.text(this.value,this.position.x + Bar.width*0.5,this.position.y-this.value);
        }
    }

    async mark(color: string)
    {
        return new Promise<void>(resolve => {
            gsap.to(this,{
                fillColor: color,
                strokeColor: color,
                ease: "power2.inOut",
                duration: Bar.visualizerAttributes.msComputedAnimationSpeed,
                onComplete: () =>{
                    resolve();
                }
            })
        })
    }

    async unmark(disableAnimation?: boolean)
    {
        return new Promise<void>(resolve => {
            if(!disableAnimation)
            {
                gsap.to(this,{
                    fillColor: Bar.defaultFillColor,
                    strokeColor: Bar.defaultStrokeColor,
                    ease: "power2.inOut",
                    duration: Bar.visualizerAttributes.msComputedAnimationSpeed,
                    onComplete: () =>{
                        resolve();
                    }
                })
            }
            else
            {
                this.fillColor = Bar.defaultFillColor;
                this.strokeColor = Bar.defaultStrokeColor;
                resolve();
            }
        })
    }

    flash(color:string )
    {
        gsap.to(this,{
            fillColor: color,
            strokeColor: color,
            ease: "power2.inOut",
            duration: Bar.visualizerAttributes.msComputedAnimationSpeed,
            repeat: 1,
            yoyo: true
        })
    }

    valueOf()
    {
        return this.value;
    }

    public setPositionWithIndex(indexInArray: number,timeline?: gsap.core.Timeline)
    {
        if(timeline)
        {
            timeline.to(this.position,{
                duration: Bar.visualizerAttributes.msComputedAnimationSpeed,
                x: Bar.width * indexInArray,
                y: this.sketch.height
            },'<')
        }
        else
        {
            this.position.x = Bar.width * indexInArray;
            this.position.y = this.sketch.height;
        }
    }

    // static compare(left: Bar,right: Bar)
    // {
    //     if (left.value < right.value)
    //         return -1;
    //     else if (left.value > right.value)
    //         return 1;
    //     else
    //         return 0;
    // }

    getBoundingBox(): { position: p5.Vector; size: p5.Vector } {
        let position = this.position.copy();
        position.x += Bar.width/2;
        position.y -= this.value/2;
        return {position: position, size: this.sketch.createVector(Bar.width,this.value)};
    }

    setValue(value: number): void {
        this.value = value;
    }

}
