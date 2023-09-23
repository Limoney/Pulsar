import { Injectable } from '@angular/core';
import { AlgorithmComplexity, AlgorithmDataOrderType, AlgorithmDetails, AlgorithmType } from '../interfaces/algorithm-details';
import { AlgorithmImplementations } from '../algorithms/algorithm-implementations';

@Injectable({
	providedIn: 'root'
})
export class AlgorithmConfigService {

	public readonly algorithms;

	constructor(private algorithmImplementations: AlgorithmImplementations)
	{
		this.algorithms = {
			urlPrefix: "/algorithms",
			list: [
				{
					name: "Bubble Sort",
					linkName: "bubble-sort",
					timeComplexity: AlgorithmComplexity.Quadratic,
					isInPlace: true,
					dataOrderType: AlgorithmDataOrderType.Random,
					type: AlgorithmType.Sorting,
                    isRecursive: false,
					sourceCode: algorithmImplementations.bubbleSortSource,
					implementation: algorithmImplementations.bubbleSort.bind(algorithmImplementations)
				},
				{
					name: "Insertion Sort",
					linkName: "insertion-sort",
					timeComplexity: AlgorithmComplexity.Quadratic,
					isInPlace: true,
					dataOrderType: AlgorithmDataOrderType.Random,
					type: AlgorithmType.Sorting,
                    isRecursive: false,
					sourceCode: algorithmImplementations.insertionSortSource,
					implementation: algorithmImplementations.insertionSort.bind(algorithmImplementations)
				},
				{
					name: "Selection Sort",
					linkName: "selection-sort",
					timeComplexity: AlgorithmComplexity.Quadratic,
					isInPlace: true,
					dataOrderType: AlgorithmDataOrderType.Random,
					type: AlgorithmType.Sorting,
                    isRecursive: false,
					sourceCode: algorithmImplementations.selectionSortSource,
					implementation: algorithmImplementations.selectionSort.bind(algorithmImplementations)
				},
				{
					name: "Merge Sort",
					linkName: "merge-sort",
					timeComplexity: AlgorithmComplexity.Linearithmic,
					isInPlace: false,
					dataOrderType: AlgorithmDataOrderType.Random,
					type: AlgorithmType.Sorting,
                    isRecursive: true,
					sourceCode: algorithmImplementations.mergeSortSource,
					implementation: algorithmImplementations.mergeSortWrapper.bind(algorithmImplementations)
				},

				{
					name: "Quick Sort",
					linkName: "quick-sort",
					timeComplexity: AlgorithmComplexity.Linearithmic,
					isInPlace: true,
					dataOrderType: AlgorithmDataOrderType.Random,
					type: AlgorithmType.Sorting,
                    isRecursive: true,
					sourceCode: algorithmImplementations.quickSortSource,
					implementation: algorithmImplementations.quickSortWrapper.bind(algorithmImplementations)
				},
				{
					name: "Linear Search",
					linkName: "linear-search",
					timeComplexity: AlgorithmComplexity.Quadratic,
					isInPlace: true,
					type: AlgorithmType.Searching,
					dataOrderType: AlgorithmDataOrderType.Random,
                    isRecursive: false,
					sourceCode: algorithmImplementations.linearSearchSource,
					implementation: algorithmImplementations.linearSearch.bind(algorithmImplementations)
				},
				{
					name: "Binary Search",
					linkName: "binary-search",
					timeComplexity: AlgorithmComplexity.Logarithmic,
					isInPlace: true,
					type: AlgorithmType.Searching,
					dataOrderType: AlgorithmDataOrderType.Sorted,
                    isRecursive: false,
					sourceCode: algorithmImplementations.binarySearchSource,
					implementation: algorithmImplementations.binarySearch.bind(algorithmImplementations)
				},
				{
					name: "Jump Search",
					linkName: "jump-search",
					timeComplexity: AlgorithmComplexity.SquareRoot,
					isInPlace: true,
					type: AlgorithmType.Searching,
					dataOrderType: AlgorithmDataOrderType.Sorted,
                    isRecursive: false,
					sourceCode: algorithmImplementations.jumpSearchSource,
					implementation: algorithmImplementations.jumpSearch.bind(algorithmImplementations)
				},

			] as AlgorithmDetails[]
		}
	}
}
