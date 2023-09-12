import { SleepLock } from "src/app/components/algorithms-page/visualization-panel/utility/SleepLock";
import { AlgorithmComplexity, AlgorithmDetails, AlgorithmType } from "src/app/interfaces/algorithm-details"

export const Environment = {
    algorithms: {
        urlPrefix: "/algorithms",
        list: [
            {
                name: "Bubble Sort",
                linkName: "bubble-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                type: AlgorithmType.Sorting
            },
            {
                name: "Insertion Sort",
                linkName: "insertion-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                type: AlgorithmType.Sorting
            },
            {
                name: "Selection Sort",
                linkName: "selection-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                type: AlgorithmType.Sorting
            },
            {
                name: "Merge Sort",
                linkName: "merge-sort",
                timeComplexity: AlgorithmComplexity.Linearithmic,
                isInPlace: false,
                type: AlgorithmType.Sorting
            },
            {
                name: "Quick Sort",
                linkName: "quick-sort",
                timeComplexity: AlgorithmComplexity.Linearithmic,
                isInPlace: true,
                type: AlgorithmType.Sorting
            },
            {
                name: "Linear Search",
                linkName: "linear-search",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                type: AlgorithmType.Searching
            },
            {
                name: "Binary Search",
                linkName: "binary-search",
                timeComplexity: AlgorithmComplexity.Logarithmic,
                isInPlace: true,
                type: AlgorithmType.Searching,
                sourceCode: `
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
                `,
                implementation: async (visualizer: any,array: number[],value: number) => { //TODO: move it to separate class like AlgorithmImplementations.binarySearch
                    let start = 0;
                    let end = array.length-1;
                    while(start <= end)
                    {
                        if(visualizer.forceQuit)
                        {
                            return null;
                        }

                        let center = Math.floor((start + end) / 2);
                        

                        let startPoint = start;
                        let endPoint = end;
                
                        visualizer.bars[startPoint].mark("#9b59b6");
                        visualizer.bars[endPoint].mark("#9b59b6");
                        visualizer.bars[center].mark("#8e44ad");
                
                
                        if(value > array[center])
                            start = center + 1;
                        else if(value < array[center])
                            end = center - 1;
                        else 
                        {
                            return center;
                        }
                        
                        await SleepLock.sleep( () => visualizer.lock );
                        
                        if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
                        {
                            visualizer.pause();
                        }
                        visualizer.bars[startPoint].unmark()
                        visualizer.bars[endPoint].unmark()
                        visualizer.bars[center].unmark()
                        
                    }
                    return -1;
                }
            },
        ] as AlgorithmDetails[]
    }
    // TODO: add Source Code
}