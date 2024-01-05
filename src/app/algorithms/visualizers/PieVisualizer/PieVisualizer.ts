import { Camera } from "../../utility/Camera";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output";
import gsap from "gsap";
import {VisualizerAttributes} from "../visualizer-attributes";
import {Animatable} from "../animatable";
import {Slice} from "./Slice";
import {VisualizerCommon} from "../visualizer-common";
import { ThemeService } from "src/app/services/theme.service";

export class PieVisualizer extends VisualizerCommon
{
    private minElement!: number;
    private maxElement!: number;
    private minFontSize = 1;
    private maxFontSize = 50;
    constructor(attributes: VisualizerAttributes, camera: Camera, algorithm: (...args: any[]) => AlgorithmOutput | Promise<AlgorithmOutput>)
    {
        super(attributes,camera,algorithm);
        Slice.visualizerAttributes = attributes;
        setTimeout(() => {
            this.sketchRef.textAlign(this.sketchRef.CENTER,this.sketchRef.CENTER);
        },0); // WHY NO WORK?
        this.sketchRef.angleMode(this.sketchRef.DEGREES);
        this.sketchRef.ellipseMode(this.sketchRef.CENTER);
        const themeService = new ThemeService();
        Slice.colors = themeService.palette;
    }

    public override update(): void
    {
        this.camera.update();
        this.sketchRef.translate(this.sketchRef.width/2,this.sketchRef.height/2)
        for(let element of this.elements) {
            element.update();
            element.show();
        }
        this.sketchRef.fill("#fff");
        this.sketchRef.ellipse(0,0,32);
        // this.sketchRef.ellipse(this.sketchRef.width/2,this.sketchRef.height/2,32);
        // this.sketchRef.ellipse(-this.sketchRef.width/2,-this.sketchRef.height/2,32);
        // this.sketchRef.ellipse(this.sketchRef.width/2,-this.sketchRef.height/2,32);
        // this.sketchRef.ellipse(-this.sketchRef.width/2,this.sketchRef.height/2,32);
    }

    public override push(element: Slice): void
    {
        this.elements.push(element);
        this.updateElementsAfterEdit(element);
        this.setElementColor(element);
        this.updateFontSize();
    }

    public override pop(): void
    {
        const element = this.elements.pop();
        if(element)
        {
            this.updateElementsAfterEdit(element as Slice,true);
            this.setElementColor(element as Slice);
        }
        this.updateFontSize();
    }

