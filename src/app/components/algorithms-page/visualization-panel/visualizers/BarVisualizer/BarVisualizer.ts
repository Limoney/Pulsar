import * as p5 from "p5";
import { Camera } from "../../utility/Camera";
import { SleepLock } from "../../utility/SleepLock";
import { Bar } from "./Bar";
import { P5Service } from "src/app/services/p5.service";

export class BarVisualizer
{
    protected bars:Bar[] = [];
    public barSize;
    protected lock;
    protected stepByStep;
    protected makeStep;
    public camera;
    protected sortedValues;
    private sketchRef: p5;

    static resultStatus = {
        NODATA: "No Data",
        FOUND: "Value Found",
        NOTFOUND: "Value Not Found",
    }

    constructor(initialData: number[], sorted = false)
    {
        this.sketchRef = new P5Service().getP5Instance();
        this.camera = new Camera();
        this.lock = new SleepLock(2500);
        this.stepByStep = false;
        this.makeStep = false;
        this.barSize = this.sketchRef.width/initialData.length;
        this.sortedValues = sorted;
        this.sketchRef.textSize(this.barSize/2);
        this.sketchRef.textAlign(this.sketchRef.CENTER);
        this.setData(initialData);
    }

    public updateAndShow()
    {
        this.camera.update();
        for(let bar of this.bars)
        {
            bar.update();
            bar.show();
        }
    }

    public add(value: number)
    {
        let prev = this.bars[this.bars.length-1] ?? new Bar(-this.barSize,this.sketchRef.height,this.barSize,0);
        this.bars.push(new Bar(prev.position.x + this.barSize,
                               prev.position.y,this.barSize,
                               value));
    }

    public pop()
    {
        this.bars.splice(this.bars.length-1,1);
    }

    public insert(value: number,index: number)
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.bars.length);
        let prevBar = this.bars[index-1] ?? new Bar(-this.barSize,this.sketchRef.height,this.barSize,0);
        let newBar = new Bar(prevBar.position.x + this.barSize,prevBar.position.y,this.barSize,value);
        this.bars.splice(index, 0, newBar);

        for(let i = index + 1; i< this.bars.length; i++)
        {
            this.bars[i].position.x += this.barSize;
        };
    }

    public remove(index: number)
    {
        index = this.sketchRef.min(this.sketchRef.max(index,0),this.bars.length-1);
        this.bars.splice(index,1);
        for(let i = index; i< this.bars.length; i++)
        {
            this.bars[i].position.x -= this.barSize;
        };
    }

    public clear()
    {
        this.bars = [];
    }
    
    public restart()
    {
        for(let bar of this.bars)
        {
            bar.fastUnmark();
        }
    }

    public toggleStepByStep()
    {
        if(this.stepByStep)
        {
            this.stepByStep = false;
            this.lock.unlock();
        }
        else
        {
            this.stepByStep = true;
            this.lock.lock();
        }
    }

    public markForStep()
    {
        this.makeStep = true;
        this.lock.unlock();
    }

    public unmarkForStep()
    {
        this.makeStep = false;
        this.lock.lock();
    }

    public setData(initialData: number[])
    {
        const initialNumberOfElements = this.bars.length;
        if(initialNumberOfElements != initialData.length)
        {
            this.bars = [];
            for(let i = 0; i< initialData.length; i++)
            {
                let bar = new Bar(i*this.barSize,this.sketchRef.height,this.barSize,initialData[i]);
                this.bars.push(bar); 
            }
        }
        else
        {
            for(let i = 0; i< initialNumberOfElements; i++)
            {
                this.bars[i].value = initialData[i]; 
            }
        }
        
    }

    public sort()
    {
        this.bars = this.bars.sort(Bar.compare);
        for(let i=0;i<this.bars.length;i++)
        {
            this.bars[i].position.x = this.barSize*i;
        }
    }
}