import * as p5 from "p5";
import { Camera } from "../../utility/Camera";
import { SleepLock } from "../../utility/SleepLock";
import { Bar } from "./Bar";
import { P5Service } from "src/app/services/p5.service";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output";
import gsap from "gsap";

export class BarVisualizer
{
    public bars:Bar[] = [];
    protected lock;
    protected stepByStep;
    protected shouldMakeNextStep;
    public camera;
    private sketchRef: p5;
    private algorithm: (...args: any[]) => AlgorithmOutput;
    private minimumStepDuration = 10;
    private readonly msBetweenStepsDefault = Bar.animationDuration * 1000 + this.minimumStepDuration + 2500;
    private msBetweenSteps = this.msBetweenStepsDefault;
    private forceQuit = false;
    private initialData!: number[];
    
    constructor(algorithm: any, initialData: number[])
    {
        this.sketchRef = new P5Service().getP5Instance();
        this.camera = new Camera();
        this.lock = new SleepLock(this.msBetweenSteps);
        this.algorithm = algorithm;
        this.stepByStep = false;
        this.shouldMakeNextStep = false;
        this.sketchRef.textSize(Bar.width/2);
        this.sketchRef.textAlign(this.sketchRef.CENTER);
        this.setData(initialData);
    }

    public updateAndShow()
    {
        this.camera.update();
        for(let bar of this.bars)
        {
            if(!this.camera.isOnScreen(
                bar.position.x + Bar.width/2,
                bar.position.y - bar.value / 2,
                Bar.width,
                bar.value
            ))
            {
                continue;
            }
            bar.update();
            bar.show();
        }
    }

    public push(value: number)
    {
        let prev = this.bars[this.bars.length-1] ?? new Bar(-Bar.width,this.sketchRef.height,Bar.width,0);
        this.bars.push(new Bar(prev.position.x + Bar.width,
                               prev.position.y,Bar.width,
                               value));
        this.initialData.push(value);
    }

    public pop()
    {
        this.bars.splice(this.bars.length-1,1);
        this.initialData.splice(this.initialData.length-1,1);
    }

    public insert(value: number,index: number)
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.bars.length);
        let prevBar = this.bars[index-1] ?? new Bar(-Bar.width,this.sketchRef.height,Bar.width,0);
        let newBar = new Bar(prevBar.position.x + Bar.width,prevBar.position.y,Bar.width,value);
        this.bars.splice(index, 0, newBar);
        this.initialData.splice(index, 0, value);

        for(let i = index + 1; i< this.bars.length; i++)
        {
            this.bars[i].position.x += Bar.width;
        };
    }

    public remove(index: number)
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.bars.length-1);
        this.bars.splice(index,1);
        this.initialData.splice(index,1);
        for(let i = index; i< this.bars.length; i++)
        {
            this.bars[i].position.x -= Bar.width;
        };
    }

    public clear()
    {
        this.bars = [];
        this.initialData = [];
    }
    
    public restart()
    {
        this.forceQuit = true;
        for(let i=0;i<this.bars.length;i++)
        {
            this.bars[i].fastUnmark();
            this.bars[i].value = this.initialData[i];
            this.bars[i].setPositionWithIndexFast(i);
        }
    }

    public enableStepByStep()
    {
        this.stepByStep = true;
        this.lock.lock();
        console.log("on");
    }

    public disableStepByStep()
    {
        this.stepByStep = false;
        this.lock.unlock();
        console.log("off");
    }

    public async play(algorithmData: any)
    {
        this.restart();
        this.forceQuit = false;
        return this.algorithm(this,this.bars,algorithmData);
    }

    public resume()
    {
        this.shouldMakeNextStep = true;
        this.lock.unlock();
    }

    public pause()
    {
        this.shouldMakeNextStep = false;
        this.lock.lock();
    }

    public setSpeed(speedPercent: number)
    {
        this.msBetweenSteps = this.msBetweenStepsDefault *(100 - speedPercent)/100 + this.minimumStepDuration;
        Bar.animationDuration = this.msBetweenSteps/1000;
        this.lock.setSleepDuration(this.msBetweenSteps);
    }

    public setData(initialData: number[])
    {
        this.initialData = initialData;
        const initialNumberOfElements = this.bars.length;
        if(initialNumberOfElements != this.initialData.length)
        {
            this.bars = [];
            for(let i = 0; i< this.initialData.length; i++)
            {
                let bar = new Bar(i*Bar.width,this.sketchRef.height,Bar.width,this.initialData[i]);
                this.bars.push(bar); 
            }
        }
        else
        {
            for(let i = 0; i< initialNumberOfElements; i++)
            {
                this.bars[i].value = this.initialData[i]; 
            }
        }
        
    }

    public sort()
    {
        this.bars = this.bars.sort(Bar.compare);
        for(let i=0;i<this.bars.length;i++)
        {
            this.bars[i].position.x = Bar.width*i;
        }
    }

    async swap(leftbarIndex: number,rightBarIndex: number): Promise<void>
    {        
        const leftbar = this.bars[leftbarIndex]
        const rightBar = this.bars[rightBarIndex]
        
        const leftbarPos = leftbar.position.copy();
        const rightBarPos = rightBar.position.copy();
        
        return new Promise<void>( (resolve) => {
            const tl = gsap.timeline({ 
                onComplete: () => {
                  let copy = this.bars[leftbarIndex];
                  this.bars[leftbarIndex] = this.bars[rightBarIndex];
                  this.bars[rightBarIndex] = copy; 
                  resolve();
                }
              });
              
              tl.to(leftbar.position, {
                x: rightBarPos.x,
                y: rightBarPos.y,
                ease: "power4.inOut",
                duration: Bar.animationDuration
              });
              
              tl.to(rightBar.position, {
                x: leftbarPos.x,
                y: leftbarPos.y,
                ease: "power4.inOut",
                duration: Bar.animationDuration
              },'<');
        })
        
    }
}