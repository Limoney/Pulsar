import {AlgorithmOutput} from "../../interfaces/algorithm-output";
import {Animatable} from "./animatable";
import {SleepLock} from "../utility/SleepLock";

//instead of each creating Visualizer creating specific elements like bars and slices it should just get them and do its thing
//turn it into a class that implements these methods (its like image class)
export interface Visualizer
{
    update(): void;

    push(element: Animatable): void;

    pop(): void;

    insert(element: Animatable,index: number): void;

    remove(index: number): void;

    clear(): void;

    restart(initialData: number[]): void;

    play(algorithm: any): Promise<AlgorithmOutput>;

    nextStep(): void;

    resume(): void;

    pause(): void;

    setSpeed(speedPercent: number): void;

    setData(initialData: number[]): void;

    getElements(): Animatable[];

    getLock(): SleepLock;

    step(): void;

    hasRequestedForceQuit(): boolean;

    sort(): void;

    swap(leftIndex: number, rightIndex: number): Promise<void>
    
    createElement(value: number): Animatable;
}


