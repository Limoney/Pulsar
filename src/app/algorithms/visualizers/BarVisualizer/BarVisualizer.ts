import * as p5 from "p5";
import { Camera } from "../../utility/Camera";
import { Bar } from "./Bar";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output";
import gsap from "gsap";
import {VisualizerAttributes} from "../visualizer-attributes";
import {Animatable} from "../animatable";
import {VisualizerCommon} from "../visualizer-common";
import { ThemeService } from "src/app/services/theme.service";

//screw it
// visualizer should be abstract class, drop SimpleVisualizer
export class BarVisualizer extends VisualizerCommon
{
    constructor(attributes: VisualizerAttributes, camera: Camera, algorithm: (...args: any[]) => AlgorithmOutput | Promise<AlgorithmOutput>)
    {
        super(attributes, camera, algorithm);
        setTimeout(() => {
            this.sketchRef.textSize(Bar.width*0.4);
            this.sketchRef.textAlign(this.sketchRef.CENTER, this.sketchRef.BOTTOM);
        },0)
        const themeService = new ThemeService();
        Bar.defaultFillColor = themeService.getColor("primary-color");
		Bar.defaultStrokeColor = themeService.getColor("primary-600");
        Bar.visualizerAttributes = attributes;

    }

    public override update(): void
    {
        this.camera.update();
        for(let element of this.elements) 
        {
            const box = element.getBoundingBox();
            if(!this.camera.isOnScreen(box.position.x, box.position.y, box.size.x, box.size.y)) 
            {
                continue;
            }
            element.update();
            element.show();
        }
    }

    public override push(element: Animatable): void
    {
        element.setPositionWithIndex(this.elements.length);
        this.elements.push(element);
    }

    public pop(): void
    {
        this.elements.pop();
    }

    public override insert(element: Animatable,index: number)
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.elements.length);
        element.setPositionWithIndex(index);
        this.elements.splice(index, 0, element);

        for(let i = index + 1; i< this.elements.length; i++)
        {
            this.elements[i].setPositionWithIndex(i);
        }
    }

    public override remove(index: number): void
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.elements.length-1);
        this.elements.splice(index,1);
        // this.attributes.initialData.splice(index,1);
        for(let i = index; i< this.elements.length; i++)
        {
            this.elements[i].setPositionWithIndex(i);
        }
    }

    public override restart(initialData: number[]): void
    {
        this.attributes.forceQuit = true;
        for(let i=0;i<this.elements.length;i++)
        {
            this.elements[i].unmark(true);
            this.elements[i].setValue(initialData[i])
            this.elements[i].setPositionWithIndex(i);
        }
    }


    public override setData(values: number[]): void
    {
        this.elements = [];
        for(let i = 0; i< values.length; i++)
        {
            let bar = new Bar(i*Bar.width,this.sketchRef.height,Bar.width,values[i]);
            this.elements.push(bar);
        }
    }

    override async swap(leftElement: number,rightElement: number): Promise<void>
    {
        const left = this.elements[leftElement] as Bar;
        const right = this.elements[rightElement] as Bar;

        const leftPos = left.position.copy();
        const rightPos = right.position.copy();

        return new Promise<void>( (resolve: any): void => {
            const tl = gsap.timeline({
                onComplete: () => {
                  let copy = this.elements[leftElement];
                  this.elements[leftElement] = this.elements[rightElement];
                  this.elements[rightElement] = copy;
                  resolve();
                }
              });

              tl.to(left.position, {
                x: rightPos.x,
                y: rightPos.y,
                ease: "power4.inOut",
                duration: Bar.visualizerAttributes.msComputedAnimationSpeed
              });

              tl.to(right.position, {
                x: leftPos.x,
                y: leftPos.y,
                ease: "power4.inOut",
                duration: Bar.visualizerAttributes.msComputedAnimationSpeed
              },'<');
        })
    }

    public override createElement(value: number): Animatable {

        return new Bar(0,0,Bar.width,value);
    }
}
