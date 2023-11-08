import { SleepLock } from "src/app/algorithms/utility/SleepLock";
import { Timer } from "src/app/algorithms/utility/Timer";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output"
import { ThemeService } from "../services/theme.service";
import { Bar } from "./visualizers/BarVisualizer/Bar";
import gsap from "gsap";
import { Injectable } from "@angular/core";
import { PrismService } from "../services/prism.service";
import {Visualizer} from "./visualizers/visualizer";
import {Animatable} from "./visualizers/animatable";

@Injectable({
    providedIn: 'root'
})
export class AlgorithmImplementations
{
    private forcefullyTerminatedMessage = "forcefully terminated";

    private valueFoundMessage = "value found at index ";

    private valueNotFoundMessage = "value not found ";

    // private themeService = new ThemeService();
    // private markColorLight = this.themeService.getColor("purple-500")
    // private markColorDark = this.themeService.getColor("purple-600")

    private markColorLight = "#9b59b6";

    private markColorDark = "#7f3d9b";

    static instance: AlgorithmImplementations;

    constructor(private prismService: PrismService)
    {
        if(!AlgorithmImplementations.instance)
        {
            AlgorithmImplementations.instance = this;
        }
    }

    static getInstance() 
    {
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

    async binarySearch(visualizer: Visualizer, array: Animatable[], value: number) 
    {
        let start = 0;
        let end = array.length-1;
        this.prismService.highlightLines("7-17");
        const timer = new Timer();
        while(start <= end)
        {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                           this.forcefullyTerminatedMessage);
            }

            let center = Math.floor((start + end) / 2);
            let startPoint = start;
            let endPoint = end;

            timer.pause();
            await Promise.all([
                array[startPoint].mark(this.markColorLight),
                array[endPoint].mark(this.markColorLight),
                array[center].mark(this.markColorDark),
            ])
            timer.continue();

            if(value > array[center].valueOf())
                start = center + 1;
            else if(value < array[center].valueOf())
                end = center - 1;
            else
            {

                timer.pause();
                await Promise.all([
                    array[startPoint].unmark(),
                    array[endPoint].unmark(),
                    array[center].unmark(),
                ])
                timer.continue();
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           center,
                                           this.valueFoundMessage + center);
            }

            timer.pause();
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step();
            await Promise.all([
                array[startPoint].unmark(),
                array[endPoint].unmark(),
                array[center].unmark(),
            ])
            timer.continue();
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

    async linearSearch(visualizer: Visualizer, array: Animatable[], value: number) {
        this.prismService.highlightLines("5-11");
        const timer = new Timer();

        for(let i = 0; i < array.length ;i++)
        {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefullyTerminatedMessage);
            }

            timer.pause();
            await array[i].mark(this.markColorLight);
            timer.continue();

