import { SleepLock } from "src/app/algorithms/utility/SleepLock";
import { Timer } from "src/app/algorithms/utility/Timer";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output"
import { ThemeService } from "../services/theme.service";
import { Bar } from "./visualizers/BarVisualizer/Bar";
import gsap from "gsap";
import { Injectable } from "@angular/core";
import { PrismService } from "../services/prism.service";

@Injectable({
    providedIn: 'root'
})
export class AlgorithmImplementations
{
    private forcefulyTerminatedMessage = "forcefully terminated";

    private valueFoundMessage = "value found at index ";

    private valueNotFoundMessage = "value not found ";

    // private themeService = new ThemeService();
    // private markColorLight = this.themeService.getColor("purple-500")
    // private markColorDark = this.themeService.getColor("purple-600")

    private markColorLight = "#9b59b6";

    private markColorDark = "#8e44ad";

    static instance: AlgorithmImplementations;

    constructor(private prismService: PrismService)
    {
        if(!AlgorithmImplementations.instance)
        {
            AlgorithmImplementations.instance = this;
        }
    }
  
    static getInstance() {
      
      return this.instance;
    }

    public readonly binarySearchSource = `
    function binarySearch(array,value)
    {
        let start = 0;
        let end = array.length-1;
        while(start < end)
        {
            let center = floor((start + end) / 2);
    
            if(value > array[center])
                start = center + 1;
            else if(value < array[center])
                end = center - 1;
            else 
                return center;
        }
        return -1;
    }
    `;

