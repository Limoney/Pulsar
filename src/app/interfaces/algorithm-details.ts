export interface AlgorithmDetails {
    name: string,
    linkName: string,
    timeComplexity: AlgorithmComplexity,
    type: AlgorithmType,
    isInPlace: boolean,
    sourceCode?: string,
    implementation?: any,
}

export enum AlgorithmType
{
    Sorting,
    Searching,
}

export enum AlgorithmComplexity
{
    Constant = "O(1)",
    Logarithmic = "O(log n)",
    Linear = "O(n)",
    Linearithmic = "O(n log n)",
    Quadratic = "O(n^2)",
    Cubic = "O(n^3)",
    Exponential = "O(2^n)",
    Factorial = "O(n!)"
}
