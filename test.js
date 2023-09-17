let arr =  [11,22,33,44,55,66,77,88,99,111,122,133,144,155,166,177,188,199,222,333,444,555,666,777,888,999]

function jumpSearch(array,value)
{
    let currentIndex = 0;
    const step = Math.sqrt(array.length);
    while(array[Math.min(step,array.length)-1] < value)
    {
        currentIndex = step;
        step += step;
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

// const out = jumpSearch(arr,123);
// console.log(out);

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
let unsorted = [15,7,18,59,17,68,19,57,19,590,75,18,0,-5,1,68,26,61,95,28];
const out = mergeSort(unsorted)
console.log(out);

// const timer = new Timer();
//         let prevBlock = 0
//         let step = Math.floor(Math.sqrt(array.length))
//         while (array[Math.min(step,array.length)-1] < value)
//         {

//             if(visualizer.forceQuit)
//             {
//                 return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                         null,
//                                         AlgorithmImplementations.forcefulyTerminatedMessage);
//             }

//             prevBlock = step;
//             step += Math.floor(Math.sqrt(array.length));
//             visualizer.bars[prevBlock].mark("#9b59b6");
//             if (prevBlock > array.length)
//             {
//                 return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                            -1,
//                                            AlgorithmImplementations.valueNotFoundMessage);
//             }

//             timer.pause();
//             await SleepLock.sleep( () => visualizer.lock );
//             timer.continue();
//             if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
//             {
//                 visualizer.pause();
//             }

//             visualizer.bars[prevBlock + Math.floor(Math.sqrt(array.length)) ].mark("#9b59b6");
//         }
//         // debugger
//         while (array[prevBlock] < value)
//         {
//             if(visualizer.forceQuit)
//             {
//                 return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                         null,
//                                         AlgorithmImplementations.forcefulyTerminatedMessage);
//             }

//             prevBlock++;
//             if (prevBlock == Math.min(step, array.length))
//             {
//                 return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                            -1,
//                                            AlgorithmImplementations.valueNotFoundMessage);
//             }
//             visualizer.bars[prevBlock].mark("#8e44ad");

//             timer.pause();
//             await SleepLock.sleep( () => visualizer.lock );
//             timer.continue();
//             if(!visualizer.shouldMakNextStep && visualizer.stepByStep)
//             {
//                 visualizer.pause();
//             }

//             visualizer.bars[prevBlock].unmark();
//         }
        
//         if (array[prevBlock] == value)
//         {
//             return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                            prevBlock,
//                                            AlgorithmImplementations.valueFoundMessage + prevBlock);
//         }
//         else
//         {
//             return new AlgorithmOutput(new Date(timer.getElapsedTime()),
//                                            -1,
//                                            AlgorithmImplementations.valueNotFoundMessage);
//         }