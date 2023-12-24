import {Visualizer} from "./visualizer";
import * as p5 from "p5";
import {Camera} from "../utility/Camera";
import {SleepLock} from "../utility/SleepLock";
import {Animatable} from "./animatable";
import {AlgorithmOutput} from "../../interfaces/algorithm-output";
import {VisualizerAttributes} from "./visualizer-attributes";
import {P5Service} from "../../services/p5.service";
import {Bar} from "./BarVisualizer/Bar";

export abstract class VisualizerCommon implements Visualizer
{
    protected attributes: VisualizerAttributes;
    protected sketchRef: p5;
    protected camera: Camera;
    protected lock: SleepLock;
    public elements: Animatable[] = [];
    protected paused = false;
    public algorithm: (...args: any[]) => AlgorithmOutput | Promise<AlgorithmOutput>

    protected constructor(attributes: VisualizerAttributes, camera: Camera, algorithm: (...args: any[]) => AlgorithmOutput | Promise<AlgorithmOutput>)
    {
        this.attributes = attributes;
        this.sketchRef = new P5Service().getP5Instance();
        this.camera = camera;
        this.lock = new SleepLock(this.attributes.msBetweenSteps);
        this.algorithm = algorithm;
    }

    public getLock(): SleepLock
    {
        return this.lock;
    }
    public step(): void
    {
        if(this.paused) 
        {
            this.pause();
        }
    }

    public abstract update(): void;

    public abstract push(element: Animatable): void;

    public abstract pop(): void;

    public abstract insert(element: Animatable,index: number): void;

    public abstract remove(index: number): void;

    public clear(): void
    {
        this.elements = []
    }

    public abstract restart(initialData: number[]): void;

    public async play(algorithmData: any)
    {
        this.attributes.forceQuit = false;
        return this.algorithm(this,this.elements,algorithmData);
    }

    public nextStep() {
        this.lock.unlock();
    }

    public resume()
    {
        this.paused = false;
        this.lock.unlock();
    }

    public pause()
    {
        this.paused = true;
        this.lock.lock();
    }

    public setSpeed(speedPercent: number): void
    {
        this.attributes.msBetweenSteps = this.attributes.msBetweenStepsDefault *(100 - speedPercent)/100 + this.attributes.minimumStepDuration;
        this.attributes.animationSpeedPercent = speedPercent;
        this.attributes.msComputedAnimationSpeed = this.attributes.msBetweenSteps/1000;
        this.lock.setSleepDuration(this.attributes.msBetweenSteps);
    }

    public abstract setData(values: number[]): void;

    public sort()
    {
        this.elements = this.elements.sort((left,right) => left.valueOf() - right.valueOf());
        for(let i=0;i<this.elements.length;i++)
        {
            this.elements[i].setPositionWithIndex(i);
        }
    }

    abstract swap(leftElement: number,rightElement: number): Promise<void>;

    public getElements(): Animatable[] {
        return this.elements;
    }

    public hasRequestedForceQuit(): boolean {
        return this.attributes.forceQuit;
    }

    public abstract createElement(value: number): Animatable;
}
