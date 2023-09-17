import { AlgorithmImplementations } from "src/app/algorithms/algorithm-implementations"
import { AlgorithmComplexity, AlgorithmDataOrderType, AlgorithmDetails, AlgorithmType } from "src/app/interfaces/algorithm-details"

export const Environment = {
    algorithms: {
        urlPrefix: "/algorithms",
        list: [
            {
                name: "Bubble Sort",
                linkName: "bubble-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                dataOrderType: AlgorithmDataOrderType.Random,
                type: AlgorithmType.Sorting,
                sourceCode: AlgorithmImplementations.bubbleSortSource,
                implementation: AlgorithmImplementations.bubbleSort
            },
            {
                name: "Insertion Sort",
                linkName: "insertion-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                dataOrderType: AlgorithmDataOrderType.Random,
                type: AlgorithmType.Sorting
            },
            {
                name: "Selection Sort",
                linkName: "selection-sort",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                dataOrderType: AlgorithmDataOrderType.Random,
                type: AlgorithmType.Sorting
            },
            {
                name: "Merge Sort",
                linkName: "merge-sort",
                timeComplexity: AlgorithmComplexity.Linearithmic,
                isInPlace: false,
                dataOrderType: AlgorithmDataOrderType.Random,
                type: AlgorithmType.Sorting,
                sourceCode: AlgorithmImplementations.mergeSortSource,
                implementation: AlgorithmImplementations.mergeSortWrapper
            },
            {
                name: "Quick Sort",
                linkName: "quick-sort",
                timeComplexity: AlgorithmComplexity.Linearithmic,
                isInPlace: true,
                dataOrderType: AlgorithmDataOrderType.Random,
                type: AlgorithmType.Sorting
            },
            {
                name: "Linear Search",
                linkName: "linear-search",
                timeComplexity: AlgorithmComplexity.Quadratic,
                isInPlace: true,
                type: AlgorithmType.Searching,
                dataOrderType: AlgorithmDataOrderType.Random,
                sourceCode: AlgorithmImplementations.linearSearchSource,
                implementation: AlgorithmImplementations.linearSearch
            },
            {
                name: "Binary Search",
                linkName: "binary-search",
                timeComplexity: AlgorithmComplexity.Logarithmic,
                isInPlace: true,
                type: AlgorithmType.Searching,
                dataOrderType: AlgorithmDataOrderType.Sorted,
                sourceCode: AlgorithmImplementations.binarySearchSource,
                implementation: AlgorithmImplementations.binarySearch
            },
            {
                name: "Jump Search",
                linkName: "jump-search",
                timeComplexity: AlgorithmComplexity.SquareRoot,
                isInPlace: true,
                type: AlgorithmType.Searching,
                dataOrderType: AlgorithmDataOrderType.Sorted,
                sourceCode: AlgorithmImplementations.jumpSearchSource,
                implementation: AlgorithmImplementations.jumpSearch
            },
        ] as AlgorithmDetails[]
    }
    // TODO: add Source Code
}