            if(array[i].valueOf() == value)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           i,
                                           this.valueFoundMessage + i);
            }

            timer.pause();
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            await array[i].unmark()
            timer.continue();
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

    async jumpSearch(visualizer: Visualizer, array: Animatable[], value: number)
    {
        this.prismService.highlightLines("8-14");
        const timer = new Timer();
        let currentIndex = 0;
        const initialStep = Math.floor(Math.sqrt(array.length));
        let step = initialStep;

        while(array[Math.min(step,array.length)-1].valueOf() < value)
        {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefullyTerminatedMessage);
            }
            currentIndex = step;
            step += initialStep;
            if(currentIndex >= array.length)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
            }

            timer.pause();
            await array[currentIndex].mark(this.markColorDark);
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            timer.continue();
            // array[currentIndex].unmark();
        }

        this.prismService.highlightLines("16-21");
        while(array[currentIndex].valueOf() < value)
        {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          this.forcefullyTerminatedMessage);
            }
            currentIndex += 1;
            if(currentIndex == Math.min(step,array.length))
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           this.valueNotFoundMessage);
            }

            timer.pause();
            await array[currentIndex].mark(this.markColorLight);
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step();
            await array[currentIndex].unmark();
            timer.continue();
        }

        this.prismService.highlightLines("23-30");
        if(array[currentIndex].valueOf() == value)
        {
            timer.pause();
            await array[currentIndex].mark(this.markColorLight);
            timer.continue();
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
    public async bubbleSort(visualizer: Visualizer, array: any[])
    {
        this.prismService.highlightLines("6-17");
        const timer = new Timer();
        let remainingElements = array.length;
        do {
            for(let i = 0; i<remainingElements - 1; i++)
            {
                if(visualizer.hasRequestedForceQuit())
                {
                    return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               this.forcefullyTerminatedMessage);
                }

                timer.pause();
                await Promise.all([
                    array[i].mark(this.markColorLight),
                    array[i+1].mark(this.markColorLight),
                ])

                await SleepLock.sleep( () => visualizer.getLock() );
                if(array[i].value > array[i + 1].value)
                {
                    await visualizer.swap(i,i+1)
                }
                visualizer.step();
                await Promise.all([
                    array[i].unmark(),
                    array[i+1].unmark(),
                ])
                timer.continue();
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

    public async mergeSortWrapper(visualizer: Visualizer, array: any[])
    {
        const timer = new Timer();
        const output = await this.mergeSort(visualizer,timer,array,0);
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    private async mergeSort(visualizer: Visualizer, timer: Timer, array: any[], elementsBefore :number): Promise<any>
    {
        if(visualizer.hasRequestedForceQuit())
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                        null,
                                        this.forcefullyTerminatedMessage);
        }

        if(array.length <= 1)
        {
            timer.pause();
            this.prismService.highlightLines("5-8");
            await Promise.all(array.map(element => element.mark(this.markColorDark)));

            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()

            await Promise.all(array.map(element => element.unmark()));
            timer.continue();
            return array;
        }

        const center =  Math.floor(array.length/2);
        let leftArrayUnsorted = array.slice(0,center);
        let rightArrayUnsorted = array.slice(center);

        timer.pause();
        this.prismService.highlightLines("10-15");
        await Promise.all([
                ...leftArrayUnsorted.map(elem => elem.mark(this.markColorLight)),
                ...rightArrayUnsorted.map(elem => elem.mark(this.markColorLight)),
        ]);


        await SleepLock.sleep( () => visualizer.getLock() );
        visualizer.step()


        await Promise.all([
            ...leftArrayUnsorted.map(elem => elem.unmark()),
            ...rightArrayUnsorted.map(elem => elem.unmark()),
        ]);

        timer.continue();

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

    private async merge(visualizer: Visualizer, timer: Timer, left: any[], right: any[], leftOffset :number): Promise<AlgorithmOutput | Animatable[] | void>
    {
        if(visualizer.hasRequestedForceQuit())
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                        null,
                                        this.forcefullyTerminatedMessage);
        }

        timer.pause();
        this.prismService.highlightLines("17,26-54");

        await Promise.all([
            ...left.map(elem => elem.mark(this.markColorLight)),
            ...right.map(elem => elem.mark(this.markColorDark)),
        ]);



        await SleepLock.sleep( () => visualizer.getLock() );
        visualizer.step()

        await Promise.all([
            ...left.map(elem => elem.unmark()),
            ...right.map(elem => elem.unmark()),
        ]);

        timer.continue();

        return new Promise<Animatable[]>( (resolve)=>{

            let merged:Animatable[] = [];
            let leftIndex = 0;
            let rightIndex = 0;
            let mergedIndex = 0;

            const timeline = gsap.timeline({
                onComplete: () =>{
                    timer.continue();
                    resolve(merged);
                }
            })

            while( leftIndex < left.length && rightIndex < right.length)
            {
                if(left[leftIndex] < right[rightIndex])
                {
                    merged[mergedIndex] = left[leftIndex];
                    merged[mergedIndex].setPositionWithIndex(leftOffset + mergedIndex,timeline);
                    leftIndex++;
                }
                else
                {
                    merged[mergedIndex] = right[rightIndex];
                    merged[mergedIndex].setPositionWithIndex(leftOffset + mergedIndex,timeline);
                    rightIndex++;
                }
                mergedIndex++;
            }

            while(leftIndex < left.length)
            {
                merged[mergedIndex] = left[leftIndex];
                merged[mergedIndex].setPositionWithIndex(leftOffset + mergedIndex,timeline);

                mergedIndex++;
                leftIndex++;
            }

            while(rightIndex < right.length)
            {
                merged[mergedIndex] = right[rightIndex];
                merged[mergedIndex].setPositionWithIndex(leftOffset + mergedIndex,timeline);

                mergedIndex++;
                rightIndex++;
            }
            timer.pause();
        })
    }

    public readonly insertionSortSource = `
    function insertionSort(array)
    {
        for(let i= 0; i < array.length; i++)
        {
            let currentElement = array[i];
            let j = i-1
            while(j >= 0 && array[j] > currentElement)
            {
                array[j+1] = array[j];
                j--;
            }
            array[j+1] = currentElement;
        }
    }
    `
    public async insertionSort(visualizer: Visualizer, array: any[])
    {
        this.prismService.highlightLines("5-15");
        const timer = new Timer();
        for(let i= 0; i < array.length; i++)
        {
            timer.pause();
            await array[i].mark(this.markColorDark);
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            timer.continue();

            let currentElement = array[i];
            let j = i-1
            let swapped = []

            while(j >= 0 && array[j] > currentElement)
            {
                if(visualizer.hasRequestedForceQuit())
                {
                    return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               this.forcefullyTerminatedMessage);
                }
                // array[j+1] = array[j];
                timer.pause()
                await array[j].mark(this.markColorLight);
                timer.continue()

                swapped.push(j);

                timer.pause();
                await visualizer.swap(j,j+1)
                j--;

                await SleepLock.sleep( () => visualizer.getLock() );
                visualizer.step();
                timer.continue();
            }
            // array[j+1] = currentElement;
            timer.pause();
            await Promise.all([
                ...swapped.map((index) => array[index].unmark()),
                array[i].unmark()
            ]);
            timer.continue();
        }
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    public readonly selectionSortSource = `
    function selectionSort(array)
    {
        for(let i=0; i<array.length-1; i++)
        {
            let smallestElementIndex = i;
            for(let j=i+1; j<array.length; j++)
            {
                if(array[j] < array[smallestElementIndex])
                {
                    smallestElementIndex = j;
                }
            }

            if(smallestElementIndex != i)
            {
                let smallestElementCopy = array[smallestElementIndex];
                array[smallestElementIndex] = array[i];
                array[i] = smallestElementCopy;
            }
        }
    }
    `;

    public async selectionSort(visualizer: Visualizer, array: any[])
    {
        const timer = new Timer();
        for(let i=0; i<array.length-1; i++)
        {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                            null,
                                            this.forcefullyTerminatedMessage);
            }
            
            timer.pause();
            this.prismService.highlightLines("7-14");
            await array[i].mark(this.markColorDark);
            timer.continue();
            let smallestElementIndex = i;
            for(let j=i+1; j<array.length; j++)
            {
                if(visualizer.hasRequestedForceQuit())
                {
                    return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               this.forcefullyTerminatedMessage);
                }

                timer.pause();
                await array[j].mark(this.markColorLight);
                await SleepLock.sleep( () => visualizer.getLock() );
                visualizer.step();
                timer.continue();

                if(array[j] < array[smallestElementIndex])
                {
                    smallestElementIndex = j;
                }
                timer.pause();
                await array[j].unmark();
                timer.continue();
            }

            this.prismService.highlightLines("16-21");
            if(smallestElementIndex != i)
            {
                timer.pause();
                await array[smallestElementIndex].mark(this.markColorDark);
                await SleepLock.sleep( () => visualizer.getLock() );
                visualizer.step();
                await visualizer.swap(smallestElementIndex,i);
                await array[smallestElementIndex].unmark();
                timer.continue();
            }
            timer.pause();
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            await array[i].unmark();
            timer.continue();
        }
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                            null,
                                            "done");
    }

    public readonly quickSortSource = `
    function quickSort(array, startIndex, endIndex) {
        if (startIndex >= 0 && endIndex >= 0 && startIndex < endIndex) {
            const pivotIndex = partitionHoare(array, startIndex, endIndex);

            quickSort(array, startIndex, pivotIndex);
            quickSort(array, pivotIndex + 1, endIndex);
        }
    }

    function partitionHoare(array, startIndex, endIndex) {
        const pivot = array[Math.floor((endIndex - startIndex) / 2) + startIndex];

        let leftIndex = startIndex - 1;
        let rightIndex = endIndex + 1;

        while (true) {
            do {
                leftIndex += 1;
            } while (array[leftIndex] < pivot);

            do {
                rightIndex -= 1;
            } while (array[rightIndex] > pivot);

            if (leftIndex >= rightIndex) {
                return rightIndex;
            }

            const rightCopy = array[rightIndex];
            array[rightIndex] = array[leftIndex];
            array[leftIndex] = rightCopy;
        }
    }
    `;

    public async quickSortWrapper(visualizer: Visualizer, array: any[])
    {
        this.prismService.highlightLines("4-9");
        const timer = new Timer();
        timer.pause();
        await SleepLock.sleep( () => visualizer.getLock() );
        visualizer.step()
        timer.continue();
        const output = await this.quickSort(visualizer,timer,array,0,array.length-1);
        
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    private async quickSort(visualizer: Visualizer, timer: Timer, array: any[], startIndex: number, endIndex: number): Promise<AlgorithmOutput | void>
    {
        if(visualizer.hasRequestedForceQuit())
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                null,
                this.forcefullyTerminatedMessage);
        }

        if (startIndex >= 0 && endIndex >= 0 && startIndex < endIndex) {

            const pivotIndex = await this.partitionHoare(visualizer,timer,array, startIndex, endIndex);
            if(pivotIndex instanceof AlgorithmOutput)
            {
                return;
            }

            timer.pause();
            await array[pivotIndex].mark(this.markColorDark);
            this.prismService.highlightLines("7-8");
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            await array[pivotIndex].unmark();
            

            await this.quickSort(visualizer,timer,array, startIndex, pivotIndex);
            await this.quickSort(visualizer,timer,array, pivotIndex + 1, endIndex);

            // await Promise.all([
            //      this.quickSort(visualizer,timer,array, startIndex, pivotIndex),
            //      this.quickSort(visualizer,timer,array, pivotIndex + 1, endIndex),
            // ]);

            
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step()
            timer.continue();

        }
    }

    private async partitionHoare(visualizer: Visualizer, timer: Timer, array: any[], startIndex: number, endIndex: number)
    {
        this.prismService.highlightLines("5,18-34");
        const pivot = array[Math.floor((endIndex - startIndex) / 2) + startIndex];

        let leftIndex = startIndex - 1;
        let rightIndex = endIndex + 1;

        while (true) {
            if(visualizer.hasRequestedForceQuit())
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                    null,
                    this.forcefullyTerminatedMessage);
            }

            do {
                leftIndex += 1;
            } while (array[leftIndex] < pivot);

            do {
                rightIndex -= 1;
            } while (array[rightIndex] > pivot);

            if (leftIndex >= rightIndex) {
                return rightIndex;
            }

            timer.pause();
            await Promise.all([
                array[rightIndex].mark(this.markColorLight),
                array[leftIndex].mark(this.markColorLight),
            ]);
            await visualizer.swap(rightIndex,leftIndex);
            await SleepLock.sleep( () => visualizer.getLock() );
            visualizer.step();
            await Promise.all([
                array[rightIndex].unmark(),
                array[leftIndex].unmark(),
            ]);
            timer.continue();


        }
    }
}
// export default AlgorithmImplementations.getInstance();
