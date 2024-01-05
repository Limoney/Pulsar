import { Injectable } from '@angular/core';
import {PieVisualizer} from "../algorithms/visualizers/PieVisualizer/PieVisualizer";
import {BarVisualizer} from "../algorithms/visualizers/BarVisualizer/BarVisualizer";
import {VisualizerAttributes} from "../algorithms/visualizers/visualizer-attributes";
import {Camera} from "../algorithms/utility/Camera";
import {AlgorithmOutput} from "../interfaces/algorithm-output";
import {VisualizationManagerService} from "./visualization-manager.service";

@Injectable({
  providedIn: 'root'
})
export class VisualizerFactoryService {

    public readonly visualizerList = [
        {name: "Bar", class: BarVisualizer},
        {name: "Pie", class: PieVisualizer}
    ]

    constructor(private visualizationManager: VisualizationManagerService) {

    }

    public create(visualizerName: string, 
                  camera: Camera,
                  algorithm: (...args: any[]) => AlgorithmOutput | Promise<AlgorithmOutput>,
                  visualizationData: number[])
    {
        let index =this.visualizerList.map(element => element.name).indexOf(visualizerName);
        const visualizer = new this.visualizerList[index].class(this.visualizationManager.getAttributes(),camera,algorithm);
        visualizer.setData(visualizationData);
        return visualizer;
    }
}