    async binarySearch(visualizer: any,array: number[],value: number) {
        let start = 0;
        let end = array.length-1;
        const timer = new Timer();
        this.prismService.highlightLines("7-17");
        while(start <= end)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                           this.forcefulyTerminatedMessage);
            }

            let center = Math.floor((start + end) / 2);
            

            let startPoint = start;
            let endPoint = end;
    
            visualizer.bars[startPoint].mark(this.markColorLight);
            visualizer.bars[endPoint].mark(this.markColorLight);
            visualizer.bars[center].mark(this.markColorDark);
    
    
            if(value > array[center])
                start = center + 1;
            else if(value < array[center])
                end = center - 1;
            else 
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           center,
                                           this.valueFoundMessage + center);
            }
            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            visualizer.bars[startPoint].unmark()
            visualizer.bars[endPoint].unmark()
            visualizer.bars[center].unmark()
            
        }
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
    }
    
    public readonly linearSearchSource = `
    function linearSearch(array,value)
    {
        for(let i = 0; i < array.length; i++)
        {
            if(array[i] == value)
            {
                return i;
            }
        }
        return -1;
    }
    `;

    async linearSearch(visualizer: any,array: number[],value: number) {
        const timer = new Timer();

        this.prismService.highlightLines("5-11");
        for(let i = 0; i < array.length ;i++)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefulyTerminatedMessage);
            }

            visualizer.bars[i].mark(this.markColorLight);
            if(array[i] == value)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           i,
                                           this.valueFoundMessage + i);
            }
            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            visualizer.bars[i].unmark()
        }

        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
    }

    //https://en.wikipedia.org/wiki/Jump_search
    public readonly jumpSearchSource = `
    function jumpSearch(array,value)
    {
        let currentIndex = 0;
        const initialStep = Math.floor(Math.sqrt(array.length));
        let step = initialStep;
        while(array[Math.min(step,array.length)-1] < value)
        {
            currentIndex = step;
            step += initialStep;
            if(currentIndex >= array.length)
                return -1;
        }

        while(array[currentIndex] < value)
        {
            currentIndex += 1;
            if(currentIndex == Math.min(step,array.length))
                return -1;
        }

        if(array[currentIndex] == value)
        {
            return currentIndex
        }
        else
        {
            return -1;
        }
    }
    `;
    
    async jumpSearch(visualizer: any,array: number[],value: number)
    {
        const timer = new Timer();
        let currentIndex = 0;
        const initialStep = Math.floor(Math.sqrt(array.length));
        let step = initialStep;
        this.prismService.highlightLines("8-14");
        while(array[Math.min(step,array.length)-1] < value)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefulyTerminatedMessage);
            }
            currentIndex = step;
            step += initialStep;
            if(currentIndex >= array.length)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
            }
            visualizer.bars[currentIndex].mark(this.markColorDark);

            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            // visualizer.bars[currentIndex].unmark();
        }

        this.prismService.highlightLines("16-21");
        while(array[currentIndex] < value)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefulyTerminatedMessage);
            }
            currentIndex += 1;
            if(currentIndex == Math.min(step,array.length))
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
            }

            visualizer.bars[currentIndex].mark(this.markColorLight);
            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            visualizer.bars[currentIndex].unmark();
        }

        this.prismService.highlightLines("23-30");
        if(array[currentIndex] == value)
        {
            visualizer.bars[currentIndex].mark(this.markColorLight);
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           currentIndex,
                                           this.valueFoundMessage + currentIndex);
        }
        else
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
        }
    }

    public readonly bubbleSortSource = `
    function bubbleSort(array)
    {
        let remainingElements = array.length;
        do {
            for(let i = 0; i<remainingElements - 1; i++)
            {
                if(array[i] > array[i + 1])
                {
                    let copyI = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = copyI;
                }
            }
            remainingElements -= 1;
        } while(remainingElements > 1)
    }
    `
    public async bubbleSort(visualizer: any,array: any[])
    {
        const timer = new Timer();
        this.prismService.highlightLines("6-17");
        let remainingElements = array.length;
        do {
            for(let i = 0; i<remainingElements - 1; i++)
            {
                if(visualizer.forceQuit)
                {
                    return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               this.forcefulyTerminatedMessage);
                }

                visualizer.bars[i].mark(this.markColorLight);
                visualizer.bars[i+1].mark(this.markColorLight);
                timer.pause();
                await SleepLock.sleep( () => visualizer.lock );
                if(array[i].value > array[i + 1].value)
                {                    
                    await visualizer.swap(i,i+1)
                }
                timer.continue();
                if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
                {
                    visualizer.pause();
                }
                visualizer.bars[i].unmark()
                visualizer.bars[i+1].unmark();
            }
            remainingElements -= 1;
            
        } while(remainingElements > 1);
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    public readonly mergeSortSource = `
    function mergeSort(array)
    {
        if(array.length <= 1)
        {
            return array;
        }

        const center =  Math.floor(array.length/2);
        let leftArrayUnsorted = array.slice(0,center);
        let rightArrayUnsorted = array.slice(center);

        let leftArraySorted = mergeSort(leftArrayUnsorted);
        let rightArraySorted = mergeSort(rightArrayUnsorted);

        return merge(leftArraySorted,rightArraySorted);
    }

    function merge(left,right)
    {
        let merged = [];
        let leftIndex = 0;
        let rightIndex = 0;
        let mergedIndex = 0;
        while( leftIndex < left.length && rightIndex < right.length)
        {
            if(left[leftIndex] < right[rightIndex])
            {
                merged[mergedIndex] = left[leftIndex];
                leftIndex++;
            }
            else
            {
                merged[mergedIndex] = right[rightIndex];
                rightIndex++;
            }
            mergedIndex++;
        }

        while(leftIndex < left.length)
        {
            merged[mergedIndex] = left[leftIndex];
            mergedIndex++;
            leftIndex++;
        }

        while(rightIndex < right.length)
        {
            merged[mergedIndex] = right[rightIndex];
            mergedIndex++;
            rightIndex++;
        }
        return merged;
    }
    `

    public async mergeSortWrapper(visualizer: any, array: any[])
    {
        const timer = new Timer();
        const output = await this.mergeSort(visualizer,timer,array,0);
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    private async mergeSort(visualizer: any,timer: Timer, array: any[],elementsBefore :number): Promise<any>
    {
        if(visualizer.forceQuit)
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                        null,
                                        this.forcefulyTerminatedMessage);
        }

        if(array.length <= 1)
        {
            timer.pause();
            this.prismService.highlightLines("5-8");
            array.forEach(x => x.mark(this.markColorDark))
            
            await SleepLock.sleep( () => visualizer.lock );
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            
            array.forEach(x => x.unmark())
            timer.continue();
            return array;
        }

        this.prismService.highlightLines("10-15");
        const center =  Math.floor(array.length/2);
        let leftArrayUnsorted = array.slice(0,center);
        let rightArrayUnsorted = array.slice(center);
        
        leftArrayUnsorted.forEach(elem => elem.mark(this.markColorLight))
        rightArrayUnsorted.forEach(elem => elem.mark(this.markColorLight))

        timer.pause();
        await SleepLock.sleep( () => visualizer.lock );
        if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
        {
            visualizer.pause();
        }
        timer.continue();

        leftArrayUnsorted.forEach(elem => elem.unmark());
        rightArrayUnsorted.forEach(elem => elem.unmark());

        const newElementsBefore = elementsBefore + leftArrayUnsorted.length;
        
        let leftArraySorted = await this.mergeSort(visualizer,timer,leftArrayUnsorted,elementsBefore);
        let rightArraySorted = await this.mergeSort(visualizer,timer,rightArrayUnsorted,newElementsBefore);

        // let [leftArraySorted, rightArraySorted] = await Promise.all([
        //     this.mergeSort(visualizer,timer,leftArrayUnsorted,elementsBefore),
        //     this.mergeSort(visualizer,timer,rightArrayUnsorted,newElementsBefore)
        // ])
        
        const merged = await this.merge(visualizer,timer,leftArraySorted,rightArraySorted,elementsBefore);
        return merged;
    }

    //TODO: fix reset button while merge is running
    private async merge(visualizer: any,timer: Timer,left: any[], right: any[],leftOffset :number): Promise<any>
    {
        if(visualizer.forceQuit)
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                        null,
                                        this.forcefulyTerminatedMessage);
        }

        timer.pause();
        this.prismService.highlightLines("17,26-54");
        left.forEach(elem => elem.mark(this.markColorLight))
        right.forEach(elem => elem.mark(this.markColorDark))

        
        await SleepLock.sleep( () => visualizer.lock );
        if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
        {
            visualizer.pause();
        }

        left.forEach(elem => elem.unmark());
        right.forEach(elem => elem.unmark());
        timer.continue();
        
        return new Promise<any[]>( (resolve)=>{

            let merged:any[] = [];
            let leftIndex = 0;
            let rightIndex = 0;
            let mergedIndex = 0;

            const timeline = gsap.timeline({
                onComplete: () =>{
                    resolve(merged);
                },
                duration: Bar.animationDuration
            })

            while( leftIndex < left.length && rightIndex < right.length)
            {
                if(left[leftIndex] < right[rightIndex])
                {
                    merged[mergedIndex] = left[leftIndex];
                    merged[mergedIndex].setPositionWithIndex(timeline,leftOffset + mergedIndex);
                    leftIndex++;
                }
                else
                {
                    merged[mergedIndex] = right[rightIndex];
                    merged[mergedIndex].setPositionWithIndex(timeline,leftOffset + mergedIndex);
                    rightIndex++;
                }
                mergedIndex++;
            }

            while(leftIndex < left.length)
            {
                merged[mergedIndex] = left[leftIndex];
                merged[mergedIndex].setPositionWithIndex(timeline,leftOffset + mergedIndex);

                mergedIndex++;
                leftIndex++;
            }

            while(rightIndex < right.length)
            {
                merged[mergedIndex] = right[rightIndex];
                merged[mergedIndex].setPositionWithIndex(timeline,leftOffset + mergedIndex);

                mergedIndex++;
                rightIndex++;
            }
        })
    }

    
}
// export default AlgorithmImplementations.getInstance();