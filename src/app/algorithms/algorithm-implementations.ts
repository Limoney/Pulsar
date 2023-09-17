import { SleepLock } from "src/app/algorithms/utility/SleepLock";
import { Timer } from "src/app/algorithms/utility/Timer";
import { AlgorithmOutput } from "src/app/interfaces/algorithm-output"
import { ThemeService } from "../services/theme.service";
export class AlgorithmImplementations
{

    private static forcefulyTerminatedMessage = "forcefully terminated";
    private static valueFoundMessage = "value found at index ";
    private static valueNotFoundMessage = "value not found ";
    // private static themeService = new ThemeService();
    // private static markColorLight = AlgorithmImplementations.themeService.getColor("purple-500")
    // private static markColorDark = AlgorithmImplementations.themeService.getColor("purple-600")
    private static markColorLight = "#9b59b6";
    private static markColorDark = "#8e44ad";

    public static readonly binarySearchSource = `
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

    static async binarySearch(visualizer: any,array: number[],value: number) {
        let start = 0;
        let end = array.length-1;
        const timer = new Timer();
        while(start <= end)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                           AlgorithmImplementations.forcefulyTerminatedMessage);
            }

            let center = Math.floor((start + end) / 2);
            

            let startPoint = start;
            let endPoint = end;
    
            visualizer.bars[startPoint].mark(AlgorithmImplementations.markColorLight);
            visualizer.bars[endPoint].mark(AlgorithmImplementations.markColorLight);
            visualizer.bars[center].mark(AlgorithmImplementations.markColorDark);
    
    
            if(value > array[center])
                start = center + 1;
            else if(value < array[center])
                end = center - 1;
            else 
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           center,
                                           AlgorithmImplementations.valueFoundMessage + center);
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
                                           AlgorithmImplementations.valueNotFoundMessage);
    }
    
    public static readonly linearSearchSource = `
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

    static async linearSearch(visualizer: any,array: number[],value: number) {
        const timer = new Timer();

        for(let i = 0; i < array.length ;i++)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          AlgorithmImplementations.forcefulyTerminatedMessage);
            }

            visualizer.bars[i].mark(AlgorithmImplementations.markColorLight);
            if(array[i] == value)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           i,
                                           AlgorithmImplementations.valueFoundMessage + i);
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
                                           AlgorithmImplementations.valueNotFoundMessage);
    }

    //https://en.wikipedia.org/wiki/Jump_search
    public static readonly jumpSearchSource = `
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
    
    static async jumpSearch(visualizer: any,array: number[],value: number)
    {
        const timer = new Timer();
        let currentIndex = 0;
        const initialStep = Math.floor(Math.sqrt(array.length));
        let step = initialStep;
        while(array[Math.min(step,array.length)-1] < value)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          AlgorithmImplementations.forcefulyTerminatedMessage);
            }
            currentIndex = step;
            step += initialStep;
            if(currentIndex >= array.length)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           AlgorithmImplementations.valueNotFoundMessage);
            }
            visualizer.bars[currentIndex].mark(AlgorithmImplementations.markColorDark);

            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            // visualizer.bars[currentIndex].unmark();
        }

        while(array[currentIndex] < value)
        {
            if(visualizer.forceQuit)
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           null,
                                          AlgorithmImplementations.forcefulyTerminatedMessage);
            }
            currentIndex += 1;
            if(currentIndex == Math.min(step,array.length))
            {
                return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           AlgorithmImplementations.valueNotFoundMessage);
            }

            visualizer.bars[currentIndex].mark(AlgorithmImplementations.markColorLight);
            timer.pause();
            await SleepLock.sleep( () => visualizer.lock );
            timer.continue();
            if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
            {
                visualizer.pause();
            }
            visualizer.bars[currentIndex].unmark();
        }

        if(array[currentIndex] == value)
        {
            visualizer.bars[currentIndex].mark(AlgorithmImplementations.markColorLight);
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           currentIndex,
                                           AlgorithmImplementations.valueFoundMessage + currentIndex);
        }
        else
        {
            return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                           -1,
                                           AlgorithmImplementations.valueNotFoundMessage);
        }
    }

    public static readonly bubbleSortSource = `
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
    public static async bubbleSort(visualizer: any,array: any[])
    {
        const timer = new Timer();
        // debugger;
        let remainingElements = array.length;
        do {
            for(let i = 0; i<remainingElements - 1; i++)
            {
                if(visualizer.forceQuit)
                {
                    return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               AlgorithmImplementations.forcefulyTerminatedMessage);
                }

                visualizer.bars[i].mark(AlgorithmImplementations.markColorLight);
                visualizer.bars[i+1].mark(AlgorithmImplementations.markColorLight);
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

    public static readonly mergeSortSource = `
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

    public static async mergeSortWrapper(visualizer: any, array: any[])
    {
        const timer = new Timer();
        const output = await AlgorithmImplementations.mergeSort(visualizer,timer,array);
        console.log(output);
        visualizer.setBarsTest(output);
        return new AlgorithmOutput(new Date(timer.getElapsedTime()),
                                               null,
                                               "done");
    }

    private static async mergeSort(visualizer: any,timer: Timer, array: any[]): Promise<any[]>
    {
        if(array.length <= 1)
        {
            return array;
        }

        const center =  Math.floor(array.length/2);
        let leftArrayUnsorted = array.slice(0,center);
        let rightArrayUnsorted = array.slice(center);

        let leftArraySorted = await AlgorithmImplementations.mergeSort(visualizer,timer,leftArrayUnsorted);
        let rightArraySorted = await AlgorithmImplementations.mergeSort(visualizer,timer,rightArrayUnsorted);

        const merged = AlgorithmImplementations.merge(visualizer,leftArraySorted,rightArraySorted);
        //visualizer.setData(merged);
        // await SleepLock.sleep( () => visualizer.lock );
        return merged;
    }

    private static async merge(visualizer: any,left: any[], right: any[]): Promise<any[]>
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
}