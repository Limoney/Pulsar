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
                type: AlgorithmType.Searching
            },
        ] as AlgorithmDetails[]
    }
    // TODO: add Source Code
}