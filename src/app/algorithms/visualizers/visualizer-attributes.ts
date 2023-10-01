import {Bar} from "./BarVisualizer/Bar";
import * as p5 from "p5";
import {AlgorithmOutput} from "../../interfaces/algorithm-output";
import {SleepLock} from "../utility/SleepLock";
import {P5Service} from "../../services/p5.service";
import {Camera} from "../utility/Camera";
import {Animatable} from "./animatable";

export class VisualizerAttributes {
    public stepByStep: boolean;
    public minimumStepDuration: number = 10;
    public readonly msBetweenStepsDefault;
    public msBetweenSteps: number;
    public forceQuit: boolean = false;
    public animationSpeedPercent = 0;
    public msComputedAnimationSpeed = 0;
    public valueLabelsHidden = false;
    public selectedVisualizer: string;

    constructor(visualizerName: string,msBetweenSteps: number) {
        this.selectedVisualizer = visualizerName;
        this.msBetweenStepsDefault = msBetweenSteps;
        this.msBetweenSteps = this.msBetweenStepsDefault;
        this.stepByStep = false;
    }

    // copy()
    // {
    //     let attributes = new VisualizerAttributes(this.algorithm,this.msBetweenStepsDefault);
    //     attributes.stepByStep = this.stepByStep;
    //     attributes.minimumStepDuration = this.minimumStepDuration;
    //     attributes.elements = [];
    //     attributes.forceQuit = false;
    //     return attributes;
    // }
}