    public override insert(element: Slice,index: number): void
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.elements.length);
        this.elements.splice(index, 0, element);
        this.updateElementsAfterEdit(element);
        this.setElementColor(element);
        this.updateFontSize();
    }

    public override remove(index: number): void
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.elements.length-1);
        const element = this.elements[index] as Slice;
        this.elements.splice(index,1);
        this.updateElementsAfterEdit(element,true);
        this.setElementColor(element);
        this.updateFontSize();
    }


    public override restart(values: number[]): void
    {
        this.forceQuit = true;
        for(let i= 0; i<this.elements.length; i++)
        {
            this.elements[i].unmark(true);
            this.elements[i].setValue(values[i])
            this.elements[i].setPositionWithIndex(i);
            this.setElementColor(this.elements[i] as Slice);
        }
    }

    public override setData(values: number[]): void
    {
        this.minElement = this.sketchRef.min(values);
        this.maxElement = this.sketchRef.max(values);
        // Slice.defaultBodyLength = Math.min(this.sketchRef.width,this.sketchRef.height)/4;

        this.elements = [];
        Slice.angleLength = 360/values.length;
        for(let i = 0; i< values.length; i++)
        {
            let slice = new Slice(values[i],Slice.angleLength*i,Slice.bodyLength);
            this.setElementColor(slice);
            this.elements.push(slice);
        }
        this.updateFontSize();

    }

    async swap(leftElement: number,rightElement: number): Promise<void>
    {
        const left = this.elements[leftElement] as Slice;
        const right = this.elements[rightElement] as Slice;

        return new Promise<void>( (resolve: any): void => {
            const mainTimeline = gsap.timeline({
                onComplete: () => {
                    let copy = this.elements[leftElement];
                    this.elements[leftElement] = this.elements[rightElement];
                    this.elements[rightElement] = copy;
                    resolve();
                }
            });

            let leftAngle = left.getAngle();
            let rightAngle = right.getAngle();
            // if(Math.abs(left.getAngle()-right.getAngle()) > 180)
            // {
                
            //     if(leftAngle > rightAngle)
            //     {
            //         const diff = 360 - leftAngle - rightAngle;
            //         let rightAngleCopy = rightAngle;
            //         rightAngle = leftAngle + diff;
            //         leftAngle = rightAngleCopy - diff;
            //     }
            //     else
            //     {
            //         const diff = 360 - rightAngle - leftAngle;
            //         let leftAngleCopy = leftAngle;
            //         leftAngle = rightAngle + diff;
            //         rightAngle = leftAngleCopy - diff;
            //     }
            //}
            //mainTimeline.add(left.animatePositionInTimeline(rightAngle),0);
            //mainTimeline.add(right.animatePositionInTimeline(leftAngle),0);
            left.setPositionWithIndex(rightElement,mainTimeline);
            right.setPositionWithIndex(leftElement,mainTimeline);
        })
    }

    public override createElement(value: number): Animatable {
        return new Slice(value,0,Slice.bodyLength);
    }

    private setElementColor(element: Slice): void
    {
        const colorIndex = this.sketchRef.map(element.valueOf(),
                                            this.minElement,
                                            this.maxElement,
                                            0,
                                            Slice.colors.length);

        let nextColorPercent = colorIndex - Math.floor(colorIndex);
        const firstColorIndex = Math.floor(colorIndex%Slice.colors.length);
        const secondColorIndex = Math.floor((colorIndex +1)%Slice.colors.length);

        let firstColor = Slice.colors[firstColorIndex];
        let secondColor = Slice.colors[secondColorIndex];

        let color = this.sketchRef.lerpColor(this.sketchRef.color(firstColor),
                                             this.sketchRef.color(secondColor),
                                             nextColorPercent)
        element.setColor(color.toString("#rrggbb"));
    }

    private updateFontSize()
    {
        let fontSize = Math.min(Math.max(Slice.angleLength,this.minFontSize),this.maxFontSize);
        Slice.labelSize = fontSize;
        this.sketchRef.textSize(Slice.labelSize);
    }
    private updateElementsAfterEdit(modifiedElement: Slice, hasElementBeenRemoved: boolean = false)
    {
        let valueRangeChanged = false;
        if(!hasElementBeenRemoved)
        {
            if(modifiedElement.valueOf() < this.minElement)
            {
                this.minElement = modifiedElement.valueOf();
                valueRangeChanged = true;
            }

            if(modifiedElement.valueOf() > this.maxElement)
            {
                this.maxElement = modifiedElement.valueOf();
                valueRangeChanged = true;
            }
        }
        else
        {
            if(this.minElement == modifiedElement.valueOf())
            {
                this.minElement = this.sketchRef.min(this.elements.map(element => element.valueOf()));
                valueRangeChanged = true;
            }
            if(this.maxElement == modifiedElement.valueOf())
            {
                this.maxElement = this.sketchRef.max(this.elements.map(element => element.valueOf()));
                valueRangeChanged = true;
            }
        }

        Slice.angleLength = 360/this.elements.length;
        for(let i = 0; i< this.elements.length; i++)
        {
            (<Slice>this.elements[i]).setAngle(Slice.angleLength * i);

            if(valueRangeChanged)
            {
                this.setElementColor(this.elements[i] as Slice)
            }
        }
    }
}

