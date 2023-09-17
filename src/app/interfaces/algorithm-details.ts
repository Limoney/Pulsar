import { AlgorithmOutput } from "./algorithm-output";

export interface AlgorithmDetails {
    name: string,
    linkName: string,
    timeComplexity: AlgorithmComplexity,
    type: AlgorithmType,
    isInPlace: boolean,
    dataOrderType: AlgorithmDataOrderType,
    sourceCode?: string,
    implementation?: (...args: any[]) => AlgorithmOutput,
}

export enum AlgorithmType
{
    Sorting,
    Searching,
}

export enum AlgorithmDataOrderType
{
    Random,
    Sorted,
}

export enum AlgorithmComplexity
{
    Constant = "O(1)",
    Logarithmic = "O(log n)",
    Linear = "O(n)",
    SquareRoot = "O(√n)",
    Linearithmic = "O(n log n)",
    Quadratic = "O(n^2)",
    Cubic = "O(n^3)",
    Exponential = "O(2^n)",
    Factorial = "O(n!)"
}
